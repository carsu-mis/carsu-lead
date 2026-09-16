FROM node:20-slim

WORKDIR /app

# Install system dependencies for Puppeteer's bundled Chrome
# Using metapackages ensures all required shared libraries (libnss3, libnspr4, etc.) 
# install cleanly without failing on Debian package name updates.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2-plugins \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# Compile NestJS / TypeScript source
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]