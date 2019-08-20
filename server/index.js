const WebSocket = require('ws');
const config = require('config');
const port = config.get('port');
const wss = new WebSocket.Server({ port });

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send('something');
});