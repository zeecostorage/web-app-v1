# Use Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy the backend code
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 7000

# Start the server
CMD ["node", "index.js"]

