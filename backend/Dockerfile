FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

# Compile NestJS / TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]