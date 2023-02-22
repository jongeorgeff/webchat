const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

function start(opts) {
	const users = new Set();
	const server = new WebSocket.Server(opts);
	let interval = setInterval(ping, 30000, server);
	
	server.on('connection', function (client) {
		client.isAlive = true;

		client.on('pong', () => {
			client.isAlive = true;
		});

		client.on('message', function (message) {
			const { action, token, ...data } = JSON.parse(message.toString());

			// Only broadcast message if user exists and has a matching token
			try {
				const { username } = jwt.verify(token, process.env.TOKEN_SECRET);
				if (action === 'message' && username === client.chatUsername) {
					sendJSON(server.clients, {
						'message': {
							username,
							date: Date.now(),
							action,
							...data
						}
					});
				} else if (action === 'join') {
					client.chatUsername = username;
					users.add(username);
					sendJSON(server.clients, {
						'message': {
							username,
							date: Date.now(),
							action
						},
						'users': [...users].sort()
					});
				}
			} catch (err) {
				console.log(new Date(), err);
				client.close();
			}
		});

		client.on('close', function () {
			let username = client.chatUsername;
			if (username) {
				users.delete(username);
				sendJSON(server.clients, {
					'message': {
						username,
						date: Date.now(),
						action: 'exit'
					},
					'users': [...users].sort()
				});
			}
		});

		server.on('close', function () {
			clearInterval(interval);
		});
	});

	return server;
}

function ping(server) {
	server.clients.forEach((client) => {
		if (client.isAlive === false) {
			client.terminate();
			return;
		}
		client.isAlive = false;
		client.ping();
	});
}

function sendJSON(clients, json) {
	let message = JSON.stringify(json);
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
}

exports.start = start;
