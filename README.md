# ☁️ Cloud Task Manager - Backend

This is the highly optimized, Dockerized backend API for the Cloud Task Manager application. Built with Node.js, it features a multi-stage Docker build process and a fully automated CI/CD pipeline to handle all core business logic securely and efficiently.

## 🚀 Tech Stack
* **Runtime:** Node.js 20 Alpine
* **Framework:** Express / Node API
* **Containerization:** Docker (Multi-stage builds)
* **CI/CD:** GitHub Actions (Automated testing, buildx caching, and deployment to Docker Hub)

## 🏗️ Architecture
This project utilizes a multi-stage Dockerfile to minimize the final image size and enhance security for the backend:
1. **Deps:** Installs necessary dependencies using Alpine compatibility.
2. **Builder:** Compiles any necessary backend code or TypeScript (if applicable).
3. **Runner:** A lean, production-ready environment running as a secure, non-root user (`nodejs`).

## 🛠️ Local Development

First, install the dependencies:
```bash
npm install
```
***

### 🎁 Bonus: The Backend Dockerfile
Since you had that incredibly optimized, multi-stage Dockerfile for your frontend earlier, here is the exact matching **multi-stage Dockerfile for your Node.js backend** if you don't have it set up yet. Put this in your `backend/Dockerfile`:

```dockerfile
# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ==========================================
# STAGE 2: Builder (If you need a build step, otherwise skip)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If you have a build script (like TypeScript), uncomment the next line:
# RUN npm run build

# ==========================================
# STAGE 3: Production Runner (The Final Image)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy built code and dependencies
COPY --from=builder --chown=nodeuser:nodejs /app ./

# Switch to the secure non-root user
USER nodeuser

# Expose your backend port (adjust if your backend uses a different port)
EXPOSE 8080
ENV PORT 8080

# Run the backend server
CMD ["npm", "start"]