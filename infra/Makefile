# Vaxen Frontend Infrastructure Makefile
# Supports dev, testing, and production environments

.DEFAULT_GOAL := help
ENV ?= dev
APP_NAME = vaxen-web

# Environment-specific variables
ifeq ($(ENV),dev)
	COMPOSE_FILE = dev/docker-compose.yml
	CONTAINER_NAME = vaxen-web-dev
	PORT = 3000
else ifeq ($(ENV),testing)
	COMPOSE_FILE = testing/docker-compose.yml
	CONTAINER_NAME = vaxen-web-test
	PORT = 3001
else ifeq ($(ENV),production)
	DOCKERFILE = production/Dockerfile
	CONTAINER_NAME = vaxen-web-prod
	PORT = 3000
endif

COMPOSE = docker compose -f $(COMPOSE_FILE)

.PHONY: help dev test prod build up down restart logs shell clean rebuild status deploy

help: ## Show this help message
	@echo "Vaxen Frontend Infrastructure Commands"
	@echo "======================================="
	@echo ""
	@echo "Usage: make [command] ENV=[dev|testing|production]"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make dev          -> Start development environment"
	@echo "  make test         -> Start testing environment"
	@echo "  make up ENV=dev   -> Start specific environment"
	@echo "  make logs ENV=testing -> View testing logs"

dev: ENV=dev ## Start development environment
dev: up

test: ENV=testing ## Start testing environment
test: up

prod: ## Build and deploy to production (Fly.io)
	@echo "Building and deploying to production..."
	@cd infra/production && fly deploy --config fly.toml --dockerfile Dockerfile --build-arg NODE_ENV=production

build: ## Build Docker image for specified environment
	@echo "Building $(ENV) environment..."
	@$(COMPOSE) build --no-cache

up: ## Start containers for specified environment
	@echo "Starting $(ENV) environment on port $(PORT)..."
	@$(COMPOSE) up -d
	@echo "✓ $(ENV) environment is running at http://localhost:$(PORT)"

down: ## Stop and remove containers
	@echo "Stopping $(ENV) environment..."
	@$(COMPOSE) down -v

restart: ## Restart containers
	@echo "Restarting $(ENV) environment..."
	@$(COMPOSE) restart

logs: ## Follow container logs
	@$(COMPOSE) logs -f

shell: ## Open shell inside container
	@docker exec -it $(CONTAINER_NAME) sh

status: ## Show container status
	@docker ps -a | grep vaxen-web || echo "No Vaxen containers running"

clean: ## Remove containers, volumes, and images
	@echo "Cleaning $(ENV) environment..."
	@$(COMPOSE) down -v --rmi all

rebuild: ## Full rebuild (clean + build + up)
	@$(MAKE) down ENV=$(ENV)
	@$(MAKE) build ENV=$(ENV)
	@$(MAKE) up ENV=$(ENV)

install: ## Install dependencies locally
	@echo "Installing dependencies..."
	@npm install

setup-dev: ## Setup development environment
	@echo "Setting up development environment..."
	@cp infra/dev/.env.example .env
	@npm install
	@echo "✓ Development environment setup complete"

setup-testing: ## Setup testing environment
	@echo "Setting up testing environment..."
	@cp infra/testing/.env.example .env.test
	@echo "✓ Testing environment setup complete"

deploy-test: ## Deploy to testing environment
	@echo "Deploying to testing environment..."
	@$(MAKE) build ENV=testing
	@$(MAKE) up ENV=testing

deploy-prod: prod ## Alias for prod command

health: ## Check health of running container
	@curl -f http://localhost:$(PORT)/api/health || echo "Health check failed"

# Utility commands
ps: status ## Alias for status

stop: down ## Alias for down

start: up ## Alias for up
