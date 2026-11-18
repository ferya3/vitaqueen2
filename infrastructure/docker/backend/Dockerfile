# syntax=docker/dockerfile:1.7
# Laravel 13 API — PHP-FPM image (also used for the queue worker and scheduler).

FROM composer:2 AS vendor
WORKDIR /app
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist
COPY backend/ ./
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

FROM php:8.3-fpm-alpine AS runtime

RUN apk add --no-cache icu-libs libzip libpng libjpeg-turbo libwebp freetype libpq fcgi \
 && apk add --no-cache --virtual .build $PHPIZE_DEPS icu-dev libzip-dev libpng-dev libjpeg-turbo-dev libwebp-dev freetype-dev libpq-dev linux-headers \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j"$(nproc)" pdo_pgsql intl zip gd bcmath opcache pcntl \
 && pecl install redis && docker-php-ext-enable redis \
 && apk del .build

COPY infrastructure/docker/backend/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY infrastructure/docker/backend/www.conf /usr/local/etc/php-fpm.d/zz-www.conf
COPY infrastructure/docker/backend/entrypoint.sh /usr/local/bin/entrypoint

WORKDIR /var/www/html
COPY --from=vendor --chown=www-data:www-data /app /var/www/html

RUN chmod +x /usr/local/bin/entrypoint \
 && mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

USER www-data
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping REQUEST_METHOD=GET cgi-fcgi -bind -connect 127.0.0.1:9000 || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]
