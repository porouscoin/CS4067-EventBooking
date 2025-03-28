# Base Image
FROM node:18-alpine

# Set Working Directory
WORKDIR /app

# Copy Files
COPY package*.json ./
COPY . .

# Install Dependencies
RUN npm install

# Expose Port
EXPOSE 5004

# Start the Server
CMD ["node", "index.js"]
