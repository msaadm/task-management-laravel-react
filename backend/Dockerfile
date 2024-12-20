# Base image with PHP and Apache
FROM php:8.2-fpm

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

# Install Laravel dependencies
RUN composer install --no-scripts --no-autoloader

# Copy Laravel application to the container
COPY . .

RUN composer install --no-dev --optimize-autoloader

# Copy nginx configuration
COPY ./docker/nginx/backend.conf /etc/nginx/conf.d/default.conf

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Copy and set permissions for entrypoint script
COPY ./docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["entrypoint.sh"]