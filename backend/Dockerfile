FROM node:20-slim

WORKDIR /app

# Install system dependencies required for Puppeteer / Headless Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# Copy dependency definitions first to utilize Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy remaining source code
COPY . .

# Build the TypeScript production dist/ directory
RUN npm run build

# Expose backend service port
EXPOSE 3001

# Boot application from compiled main entrypoint
CMD ["node", "dist/main"]