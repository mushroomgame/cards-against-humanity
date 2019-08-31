const Channel = require('./channel');
const Game = require('./game');
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

	// 开始游戏
	async start(player) {
		if (player !== this.host) {
			player.send('$ALERT', { message: '您不是房主，无权限进行此操作' });
		} else if (this.gamePlayers.length < 2) {
			player.send('$ALERT', { message: '玩家过少，无法开始' });
		} else {
			// this.game = new Game(this.blackDecks, this.whiteDecks);
			this.broadcast('$START');
			this.game = new Game(this, await cardService.getBlackCards(), await cardService.getWhiteCards());
			this.game.start();
		}
	}

	setWinner(player, uuid) {
		if (!this.game || this.game.phase !== 'JUDGING' || this.game.czar !== player) {
			player.send('$ALERT', { message: '无法进行该操作' });
		} else {
			this.game.setWinner(uuid);
		}
	}

	pickCards(player, cards) {
		if (this.game && this.game.phase === 'PICKING') {
			if (this.game.czar !== player) {
				this.game.pickWhiteCards(player, cards);
				player.send('$REMOVE_CARDS', cards.map(c => c._id));
			} else {
				player.send('$ALERT', { message: '裁判无法出卡' });
			}
		} else {
			player.send('$ALERT', { message: '本局已经结束了' });
		}
	}

	enter(player, spectate) {
		if (!spectate && !this.isGamePlayersFull()) {
			player.score = 0;
			this.gamePlayers.push(player);
			super.enter(player);
			this.broadcast('$ENTER', { nickname: player.nickname, uuid: player.uuid, spectate: false, host: this.host === player }, player);
			player.send('$ROOM', this.getRoomInfo());
			this.roomChange(true);
			this.checkHost();
		} else if (!this.isSpectatorsFull()) {
			player.score = 0;
			this.spectators.push(player);
			super.enter(player);
			this.broadcast('$ENTER', { nickname: player.nickname, uuid: player.uuid, spectate: true, host: false }, player);
			player.send('$ROOM', this.getRoomInfo());
			this.roomChange(true);
			this.checkHost();
		} else {
			player.send('$FULL');
		}
	}

	leave(player) {
		this.gamePlayers = this.gamePlayers.filter(p => p !== player);
		this.spectators = this.spectators.filter(p => p !== player);
		super.leave(player);
		this.roomChange(true);
		this.broadcast('$LEAVE', { uuid: player.uuid, nickname: player.nickname }, player);
		this.checkHost();

		if (this.game && this.game.currentRoundPlayers.includes(player)) {
			this.game.onPlayerLeave(player);
		}

		if (this.players.length === 0) {
			this.destroy();
		}
	}

	joinGamers(player) {
		if (!this.isGamePlayersFull()) {
			player.score = 0;
			this.spectators = this.spectators.filter(p => p !== player);
			this.gamePlayers.push(player);
			this.broadcast('$JOIN', { uuid: player.uuid, nickname: player.nickname });
			this.checkHost();
			this.roomChange(true);
		} else {
			player.send('$ALERT', { message: '玩家已满，无法加入！' });
		}
	}

	spectate(player) {
		if (!this.isSpectatorsFull()) {
			this.gamePlayers = this.gamePlayers.filter(p => p !== player);
			this.spectators.push(player);
			this.broadcast('$SPECTATE', { uuid: player.uuid, nickname: player.nickname });
			this.checkHost();
			this.roomChange(true);
			if (this.game && this.game.currentRoundPlayers.includes(player)) {
				this.game.onPlayerLeave(player);
			}
		} else {
			player.send('$ALERT', { message: '观众已满，无法加入！' });
		}
	}

	roomChange(lobbyOnly) {
		if (!lobbyOnly) {
			this.broadcast('$ROOM_CHANGED', this.getRoomInfo());
		}
		this.lobby.broadcast('$ROOM_CHANGED', this.getRoomShortInfo());
	}

	destroy() {
		this.players.forEach(p => this.lobby.enter(p));
		this.lobby.broadcast('$ROOM_DESTROYED', { id: this.id });
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

	static getRoomList() {
		return [...roomMap.values()].map(v => v.getRoomShortInfo());
	}

	static getRoomById(id) {
		return roomMap.get(id);
	}

	getRoomShortInfo() {
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

	getRoomInfo() {
		const decks = cardService.getDecksFromCache();
		return {
			id: this.id,
			name: this.name,
			password: !!this.password,
			blackDecks: this.blackDecks.map(b => decks.find(d => d.id === b).name),
			whiteDecks: this.whiteDecks.map(w => decks.find(d => d.id === w).name),
			players: this.gamePlayers.map(p => ({ uuid: p.uuid, nickname: p.nickname, host: this.host === p, score: p.score || 0 })),
			spectators: this.spectators.map(p => ({ uuid: p.uuid, nickname: p.nickname })),
			game: this.game && this.game.getGameInfo()
		}
	}

	isGamePlayersFull() {
		return this.gamePlayers.length >= (config.get('maxPlayers') || 8);
	}

	isSpectatorsFull() {
		return config.get('maxSpectators') >= 0 && this.spectators.length >= config.get('maxSpectators');
	}

	checkHost() {
		if (!this.gamePlayers.includes(this.host)) {
			this.host = null;
		}

		if (this.gamePlayers.length > 0) {
			if (!this.host) {
				this.host = this.gamePlayers[0];
				this.broadcast('$HOST', { uuid: this.host.uuid, nickname: this.host.nickname });
			}
		}
	}
}

module.exports = Room;