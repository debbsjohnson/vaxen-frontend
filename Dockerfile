# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.20.0
FROM node:${NODE_VERSION}-alpine AS base

LABEL fly_launch_runtime="Next.js"

# Set production environment
ENV NODE_ENV="production"

# Use system yarn (already available in the base image)

WORKDIR /app

# Build stage
FROM base AS builder

# Build with production NODE_ENV to match Next.js expectations.
# Keep dev dependencies for the build step with --production=false below.
ENV NODE_ENV="production"

# Copy only what's needed for installation and building
# Note: some environments (CI/monorepo) may not have a yarn.lock at the repo root.
# Copy package.json only and run a regular install instead of --frozen-lockfile.
COPY package.json ./

# Copy packages (shared code)
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Install dependencies (including devDependencies required to build)
RUN yarn install --production=false

# Build only the web app - use workspaces to target specific app
RUN yarn workspace @vaxen/web run build

# Production stage
FROM base

# Copy node_modules and built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web/.next/standalone /app/apps/web
COPY --from=builder /app/apps/web/.next/static /app/apps/web/.next/static
COPY --from=builder /app/apps/web/public /app/apps/web/public

# Setup for Next.js
WORKDIR /app/apps/web

EXPOSE 3000
CMD [ "npm", "run", "start" ]
