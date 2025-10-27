FROM node:22 AS builder

WORKDIR /indxo.app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS production

WORKDIR /indxo.app

COPY --from=builder /indxo.app/build ./build
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "build"]