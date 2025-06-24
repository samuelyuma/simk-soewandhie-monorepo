FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY . .
RUN bun install

ENV NODE_ENV=production
RUN bun run prisma:generate
RUN bun run build:docker

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 8080
