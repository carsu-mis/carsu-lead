FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
# Explicitly block Chromium binary fetch
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]