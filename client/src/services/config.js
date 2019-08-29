import http from './core/http';

let config = {};

async function init() {
	let result
	try {
		console.log('读取config_override.json成功')
		result = await http.get('./config_override.json');
	} catch {

	}

	if (!result) {
		console.log('无法找到 config_override.json，读取config.json')
		try {
			result = await http.get('./config.json');
		} catch {

		}
	}

	if (!result) {
		console.error('无法读取config.json！')
		return;
	}

	result = result.data;

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