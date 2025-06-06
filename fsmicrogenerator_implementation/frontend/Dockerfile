# Step 1: Build the Angular app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli
RUN npm install --force --silent

# Copy the rest of the app code
COPY . .

# build application
RUN node --max_old_space_size=10096 ./node_modules/@angular/cli/bin/ng build --configuration=production
#--build-optimizer=false


# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built Angular files from the build container to Nginx public directory
COPY --from=build /app/frontend/dist/inventorymanagementsystem /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
