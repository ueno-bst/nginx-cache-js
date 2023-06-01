FROM wordpress:6.2.2-php8.2-apache

ARG DOCKER_USER=1000
ARG DOCKER_GROUP=1000

ENV APACHE_RUN_USER www-user
ENV APACHE_RUN_GROUP www-group

# Install standard libraries
RUN apt-get update \
    && apt-get install -y zip gzip libzip-dev \
    && pecl install xdebug-3.2.1 zip \
    && docker-php-ext-enable xdebug zip \
    && apt-get clean

# Install php-composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install wordpress-cli
COPY --from=wordpress:cli /usr/local/bin/wp /usr/local/bin/wp

# create working user
RUN groupadd --force -g $DOCKER_USER www-group
RUN useradd -ms /bin/bash --no-user-group -g $DOCKER_GROUP -u $DOCKER_USER www-user

RUN chown "${APACHE_RUN_USER}":"${APACHE_RUN_GROUP}" -R /var/www/html

CMD ["apache2-foreground"]
