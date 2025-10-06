# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/12 17:27:29 by jeportie          #+#    #+#              #
#    Updated: 2025/09/28 20:15:00 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DCLOC   = docker-compose.yml
ENVFILE = .env
DATADIR = ~/data/sqlite
BACKUP_DIR = backups

# Detect docker compose (plugin) or docker-compose (standalone)
DOCKER_COMPOSE := $(shell command -v docker compose >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")
DC      = $(DOCKER_COMPOSE) -f $(DCLOC)

ifeq ($(DOCKER_COMPOSE),docker compose)
    DOWN_FLAGS = --volumes --rmi all --remove-orphans
else
    DOWN_FLAGS = -v --rmi all --remove-orphans
endif

all: prepare build up

prepare:
	mkdir -p $(DATADIR)
	# Ensure correct ownership for SQLite files
	# chown -R 1000:1000 $(DATADIR)

build:
	$(DC) --env-file $(ENVFILE) build

up: prepare
	$(DC) --env-file $(ENVFILE) up -d api frontend sqlite-web #migrator

down:
	$(DC) --env-file $(ENVFILE) down

clean: down
	docker system prune -af
	rm -f services/frontend/public/bundle* 
	rm -rf services/api/node_modules
	rm -rf services/api/package.json
	rm -rf services/frontend/node_modules
	rm -rf services/frontend/package.json
	$(DC) --env-file $(ENVFILE) down $(DOWN_FLAGS)

dev:
	cd services/frontend/config && npm i && mv node_modules/ .. && cp package.json ..
	cd ../../..
	cd services/api/config && npm i && mv node_modules/ .. && cp package.json ..

logs:
	$(DC) --env-file $(ENVFILE) logs -f

re: clean all

backup-monitoring:
	mkdir -p $(BACKUP_DIR)
	docker run --rm \
		-v prometheus_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar cvf /backup/prometheus.tar /data
	docker run --rm \
		-v grafana_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar cvf /backup/grafana.tar /data
	@echo "✅ Monitoring volumes backed up to $(BACKUP_DIR)/"

restore-monitoring:
	docker volume create prometheus_data
	docker volume create grafana_data
	docker run --rm \
		-v prometheus_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar xvf /backup/prometheus.tar -C /
	docker run --rm \
		-v grafana_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar xvf /backup/grafana.tar -C /
	@echo "✅ Monitoring volumes restored from $(BACKUP_DIR)/"

backup-grafana:
	mkdir -p $(BACKUP_DIR)
	docker run --rm \
		-v grafana_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar cvf /backup/grafana.tar /data
	@echo "✅ Grafana backed up (dashboards, users) → $(BACKUP_DIR)/grafana.tar"

restore-grafana:
	docker volume create grafana_data
	docker run --rm \
		-v grafana_data:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar xvf /backup/grafana.tar -C /
	@echo "✅ Grafana restored from $(BACKUP_DIR)/grafana.tar"

backup-db:
	mkdir -p $(BACKUP_DIR)
	docker run --rm \
		-v $(HOME)/data/sqlite:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar cvf /backup/sqlite.tar /data
	@echo "✅ SQLite DB backed up to $(BACKUP_DIR)/sqlite.tar"

restore-db:
	docker run --rm \
		-v $(HOME)/data/sqlite:/data \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		busybox tar xvf /backup/sqlite.tar -C /
	@echo "✅ SQLite DB restored from $(BACKUP_DIR)/sqlite.tar"

backup-all: backup-monitoring backup-db
	@echo "📦 Full backup complete (Prometheus + Grafana + SQLite)"

restore-all: restore-monitoring restore-db
	@echo "📦 Full restore complete (Prometheus + Grafana + SQLite)"

backup-light: backup-grafana backup-db
	@echo "📦 Light backup complete (Grafana + SQLite only, no Prometheus)"

restore-light: restore-grafana restore-db
	@echo "📦 Light restore complete (Grafana + SQLite only, no Prometheus)"

.PHONY: all prepare build up down clean logs re dev \
        backup-monitoring restore-monitoring \
        backup-grafana restore-grafana \
        backup-db restore-db \
        backup-all restore-all \
        backup-light restore-light

