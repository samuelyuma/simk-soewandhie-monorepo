FROM oven/bun AS build
WORKDIR /app
COPY . .
RUN bun install

ENV NODE_ENV=production
RUN bun run build

CMD ["bun", "run", "preview"]

EXPOSE 3000