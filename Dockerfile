FROM nginx:alpine

# Copy portfolio files
COPY . /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
