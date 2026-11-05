# Use official lightweight Node.js 20 LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server application source code
COPY . .

# Set non-root user for security
USER node

# Expose backend port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]

