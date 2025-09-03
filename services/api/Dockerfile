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
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y sqlite3

WORKDIR /app

COPY config/package.json ./package.json
RUN npm install

# 2) Compiler config
COPY config/tsconfig.json ./tsconfig.json

COPY src ./src
COPY .env.local .

# IF WE CONVERT TO TS
# RUN npm run build

CMD ["npm", "start"]
