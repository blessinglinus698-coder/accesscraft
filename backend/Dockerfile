FROM ghcr.io/puppeteer/puppeteer:22.15.0

USER root

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R pptruser:pptruser /app

USER pptruser

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]