import ws from './core/ws';
import whevent from 'whevent';
import Base64 from '../utils/base64';

whevent.debugMode = true;

function connect() {
	ws.onOpen(event => {
		whevent.emit('$$OPEN', event);
	});

	ws.onMessage(event => {
		const pack = JSON.parse(Base64.decode(event.data));
		whevent.emit('$$MESSAGE', pack);
		console.log('%cRECEIVE', 'color: orange;', pack.signal, pack.data);
		whevent.emit(pack.signal, pack.data);
	});

	ws.onError(event => {
		whevent.emit('$$ERROR', event);
	});

	ws.onClose(event => {
		whevent.emit('$$CLOSE', event);
	});

	ws.connect();
}

function send(signal, data) {
	console.log('%cSEND', 'color: green;', signal, data);
	const msg = Base64.encode(JSON.stringify({ signal, data }));
	ws.send(msg);
}

export default {
	connect,
	send
};