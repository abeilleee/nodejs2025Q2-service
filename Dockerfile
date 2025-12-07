FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY ./tsconfig.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm ci --include=dev && npm cache clean --force

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY ./tsconfig.json ./
COPY ./doc ./doc

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npm run start:poll"]