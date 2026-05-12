# Base image
FROM node:22-alpine

# Working directory inside the container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]