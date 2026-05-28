# Base image
FROM node:20-alpine

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build


# Use dumb-init to run the app
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Run application
CMD ["npm", "start"]
