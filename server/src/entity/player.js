
const players = new Map();
let UUID = 0;
class Player {
	static getPlayer(ws) {
		let uuid = ws.uuid;
		let player;
		if (!uuid) {
			uuid = ++UUID;
			player = new Player(ws, uuid);
			players.set(uuid, player);
		} else {
			player = players.get(uuid);
		}
		return player;
	}

	static getPlayerByNickname(nickname) {
		return [...players.values()].find(p => p.nickname === nickname);
	}

	constructor(ws, uuid) {
		this.ws = ws;
		this.uuid = uuid;
	}

	send(signal, data) {
		let pack = { signal, data };
		try {
			console.log(`${this.uuid} <-`, pack);
			this.ws.send(Buffer.from(JSON.stringify(pack), 'utf8').toString('base64'));
		} catch (ex) {
			console.error(ex);
		}
	}

	remove() {
		if(this.channel){
			this.channel.leave(this);
		}
		players.delete(this.uuid);
	}
}

module.exports = Player;