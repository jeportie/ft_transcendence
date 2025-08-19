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

WORKDIR /app

RUN npm init -y
RUN npm install \
    fastify@^5.0.0 \
    @fastify/cors@^10.0.0 \
    dotenv@^16.4.5

RUN npm install -D \
    typescript@^5.8.3 \
    tsx@^4.16.2

COPY config/package.json /app/package.json

RUN npx tsc --init
COPY config/tsconfig.json /app/tsconfig.json

COPY src /app/src

RUN npm run build

CMD ["npm", "start"]
