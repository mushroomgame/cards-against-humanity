
const players = {};
let UUID = 0;
class Player {
	static getPlayer(ws) {
		let uuid = ws.uuid;
		if (!uuid) {
			uuid = ++UUID;
			let player = new Player(ws, uuid);
			players[uuid] = player;
			return player;
		} else {
			let player = players[uuid];
			player.ws = ws;
			return players[uuid];
		}
	}

	constructor(ws, uuid) {
		this.ws = ws;
		this.uuid = uuid;
	}

	send(signal, data) {
		let pack = { signal, data };
		try {
			this.ws.send(Buffer.from(JSON.stringify(pack)).toString('base64'));
		} catch (ex) {
			console.error(ex);
		}
	}

	remove() {
		delete Player.players[this.uuid];
	}
}

module.exports = Player;