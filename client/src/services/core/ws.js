import config from '../config';

let socket = null;
const binded = {
	onOpen: null,
	onClose: null,
	onMessage: null,
	onError: null
};

function connect() {
	socket = new WebSocket(config.get('wsserver'));
	socket.onopen = event => {
		binded.onOpen && binded.onOpen(event);

		socket.onclose = event => {
			binded.onClose && binded.onClose(event);
		}

		socket.onmessage = event => {
			binded.onMessage && binded.onMessage(event);
		}

		socket.onerror = event => {
			binded.onError && binded.onError(event);
		}
	}
}

function onOpen(handler, thisArg) {
	binded.onOpen = thisArg ? handler.bind(thisArg) : handler;
}

function onClose(handler, thisArg) {
	binded.onClose = thisArg ? handler.bind(thisArg) : handler;
}

function onMessage(handler, thisArg) {
	binded.onMessage = thisArg ? handler.bind(thisArg) : handler;
}

function onError(handler, thisArg) {
	binded.onError = thisArg ? handler.bind(thisArg) : handler;
}

function send(data) {
	socket.send(data);
}

export default {
	connect,
	onOpen,
	onClose,
	onMessage,
	onError,
	send
};