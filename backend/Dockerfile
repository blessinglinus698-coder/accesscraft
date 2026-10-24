FROM ghcr.io/puppeteer/puppeteer:22.15.0

USER root

WORKDIR /app

# The base image already ships Chrome (PUPPETEER_EXECUTABLE_PATH), so skip downloads.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production \
    PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN chown -R pptruser:pptruser /app

USER pptruser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
