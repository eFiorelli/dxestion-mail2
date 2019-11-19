#!/bin/bash

# Stop all docker images/volumes/networks
echo "Removing docker containers...."
docker-compose down -v
rm -r traefik

# Remove docker network
echo "Removing docker network"
docker network remove web

# Remove backend server folder
echo "Removing backend folder..."
rm -r backend

# Remove nginx stuff
echo "Removing nginx config files..."
rm -r nginx_conf
rm default.conf

# Remove frontend app folder
echo "Removing frontend folder..."
rm -r frontend-app

#Remove traefik files and folders
echo "Removing traefik stuff..."
rm -r traefik

# Remove docker-compose file
echo "Removing docker compose file..."
rm docker-compose.yml

# Clone git repository
echo "Clonining from Git..."
rm -rf readme.MD
rm -rf .git
rm -rf .gitignore
git init
git remote add origin https://github.com/MiguelFs86/Angular-nodejs.git
git pull origin master

# Set permissions to SSL certs acme file
echo "Setting 600 to acme.json..."
chmod 600 traefik/acme.json

# Create docker network
echo "Creating docker network..."
docker network create web

# Start deploy
echo "Starting deploy..."
docker-compose up --build -d