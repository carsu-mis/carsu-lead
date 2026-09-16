FROM node:20-slim

WORKDIR /app

# Ensure basic CA certificates are present for HTTPS API requests
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

# Compile NestJS / TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]