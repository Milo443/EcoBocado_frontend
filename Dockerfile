# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Definir argumentos de build para variables de Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

# Copiar archivos estáticos del build anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración básica de Nginx para SPAs
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
