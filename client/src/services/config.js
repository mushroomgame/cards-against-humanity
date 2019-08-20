import http from './core/http';

let config = {};

async function init(){
	const result = await http.get('./config.json');
	config = result.data;
}

function get(key) {
	return config[key];
}

export default {
	init,
	get
};