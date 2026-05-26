# HPSS Deployment Guide

This guide covers deployment options for the Human Problem Solver System.

## Table of Contents
1. [Docker Compose (Local/Development)](#docker-compose-local)
2. [Docker Compose (Production)](#docker-compose-production)
3. [AWS EC2 Deployment](#aws-ec2-deployment)
4. [Manual PM2 Deployment](#manual-pm2-deployment)

---

## Docker Compose (Local)

### Prerequisites
- Docker & Docker Compose installed
- Port 80, 5000, 3000 available (or modify `docker-compose.yml`)

### Steps

1. **Clone and setup environment:**
```bash
cd /path/to/hpss
cp .env.example .env
```

2. **Update `.env` for development:**
```bash
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@db:5432/hpss?schema=public"
JWT_SECRET="dev_secret_key_123"
CORS_ORIGIN="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

3. **Build and start containers:**
```bash
docker-compose up -d
```

4. **Run migrations (first time only):**
```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Useful Commands
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Stop all services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Database management
docker-compose exec backend npx prisma studio
```

---

## Docker Compose (Production)

### Prerequisites
- Docker & Docker Compose
- SSL certificate (for HTTPS)
- Domain name

### Steps

1. **Prepare production environment:**
```bash
cp .env.example .env.production
```

2. **Update `.env.production`:**
```bash
NODE_ENV=production
DATABASE_URL="postgresql://postgres:strong_password@db:5432/hpss?schema=public"
JWT_SECRET="generate_strong_secret_here"
CORS_ORIGIN="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
```

3. **Update backend package.json for production:**
```bash
# Remove devDependencies from production image
npm install --omit=dev
```

4. **Start with production env:**
```bash
docker-compose --env-file .env.production up -d
```

5. **Setup SSL with Let's Encrypt (via nginx-certbot):**
```bash
# Add to docker-compose.yml (optional certbot service)
docker-compose exec nginx certbot certonly --standalone -d yourdomain.com
```

---

## AWS EC2 Deployment

### Architecture
- **Compute**: EC2 t3.medium (or larger)
- **Database**: RDS PostgreSQL (or EC2 PostgreSQL)
- **Storage**: S3 for file uploads
- **Load Balancer**: Optional ALB for multi-instance
- **Security**: VPC, Security Groups, IAM roles

### Step 1: Launch EC2 Instance

1. Go to **AWS EC2 Console**
2. Click **Launch Instance**
3. **AMI**: Ubuntu 22.04 LTS (ami-xxxx)
4. **Instance Type**: t3.medium or larger
5. **Security Group** - Allow:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 22 (SSH)
6. **Storage**: 30GB (gp3)

### Step 2: SSH into Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-instance.compute.amazonaws.com
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for migrations)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (for process management)
sudo npm install -g pm2

# Install Nginx (if not using Docker)
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 4: Clone and Setup Repository

```bash
cd /home/ubuntu
git clone https://github.com/yourusername/hpss.git
cd hpss

# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL="postgresql://username:password@rds-endpoint:5432/hpss"
JWT_SECRET="$(openssl rand -base64 32)"
CORS_ORIGIN="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
EOF
```

### Step 5: Setup RDS PostgreSQL (Recommended)

1. Go to **AWS RDS Console**
2. Click **Create database**
3. **Engine**: PostgreSQL 16
4. **DB Instance**: db.t3.micro or larger
5. **Database name**: hpss
6. **Master username**: postgres
7. **Master password**: (strong password)
8. **VPC Security Group**: Allow EC2 instance
9. Note the **Endpoint** and update `DATABASE_URL`

### Step 6: Deploy with Docker Compose

```bash
cd /home/ubuntu/hpss

# Build and start services
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### Step 7: Setup SSL Certificate

```bash
# Using Let's Encrypt via Certbot (standalone)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Or for nginx (if nginx is running externally)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 8: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/hpss`:

```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

    # API routes
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/hpss /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup Auto-renewal for SSL

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renew via cron
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 10: Monitor and Scale

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor resource usage
docker stats

# Scale backend (if using Swarm or K8s)
docker-compose up -d --scale backend=3
```

---

## Manual PM2 Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL running
- PM2 installed globally

### Steps

1. **Setup application:**
```bash
git clone https://yourusername/hpss.git
cd hpss
```

2. **Install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. **Build applications:**
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

4. **Start with PM2:**
```bash
pm2 start ecosystem.config.json --env production

# Save PM2 config to start on reboot
pm2 startup
pm2 save
```

5. **Monitor:**
```bash
pm2 monit
pm2 logs
pm2 status
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3000

# Check database
psql -h localhost -U postgres -d hpss -c "SELECT version();"
```

### Backups

```bash
# Database backup
docker-compose exec db pg_dump -U postgres hpss > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres hpss < backup_20260525.sql
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### Performance Optimization

1. **Enable caching** in Nginx
2. **Use CDN** for static assets
3. **Configure database connection pooling**
4. **Enable gzip compression**
5. **Monitor with CloudWatch (AWS)**

---

## Troubleshooting

### Containers not starting
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database connection failed
- Check `DATABASE_URL` in `.env`
- Verify database service is running: `docker-compose ps`
- Check security groups allow traffic

### SSL certificate errors
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Out of memory
```bash
# Check container memory
docker stats

# Increase limits in docker-compose.yml
# Add to service: mem_limit: 2g
```

---

## Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use strong database password
- [ ] Enable SSL/HTTPS
- [ ] Restrict security group ports
- [ ] Enable database backups
- [ ] Setup monitoring and alerts
- [ ] Regular security updates
- [ ] Enable rate limiting
- [ ] Setup log aggregation

---

## Support

For issues or questions, please open an issue on GitHub.
