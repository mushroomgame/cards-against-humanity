import http from './core/http';

let config = {};

async function init() {
	const result = (await http.get('./config.json')).data;
	let data = result['default'];

	if (data[window.location.hostname]) {
		data = { ...data, ...data[window.location.hostname] };
	}

	config = data;
}

function get(key) {
	return config[key];
}

export default {
	init,
	get
};