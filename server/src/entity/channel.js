class Channel {
	constructor() {
		this.players = [];
	}

	broadcast(signal, data, ...excepts) {
		this.players.forEach(p => {
			if (!excepts.includes(p)) {
				p.send(signal, data);
			}
		})
	}

	getPlayerListData() {
		const data = this.players.map(p => ({ uuid: p.uuid, nickname: p.nickname }));
		return data;
	}

	enter(player) {
		if (player.channel) {
			player.channel.leave(player);
		}
		this.players.push(player);
		player.channel = this;
	}

	leave(player) {
		this.players = this.players.filter(p => p !== player);
		player.channel = null;
	}
}

module.exports = Channel;