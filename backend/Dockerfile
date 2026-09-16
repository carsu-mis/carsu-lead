FROM node:20

WORKDIR /app

# Install system dependencies required for Puppeteer / Headless Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libasound2dev \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm-dev \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Skip downloading bundled Chromium if using the system chromium package
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]