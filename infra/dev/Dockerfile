FROM node:20.20.2-alpine3.22

# Install dependencies for file watching
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./

RUN npm install --include=optional --legacy-peer-deps

# Copy everything else
COPY . .

# Expose Next dev port
EXPOSE 3000

CMD ["npm", "run", "dev"]
