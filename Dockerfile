# # Use the official Node.js image from Docker Hub
# FROM node:20

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install both production and development dependencies
# RUN npm install
# RUN npm install dotenv-cli
# # Copy the rest of the application code
# COPY . .
# RUN dotenv -e .env.development.local -- npx prisma db pull
# RUN npx prisma generate

# # Build the TypeScript code
# RUN npm run build

# # Define the command to run the application
# CMD ["node", "dist/index.js"]

# Use the official Node.js image from Docker Hub
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install both production and development dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install dotenv-cli as a development dependency
RUN npm install dotenv-cli

# Use dotenv-cli to load the environment variables and run Prisma commands
RUN npx dotenv -e .env.development.local -- npx prisma db pull
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Define the command to run the application
CMD ["node", "dist/index.js"]
