# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# Setting build arg for API URL to be baked in if needed, 
# but for true dynamic config in Nginx, we'd need runtime injection.
# For Hustlr, we will expect API URLs to be relative or configured.
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use Cloud Run standard port
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
