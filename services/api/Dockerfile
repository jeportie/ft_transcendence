# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/14 17:39:19 by jeportie          #+#    #+#              #
#    Updated: 2025/08/19 13:24:06 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
EXPOSE 5000

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY config/package.json ./package.json
RUN npm install

# 2) Compiler config
COPY config/tsconfig.json ./tsconfig.json

COPY src ./src

RUN npm run build

CMD ["npm", "start"]
