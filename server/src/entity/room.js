const Channel = require('../entity/channel');
const config = require('config');
const cardService = require('../services/cardService');

const roomMap = new Map();

class Room extends Channel {
	constructor(name, password, blackDecks, whiteDecks) {
		super();
		this.name = name;
		this.password = password;
		this.blackDecks = blackDecks;
		this.whiteDecks = whiteDecks;
		this.gamePlayers = [];
		this.spectators = [];

		for (let i = 1; ; i++) {
			if (!roomMap.get(i)) {
				roomMap.set(i, this);
				this.id = 1;
				break;
			}
		}
	}

	static getRoomList(){
		return [...roomMap.keys()].map(k => ({
			id: k,
			info: roomMap.get(k).getRoomShortInfo()
		}));
	}

	static getRoomById(id){
		return roomMap.get(id);
	}

	getRoomShortInfo(){
		const decks = cardService.getDecksFromCache();
		return {
			name: this.name,
			password: !!this.password,
			blackDecks: this.blackDecks.map(b => decks.find(d => d.id === b).name),
			whiteDecks: this.whiteDecks.map(w => decks.find(d => d.id === w).name),
			players: this.gamePlayers.length,
			spectators: this.spectators.length,
		}
	}

	getRoomInfo(){
		const decks = cardService.getDecksFromCache();
		return {
			name: this.name,
			blackDecks: this.blackDecks.map(b => decks.find(d => d.id === b).name),
			whiteDecks: this.whiteDecks.map(w => decks.find(d => d.id === w).name),
			players: this.gamePlayers.map(p => ({ uuid: p.uuid, nickname: p.nickname })),
			spectators: this.spectators.map(p => ({ uuid: p.uuid, nickname: p.nickname })),
		}
	}

	enter(player, spectate) {
		if (!spectate && this.gamePlayers.length < (config.get('maxPlayers') || 8)) {
			this.gamePlayers.push(player);
			super.enter(player);
			this.broadcast('$ENTER', { nickname: player.nickname, uuid: player.uuid, spectate: false }, player);
			player.send('$ROOM', this.getRoomInfo());
		} else if (config.get('maxPlayers') === undefined || config.get('maxPlayers') < 0 || this.spectators.length < config.get('maxPlayers')) {
			this.spectators.push(player);
			super.enter(player);
			this.broadcast('$ENTER', { nickname: player.nickname, uuid: player.uuid, spectate: false }, player);
			player.send('$ROOM', this.getRoomInfo());
		} else {
			player.send('$FULL');
		}
	}

	leave(player) {
		this.gamePlayers = this.gamePlayers.filter(p => p !== player);
		this.spectators = this.spectators.filter(p => p !== player);
		super.leave(player);

		if(this.players.length === 0){
			this.destroy();
		}
	}

	destroy(){

	}

	broadcastToGamePlayers(signal, data, ...excepts) {
		this.gamePlayers.forEach(p => {
			if (!excepts.includes(p)) {
				p.send(signal, data);
			}
		})
	}

	broadcastToSpectators(signal, data, ...excepts) {
		this.spectators.forEach(p => {
			if (!excepts.includes(p)) {
				p.send(signal, data);
			}
		})
	}
}

module.exports = Room;