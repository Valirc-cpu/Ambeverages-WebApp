# =========================================================
# Stage 1: Build Frontend Assets (React + Vite + Tailwind v4)
# =========================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =========================================================
# Stage 2: Production Web Application (PHP 8.3 + FPM + Nginx)
# =========================================================
FROM php:8.3-fpm-alpine AS runner

# Install system dependencies, Nginx, and required libraries
RUN apk add --no-cache \
    nginx \
    curl \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    sqlite-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    bash

# Configure & install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        bcmath \
        zip \
        opcache \
        gd \
        exif

# Copy Composer binary from official Composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install Composer dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copy application source code
COPY . .

# Copy compiled Vite assets from Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Copy Nginx server configuration and startup entrypoint
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Configure file ownership and permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Default Render web service port
EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
