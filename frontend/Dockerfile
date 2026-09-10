FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]