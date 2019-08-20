import ws from './core/ws';
import whevent from 'whevent';

whevent.debugMode = true;

function connect() {
	ws.onOpen(event => {
		whevent.emit('$$OPEN', event);
	});

	ws.onMessage(event => {
		const pack = JSON.parse(atob(event.data));
		whevent.emit('$$MESSAGE', pack);
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
	const msg = btoa(JSON.stringify({ signal, data }));
	ws.send(msg);
}

export default {
	connect,
	send
};