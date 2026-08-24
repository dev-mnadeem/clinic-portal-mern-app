# The API. The React frontend is built separately (see docker-compose.yml).
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY backend ./backend
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 app && chown -R app:nodejs /app
USER app
EXPOSE 5000
CMD ["node", "backend/server.js"]
