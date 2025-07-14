// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 16:45:05 by jeportie          #+#    #+#             //
//   Updated: 2025/07/14 17:54:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

require('dotenv').config();
const http = require('http');

// Read PORT from .env.api (or fallback to 5000)
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
	// allow any origin during development
	res.setHeader('Access-Control-Allow-Origin', '*');

	if (req.method === 'OPTIONS') {
		// handle preflight
		res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
		return res.end();
	}

	if (req.url === '/health') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		return res.end(JSON.stringify({ status: 'ok' }));
	}

	res.writeHead(404);
	res.end();
});

server.listen(PORT, () =>
	console.log(`API listening on port ${PORT}`)
);
