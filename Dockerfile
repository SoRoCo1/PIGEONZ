FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm install next@15.3.3

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx next build --no-lint

FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["node", "server.js"]
