# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/14 17:39:19 by jeportie          #+#    #+#              #
#    Updated: 2025/09/02 16:32:37 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
EXPOSE 5000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    python3 make g++ sqlite3 curl\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY config/package.json ./package.json
RUN npm install

# 2) Compiler config
COPY config/tsconfig.json ./tsconfig.json

# COPY openapi.yaml .
COPY src ./src
COPY .env.local .

# IF WE CONVERT TO TS
# RUN npm run build

CMD ["npm", "start"]
