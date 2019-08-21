const Channel = require('../entity/channel');

class Lobby extends Channel {
	constructor() {
		super();
		Lobby.$ = this;
		this.rooms = new Map();
	}

	enter(player) {
		super.enter(player);

		this.broadcast('$ENTER', { uuid: player.uuid, nickname: player.nickname }, player);
		player.send('$LOBBY', { rooms: [], players: this.getPlayerListData() });
	}

	leave(player) {
		super.leave(player);
		this.broadcast('$LEAVE', { uuid: player.uuid, nickname: player.nickname }, player);
	}
}

module.exports = Lobby;