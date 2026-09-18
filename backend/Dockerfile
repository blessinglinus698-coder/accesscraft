FROM ghcr.io/puppeteer/puppeteer:22.15.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]