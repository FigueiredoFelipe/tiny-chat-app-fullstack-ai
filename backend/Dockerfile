# Use official lightweight Node.js base image
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the NestJS application (TypeScript → JavaScript)
RUN npm run build


# ---- Production image ----
FROM node:18-alpine

WORKDIR /app

# Copy only the built output and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev

# Expose port used by NestJS app
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
