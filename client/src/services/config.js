import http from './http';

let config = {};

async function init(){
	const result = await http.get('./config.json');
	console.log(result);
	config = result.data;
}

function get(key) {
	return config[key];
}

export {
	init,
	get
};