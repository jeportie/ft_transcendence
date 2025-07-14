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
DC      = docker-compose -f ${DCLOC}
ENVFILE = .env
DATADIR = ~/data/

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
