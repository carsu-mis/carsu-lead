FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Prevent npm ci from downloading heavy Chromium binaries
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
RUN npm ci --loglevel=error

COPY . .

# Compile NestJS / TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]