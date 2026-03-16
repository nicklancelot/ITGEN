# Étape 1 : builder l'image
FROM php:8.2-fpm-alpine

# Installer les dépendances système
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    oniguruma-dev \
    zip \
    unzip \
    nodejs \
    npm \
    yarn \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définir le dossier de travail
WORKDIR /var/www/html

# Copier les fichiers du projet
COPY . .

# Installer les dépendances PHP et Node
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Exposer le port
EXPOSE 8000

# Commande par défaut
CMD php artisan serve --host=0.0.0.0 --port=8000