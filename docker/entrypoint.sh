#!/bin/sh
set -e

PORT="${PORT:-10000}"

echo "Configuring Nginx to listen on port ${PORT}..."
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/http.d/default.conf

# Check and generate APP_KEY if empty
if [ -z "$APP_KEY" ]; then
    echo "Warning: APP_KEY is empty. Generating temporary application key..."
    php artisan key:generate --force
fi

# Ensure storage symbolic link exists
php artisan storage:link --force || true

# Prepare SQLite if DB_CONNECTION is sqlite (or not set)
DB_CONN="${DB_CONNECTION:-sqlite}"
if [ "$DB_CONN" = "sqlite" ]; then
    mkdir -p /var/www/html/database
    if [ ! -f /var/www/html/database/database.sqlite ]; then
        touch /var/www/html/database/database.sqlite
    fi
    chown -R www-data:www-data /var/www/html/database
    chmod -R 775 /var/www/html/database
fi

# Run database migrations and seeders automatically
echo "Running database migrations and seeders..."
php artisan migrate --force --seed

# Optimize Laravel cache for production
echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Ambeverages service is ready! Starting web server on port ${PORT}..."

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
exec nginx -g "daemon off;"
