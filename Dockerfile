# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Variables de entorno para el build
ARG NUXT_PUBLIC_API_BASE_URL=https://api.warotickets.com
ARG NUXT_PUBLIC_SITE_URL=https://warotickets.com
ARG NODE_ENV=production
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NODE_ENV=$NODE_ENV

RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output/ ./.output/
ENV PORT=3003
ENV HOST=0.0.0.0
EXPOSE 3003
CMD ["node", ".output/server/index.mjs"]
