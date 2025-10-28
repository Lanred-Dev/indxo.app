FROM node:22 AS builder

WORKDIR /images.indxo.app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS production

WORKDIR /images.indxo.app

COPY --from=builder /images.indxo.app/build ./build
COPY package*.json ./

RUN npm ci --omit=dev

CMD ["node", "build"]