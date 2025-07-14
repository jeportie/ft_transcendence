# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/14 14:07:18 by jeportie          #+#    #+#              #
#    Updated: 2025/07/14 17:40:11 by jeportie         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-slim
EXPOSE 3000

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

# 3) Copy your source files one by one
COPY src /app/src
COPY public /app/public
COPY postcss.config.js /app/postcss.config.js
COPY tailwind.config.js /app/tailwind.config.js
COPY tsconfig.json /app/tsconfig.json

# Run esbuild in watch mode AND http-server to serve public/ on 0.0.0.0:3000
CMD ["sh", "-c", "\
  npx esbuild src/main.ts --bundle --outfile=public/bundle.js --watch & \
  npx http-server public -p 3000 -a 0.0.0.0 \
"]
