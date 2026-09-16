FROM node:20

  WORKDIR /app

  # Puppeteer bundles its own Chrome binary, but the base node:20 (Debian)
  # image doesn't ship the shared libraries Chrome needs at runtime
  # (e.g. libnspr4.so, libnss3.so). Without these, PDF generation fails
  # with "error while loading shared libraries", which — since PDF
  # generation runs before the email sends in lna.service.ts/idp.service.ts —
  # silently skips every email for that submission.
  RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

  COPY package*.json ./
  RUN npm install

  COPY . .
  RUN npm run build

  EXPOSE 3001

  CMD ["node", "dist/main"]