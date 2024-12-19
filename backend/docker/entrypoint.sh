#!/bin/sh

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    until php -r "
        \$host = getenv('DB_HOST');
        \$port = getenv('DB_PORT');
        \$dbname = getenv('DB_DATABASE');
        \$user = getenv('DB_USERNAME');
        \$password = getenv('DB_PASSWORD');
        
        echo 'Checking PostgreSQL connection... ';
        \$dsn = \"pgsql:host=\$host;port=\$port;dbname=\$dbname;user=\$user;password=\$password\";
        
        try {
            \$dbh = new PDO(\$dsn);
            echo 'Connected successfully\n';
            exit(0);
        } catch (PDOException \$e) {
            echo 'Connection failed\n';
            exit(1);
        }
    "
    do
        echo "PostgreSQL is unavailable - sleeping for 5 seconds"
        sleep 5
    done
    echo "PostgreSQL is up and running!"
}

# Wait for PostgreSQL to be ready
wait_for_postgres

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
