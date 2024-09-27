# Use Node.js image for React
FROM node:16

# Set working directory
WORKDIR /app

# Copy the frontend code
COPY . .

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 9000

# Serve the React app
CMD ["serve", "-s", "build", "-l", "9000"]

