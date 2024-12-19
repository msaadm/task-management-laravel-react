#!/bin/sh

# Start PHP-FPM
php-fpm -D

# Generate Laravel key
php artisan key:generate --force

# Run migrations
php artisan migrate --force

# Optimize Laravel for production
php artisan config:cache && php artisan route:cache

# Start Nginx
nginx -g "daemon off;"
