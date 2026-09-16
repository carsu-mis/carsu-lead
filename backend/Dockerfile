FROM node:20-slim

WORKDIR /app

# Install only basic SSL certificates needed for outbound HTTPS requests
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

# Build the TypeScript dist output
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]