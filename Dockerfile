FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm ci --include=dev

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/doc ./doc
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]