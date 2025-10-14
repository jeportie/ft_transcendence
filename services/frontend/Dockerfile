# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/14 14:07:18 by jeportie          #+#    #+#              #
#    Updated: 2025/10/06 23:17:21 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY config/package.json /app/package.json
# COPY LOCK ONLY WHEN IN PRODUCTION
# COPY config/package-lock.json /app/package-lock.json
RUN npm install

RUN npx tailwindcss init -p
COPY config/tailwind.config.js /app/tailwind.config.js

RUN npx tsc --init
COPY config/tsconfig.json /app/tsconfig.json

# 3) Copy your source files one by one
COPY src /app/src
COPY public /app/public

# In dev, let Tilt build assets, container stays alive
# CMD ["sh", "-c", "npm run build:css && npm run build:js && tail -f /dev/null"]

# Watch CSS and JS continuously
CMD ["sh", "-c", "npm run dev"]
