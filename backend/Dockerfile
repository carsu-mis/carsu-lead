FROM node:20-slim

WORKDIR /app

# Install system Chromium (automatically pulls libnspr4, libnss3, fonts, and X11 libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Force Puppeteer to use the system-installed Chromium binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

# Compile NestJS / TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]