# ==========================================
# STAGE 1: Builder (Install all deps)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# The * means it won't crash if package-lock isn't there, 
# but npm ci WILL still crash without it.
COPY package.json package-lock.json* ./

# FIX: Changed 'npm ci' to 'npm install' so it works even without a lock file.
# Once you push your package-lock.json, you can change this back to 'npm ci'.
RUN npm install --omit=dev

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# FIX: Added '=' to fix the "LegacyKeyValueFormat" warning
ENV NODE_ENV=production

# Create a secure non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser

# Step A: Copy your source code first
COPY --chown=expressuser:nodejs . .

# Step B: Copy production node_modules from builder AFTER source code
# This ensures the clean modules from the builder stage overwrite 
# any messy local modules you might have on your computer.
COPY --from=builder --chown=expressuser:nodejs /app/node_modules ./node_modules

# Switch to the non-root user
USER expressuser

EXPOSE 5000

# Start the server
CMD ["node", "index.js"]