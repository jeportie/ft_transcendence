# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/12 17:27:29 by jeportie          #+#    #+#              #
#    Updated: 2025/07/12 17:28:04 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DCLOC   = docker-compose.yml
ENVFILE = .env
DATADIR = ~/data/

# Detect docker compose (plugin) or docker-compose (standalone)
DOCKER_COMPOSE := $(shell command -v docker compose >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")
DC      = $(DOCKER_COMPOSE) -f $(DCLOC)

.PHONY: all prepare build up down clean logs re

all: prepare build up

prepare:
	mkdir -p $(DATADIR)/SQLite
	# chown -R 1000:1000 $(DATADIR)/sqlite

build:
	$(DC) --env-file $(ENVFILE) build

up: prepare
	$(DC) --env-file $(ENVFILE) up -d

down:
	$(DC) --env-file $(ENVFILE) down

clean: down
	docker system prune -af
	$(DC) --env-file $(ENV) down -v --rmi all --remove-orphans

logs:
	$(DC) --env-file $(ENVFILE) logs -f

re: clean all
