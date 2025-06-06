# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app/APIGateway

# Copy package files 
COPY package*.json ./

# install dependencies
RUN npm install --force --silent

# Copy application files
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]