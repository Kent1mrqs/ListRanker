FROM node:lts AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:lts AS production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

ENV NEXT_PUBLIC_BACKEND_URL=NEXT_PUBLIC_BACKEND_URL

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "start"]
