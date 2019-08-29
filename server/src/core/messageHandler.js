const whevent = require('whevent');
const Player = require('../entity/player');
const Lobby = require('../entity/lobby');
const Room = require('../entity/room');
const config = require('config');

const { getDecksFromCache } = require('../services/cardService');

class MessageHandler {
	start() {
		this.registerEvents();
	}

	registerEvents() {
		whevent.bind('$LOGIN', this.onLogin, this);
		whevent.bind('$LOBBY', this.onRequestLobby, this);
		whevent.bind('$CHAT', this.onChat, this);
		whevent.bind('$CREATE_ROOM', this.onCreateRoom, this);
		whevent.bind('$DECKS', this.onRequestDecks, this);
		whevent.bind('$REQUEST_ENTER_ROOM', this.onRequestEnterRoom, this);
		whevent.bind('$SPECTATE', this.onRequestSpectate, this);
		whevent.bind('$JOIN', this.onRequestJoin, this);
		whevent.bind('$START', this.onRequestStart, this);
		whevent.bind('$PICK', this.onPickCard, this);
		whevent.bind('$WINNER', this.onPickWinner, this);
	}

	onPickWinner(player, { uuid }) {
		if (player.channel && player.channel instanceof Room) {
			player.afk = 0;
			player.channel.setWinner(player, uuid);
		} else {
			player.send('$ALERT', { message: '未知错误' });
		}
	}

	onPickCard(player, cards) {
		if (player.channel && player.channel instanceof Room) {
			player.afk = 0;
			player.channel.pickCards(player, cards);
		} else {
			player.send('$ALERT', { message: '未知错误' });
		}
	}

	onRequestStart(player) {
		if (player.channel && player.channel instanceof Room) {
			player.channel.start(player);
		} else {
			player.send('$ALERT', { message: '未知错误' });
		}
	}

	onRequestJoin(player) {
		if (player.channel && player.channel instanceof Room) {
			player.channel.joinGamers(player);
		} else {
			player.send('$ALERT', { message: '未知错误' });
		}
	}

	onRequestSpectate(player) {
		if (player.channel && player.channel.spectate) {
			player.channel.spectate(player);
		} else {
			player.send('$ALERT', { message: '未知错误' });
		}
	}

	onRequestLobby(player) {
		Lobby.$.enter(player);
	}

	onChat(player, { message }) {
		if (player.channel) {
			player.channel.broadcast('$CHAT', { player: { nickname: player.nickname, uuid: player.uuid }, message })
		}
	}

	onRequestDecks(player) {
		player.send('$DECKS', getDecksFromCache());
	}

	onLogin(player, { nickname, version }) {
		let serverVersion = config.get('version');
		if (version !== serverVersion) {
			player.send('$ALERT', { message: '客户端版本过低，请尝试强制刷新(SHIFT+F5)或清除浏览器缓存后再试！' });
			return;
		}

		let p = Player.getPlayerByNickname(nickname);
		if (p) {
			player.send('$ALERT', { message: '已经有同名玩家在线了' });
		} else {
			player.nickname = nickname;
			player.send('$LOGGED_IN', { nickname, uuid: player.uuid });
		}
	}

	onCreateRoom(player, { roomName, password, whiteDecks, blackDecks }) {
		const room = new Room(Lobby.$, roomName, password, blackDecks, whiteDecks);
		room.enter(player);
		Lobby.$.broadcast('$ROOM_CREATED', room.getRoomShortInfo());
	}

	onRequestEnterRoom(player, { id, password }) {
		const room = Room.getRoomById(id);
		if (!room) {
			player.send('$ALERT', { message: '该房间不存在！' });
		} else if (room.password && password !== room.password) {
			player.send('$ALERT', { message: '密码错误！' });
		} else {
			room.enter(player);
		}
	}
}

module.exports = MessageHandler;