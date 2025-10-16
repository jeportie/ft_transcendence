# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/10/16 11:48:08 by jeportie          #+#    #+#              #
#    Updated: 2025/10/16 16:24:53 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
WORKDIR /app

COPY config/package.json ./package.json
RUN npm install --omit=dev

COPY src ./src

CMD ["node", "src/cleanup.js"]
