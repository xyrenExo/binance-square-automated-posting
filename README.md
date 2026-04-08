# Binance Square Automator Deployment Guide

This guide explains how to deploy the Binance Square Automator to a Linode VPS.

## Prerequisites

1.  A Linode account and a running Linode (Ubuntu 22.04 LTS recommended).
2.  Docker and Docker Compose installed on your Linode.
3.  A Gemini API Key.
4.  Binance API Key and Secret.

## Deployment Steps

### 1. Prepare your Linode

Connect to your Linode via SSH:
```bash
ssh root@your_linode_ip
```

Install Docker (if not already installed):
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 2. Clone and Setup

Upload your project files to the Linode or clone them from a repository.

Create a `.env` file in the project root:
```bash
touch .env
```

Add your Gemini API Key to the `.env` file:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 3. Launch with Docker Compose

Run the following command to build and start the application:
```bash
docker compose up -d --build
```

The application will now be running on `http://your_linode_ip:3000`.

### 4. (Optional) Setup Nginx Reverse Proxy

For production, it's recommended to use Nginx with SSL (Certbot).

Install Nginx:
```bash
apt update && apt install nginx -y
```

Create a configuration file `/etc/nginx/sites-available/square-ai`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/square-ai /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Maintenance

To view logs:
```bash
docker compose logs -f
```

To stop the app:
```bash
docker compose down
```

To update the app:
```bash
git pull
docker compose up -d --build
```
