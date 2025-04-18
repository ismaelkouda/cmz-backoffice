# FROM node:18 AS base
# WORKDIR /app
# COPY package.json .
# #COPY package.json pnpm-lock.yaml ./
# #RUN npm install --frozen-lockfile

# FROM base AS dependencies
# RUN npm install -g pnpm
# #RUN pnpm install --frozen-lockfile
# RUN npm install

# # ---- Build ----
# FROM dependencies AS build

# COPY . .
# RUN npm run build:prod
# RUN ls dist/patrimoine-sim-tenant


# FROM php:8.2-apache

# # Installez les extensions PHP nécessaires pour PostgreSQL et LDAP
# RUN apt-get update && \
#     a2enmod rewrite && \
#     a2enmod ssl

# #COPY --from=build dist /var/www/html
# #RUN npm run test--from=build 
# COPY --from=build /app/dist/patrimoine-sim-tenant /var/www/html
# RUN chmod -R 755 /var/www/html
# #RUN rm -rf /var/www/html/assets/config/env.js

# # Exposez le port Apache
# EXPOSE 80 
# CMD ["apache2-foreground"]

# Étape 1 - Build Angular
FROM node:18 as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build:prod

# Étape 2 - Serveur Apache
FROM php:8.2-apache
RUN apt-get update && \
    a2enmod rewrite && \
    a2enmod ssl

COPY --from=builder /app/dist/patrimoine-sim-tenant /var/www/html/
RUN chmod -R 755 /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
