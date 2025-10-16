# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/10/16 11:48:08 by jeportie          #+#    #+#              #
#    Updated: 2025/10/16 11:48:48 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
WORKDIR /app

COPY ../api/src/db ./db
COPY cleanup ./cleanup
COPY ../api/config/package.json ./package.json

RUN npm install --omit=dev

CMD ["node", "cleanup/cleanup.js"]
