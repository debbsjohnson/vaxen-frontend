APP_NAME=vaxen-web
COMPOSE=docker compose

.PHONY: help build up down restart logs shell clean rebuild

help:
	@echo "Available commands:"
	@echo "  make build      -> Build container (no cache)"
	@echo "  make up         -> Start container"
	@echo "  make down       -> Stop container and remove volumes"
	@echo "  make restart    -> Restart container"
	@echo "  make logs       -> Follow logs"
	@echo "  make shell      -> Open shell inside container"
	@echo "  make clean      -> Remove containers + images"
	@echo "  make rebuild    -> Full clean rebuild"

build:
	$(COMPOSE) build --no-cache

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down -v

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

shell:
	docker exec -it $(APP_NAME) sh

clean:
	$(COMPOSE) down -v --rmi all

rebuild:
	$(MAKE) down
	$(MAKE) build
	$(MAKE) up