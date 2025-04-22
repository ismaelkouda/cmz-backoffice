FROM node:18 AS base
WORKDIR /app
COPY package.json .
COPY tools ./tools
COPY src/assets/config/env.template.js ./src/assets/config/env.template.js
RUN npm install --legacy-peer-deps

FROM base AS build
COPY . .
ARG ENV=prod
RUN node tools/env/generate-env.js $ENV
RUN npm run build:prod
RUN ls dist/patrimoine-sim-tenant

FROM php:8.2-apache

RUN apt-get update && \
    a2enmod rewrite && \
    a2enmod ssl

COPY --from=build /app/dist/patrimoine-sim-tenant /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]


