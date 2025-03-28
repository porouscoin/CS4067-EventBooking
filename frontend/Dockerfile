# Base Image for Building
FROM node:18-alpine AS build

# Set Working Directory
WORKDIR /app

# Copy Files
COPY package*.json ./
COPY . .

# Install Dependencies
RUN npm install

# Build the App
RUN npm run build

# Production Server
FROM nginx:alpine

# Copy Build Files to Nginx HTML Directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose Port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
