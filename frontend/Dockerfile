# Stage 1: Build with Node
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:8081/api
ENV VITE_API_URL=$VITE_API_URL

# Production build
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
