# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/14 17:39:19 by jeportie          #+#    #+#              #
#    Updated: 2025/07/14 17:42:03 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
EXPOSE 5000

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

COPY src /app/src

CMD ["npm", "start"]
