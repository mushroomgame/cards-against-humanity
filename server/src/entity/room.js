const Channel = require('./channel');
const config = require('config');
const cardService = require('../services/cardService');

const roomMap = new Map();

class Room extends Channel {
	constructor(lobby, name, password, blackDecks, whiteDecks) {
		super();
		this.lobby = lobby;
		this.name = name;
		this.password = password;
		this.blackDecks = blackDecks;
		this.whiteDecks = whiteDecks;
		this.gamePlayers = [];
		this.spectators = [];

		for (let i = 1; ; i++) {
			if (!roomMap.get(i)) {
				roomMap.set(i, this);
				this.id = i;
				break;
			}
		}
	}

	static getRoomList(){
		return [...roomMap.values()].map(v => v.getRoomShortInfo());
	}

	static getRoomById(id){
		return roomMap.get(id);
	}

	getRoomShortInfo(){
		const decks = cardService.getDecksFromCache();
		return {
			id: this.id,
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
			id: this.id,
			name: this.name,
			password: !!this.password,
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
			this.roomChange();
		} else if (config.get('maxPlayers') === undefined || config.get('maxPlayers') < 0 || this.spectators.length < config.get('maxPlayers')) {
			this.spectators.push(player);
			super.enter(player);
			this.broadcast('$ENTER', { nickname: player.nickname, uuid: player.uuid, spectate: false }, player);
			player.send('$ROOM', this.getRoomInfo());
			this.roomChange();
		} else {
			player.send('$FULL');
		}
	}

	leave(player) {
		this.gamePlayers = this.gamePlayers.filter(p => p !== player);
		this.spectators = this.spectators.filter(p => p !== player);
		super.leave(player);
		this.roomChange();

		if(this.players.length === 0){
			this.destroy();
		}
	}

	roomChange(){
		this.broadcast('$ROOM_CHANGED', this.getRoomInfo());
		this.lobby.broadcast('$ROOM_CHANGED', this.getRoomShortInfo());
	}

	destroy(){
		this.players.forEach(p => this.lobby.enter(p));
		this.lobby.broadcast('$ROOM_DESTROYED', {id: this.id});
		roomMap.delete(this.id);
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