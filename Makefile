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

ifeq ($(DOCKER_COMPOSE),docker compose)
    DOWN_FLAGS = --volumes --rmi all --remove-orphans
else
    DOWN_FLAGS = -v --rmi all --remove-orphans
endif

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
	rm -f services/frontend/public/bundle* 
	rm -rf services/api/node_modules
	rm -rf services/frontend/node_modules
	$(DC) --env-file $(ENVFILE) down $(DOWN_FLAGS)

dev:
	cd services/frontend/config && npm i && mv node_modules/ ..
	cd ../../..
	cd services/api/config && npm i && mv node_modules/ ..

logs:
	$(DC) --env-file $(ENVFILE) logs -f

re: clean all
