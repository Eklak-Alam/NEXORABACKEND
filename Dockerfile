# ==========================================
# STAGE 1: Builder (Install all deps)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Install only production dependencies
RUN npm ci --omit=dev

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create a secure non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser

# Copy production node_modules from builder
COPY --from=builder --chown=expressuser:nodejs /app/node_modules ./node_modules

# Copy your actual backend code
COPY --chown=expressuser:nodejs . .

# Switch to the non-root user
USER expressuser

EXPOSE 5000

# Start the server directly with Node
CMD ["node", "index.js"]