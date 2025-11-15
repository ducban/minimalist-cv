FROM oven/bun:1 as BUILD_STAGE

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1-alpine

WORKDIR /app

COPY --from=BUILD_STAGE /app/package.json ./package.json
COPY --from=BUILD_STAGE /app/node_modules ./node_modules
COPY --from=BUILD_STAGE /app/.next ./.next
COPY --from=BUILD_STAGE /app/public ./public

EXPOSE 3000

CMD ["bun", "start"]