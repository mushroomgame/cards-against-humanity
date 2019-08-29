import http from './core/http';

let config = {};

async function init() {
	let data = (await http.get('./config.json')).data;

	try {
		let override = await http.get('./config_override.json');
		if (override && override.data) {
			data = { ...data, ...override.data };
		}
	} catch {
		console.log('未找到覆盖规则文件(config_override.json)，忽略');
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