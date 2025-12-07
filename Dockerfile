FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY ./tsconfig.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm ci && npm cache clean --force

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY ./tsconfig.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY ./src ./src
COPY ./doc ./doc
COPY ./prisma ./prisma

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

CMD ["sh", "-c", "npm run start:poll"]