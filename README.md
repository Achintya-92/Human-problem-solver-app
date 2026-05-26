# 🚀 Human Problem Solver System (HPSS)

A production-ready full-stack platform where users share real-life problems and receive practical solutions from real humans, powered by AI-assisted matching and ranking.

## 🎯 Features

### Core Platform
- **Problem & Solution Marketplace** - Users post problems, experts provide solutions
- **Expert Consultation** - Book 1-on-1 consultations with verified experts
- **AI-Assisted Matching** - AI helps categorize problems and match with experts
- **Trust & Reputation System** - Voting, badges, trust scores
- **Real-time Notifications** - Stay updated on interactions
- **Admin Dashboard** - Moderate content, manage users, verify experts

### Technical Highlights
- **Modern Frontend** - Next.js App Router, React 19, Tailwind CSS, dark mode
- **Scalable Backend** - Express.js REST API, PostgreSQL, Prisma ORM
- **Production Ready** - Docker, Nginx, SSL, Rate limiting, Security headers
- **Cloud Deployment** - AWS EC2, RDS, S3 ready
- **Type-Safe** - Full TypeScript across stack

## 📋 Quick Start

### Prerequisites
- Docker & Docker Compose (or Node.js 20+, PostgreSQL)
- Git
- 2GB RAM, 10GB disk space

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/hpss.git
cd hpss

# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# Run migrations and seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

Access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📚 Demo Credentials

After seeding, login with:

**Expert Account:**
- Email: `alice@example.com`
- Password: `password123`

**Regular User:**
- Email: `emma@example.com`
- Password: `password123`

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)             │
│  React 19 | Tailwind | Dark Mode        │
└────────────┬──────────────────────────┬─┘
             │                          │
        ┌────▼────┐              ┌──────▼────┐
        │  Nginx   │◄────────────►│ Backend   │
        │ Reverse  │  Rate Limit  │(Express)  │
        │  Proxy   │  SSL/CORS    │TypeScript │
        └──────────┘              └──────┬────┘
                                         │
                                    ┌────▼────────┐
                                    │ PostgreSQL   │
                                    │  Prisma ORM  │
                                    └──────────────┘
```

## 📁 Project Structure

```
hpss/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, validation, errors
│   │   ├── utils/              # Helpers, JWT, env
│   │   └── db/                 # Database setup
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── migrations/         # Migration history
│   ├── Dockerfile              # Production image
│   └── package.json
│
├── frontend/                   # Next.js React app
│   ├── src/
│   │   ├── app/                # Pages & layouts
│   │   ├── components/         # Reusable components
│   │   ├── lib/                # Utilities & API client
│   │   └── providers/          # Context providers
│   ├── Dockerfile              # Production image
│   └── package.json
│
├── nginx/                      # Reverse proxy config
│   └── nginx.conf
│
├── docker-compose.yml          # Multi-container setup
├── ecosystem.config.json       # PM2 configuration
├── DEPLOYMENT.md               # Detailed deployment guide
└── .env.example                # Environment template
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Problems
- `GET /api/problems` - List problems (with filters)
- `POST /api/problems` - Create problem
- `GET /api/problems/:id` - Get problem detail
- `POST /api/problems/:id/solutions` - Add solution
- `POST /api/problems/:id/vote` - Vote on solution

### Experts
- `GET /api/experts` - List experts
- `GET /api/experts/:id` - Get expert profile
- `PUT /api/experts/me` - Update expert profile

### Consultations
- `POST /api/consultations/experts/:id/book` - Book consultation
- `GET /api/consultations` - List my consultations
- `PATCH /api/consultations/:id/status` - Update status

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:id/read` - Mark as read

## 🗄️ Database Schema

### Core Models
- **User** - Accounts, roles (USER/EXPERT/ADMIN)
- **Expert** - Professional profiles, specializations
- **Problem** - Questions/issues posted
- **Solution** - Answers with votes & ratings
- **Category** - Problem categorization
- **Consultation** - Expert 1-on-1 bookings

### Relationship Models
- **Vote** - Solution/problem ratings
- **Comment** - Threaded discussions
- **Badge** - User achievements
- **TrustScore** - Reputation calculation
- **Notification** - Activity feed
- **Report** - Moderation reports

See `backend/prisma/schema.prisma` for full schema.

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs with salt
- ✅ **Helmet.js** - HTTP security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **Rate Limiting** - Nginx rate limits
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **XSS Protection** - Content-Security-Policy headers
- ✅ **Environment Variables** - Sensitive config protection

## 🚀 Deployment

### Quick Deploy (Docker)

```bash
# Production with SSL
docker-compose --env-file .env.production up -d
```

### AWS EC2 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- AWS EC2 setup
- RDS PostgreSQL
- SSL with Let's Encrypt
- Nginx reverse proxy
- PM2 process management
- Monitoring & backups

### Health Check
```bash
curl http://localhost:5000/health
curl http://localhost:3000
```

## 🧪 Testing

### Seed Database
```bash
npm run seed
```

### Database Studio
```bash
npx prisma studio
```

### API Testing
Use Postman/Insomnia with provided endpoints above.

## 📊 Monitoring

```bash
# Docker stats
docker stats

# Container logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database
docker-compose exec db psql -U postgres -d hpss
```

## 🔄 Updates

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

## 🆘 Troubleshooting

### Containers won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database connection issues
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running
- Check network connectivity

### Port already in use
```bash
# Change ports in docker-compose.yml
# Or kill process using port:
lsof -i :5000
kill -9 <PID>
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - AWS, Docker, PM2
- [Database Schema](./backend/prisma/schema.prisma) - Full model definitions
- [API Routes](./backend/src/routes) - Endpoint implementations
- [Frontend Components](./frontend/src/components) - UI components

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🙋 Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/hpss/issues)
- Discussions: [Ask questions](https://github.com/yourusername/hpss/discussions)
- Email: support@hpss.example.com

## 🎉 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)

---

**Made with ❤️ for the community**

