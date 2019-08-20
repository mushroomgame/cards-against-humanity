const whevent = require('whevent');

class Test {
	start() {
		whevent.on('GREET', this.onGreet, this);
	}

	onGreet(player, data) {
		console.log(`Got greet from player ${player.uuid}`, data);
		const response = { message: 'Hello player!' };
		console.log(`Greet back`, 'GREET', response);
		player.send('GREET', response);
	}
}

module.exports = Test;