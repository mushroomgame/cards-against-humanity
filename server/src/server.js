const WebSocket = require('ws');
const config = require('config');
const http = require('http');
const express = require('express');
const whevent = require('whevent');
const Player = require('./entity/player');
// test only
const Test = require('./test');

const port = config.get('port');

class Server {
	start() {
		new Test().start();

		const app = express();
		const httpServer = http.createServer(app);
		httpServer.listen(process.env.PORT || port);
		const wss = new WebSocket.Server({ server: httpServer });
		wss.on('connection', ws => {
			let player = Player.getPlayer(ws);
			this.onConnection(player);

			ws.on('message', message => {
				this.onMessage(player, message);
			});

			ws.on('close', ws => {
				this.onClose(player);
			});
		});

		console.log(`WebSocket server is listening on port ${port}...`);
	}

	onConnection(player) {
		console.log(`Player ${player.uuid} has connected!`);
	}

	onMessage(player, message) {
		try {
			let data = JSON.parse(Buffer.from(message, 'base64').toString());
			console.log(`Player ${player.uuid}: `, data);
			whevent.emit(data.signal, player, data);
		} catch (ex) {
			console.error(ex);
			console.error(`Player ${player.uuid} unknown package: `, message);
		}
	}

	onClose(player) {
		console.log(`Player ${player.uuid} has disconnected!`);
	}

	send(player, signal, data) {
		player.send(signal, data);
	}
}

module.exports = Server;