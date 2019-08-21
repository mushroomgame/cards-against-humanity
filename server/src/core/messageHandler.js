const whevent = require('whevent');
const Player = require('../entity/player');
const Lobby = require('../entity/lobby');

class MessageHandler {
	start() {
		this.registerEvents();
	}

	registerEvents() {
		whevent.bind('$LOGIN', this.onLogin, this);
		whevent.bind('$LOBBY', this.onRequestLobby, this);
		whevent.bind('$CHAT', this.onChat, this);
	}

	onRequestLobby(player) {
		Lobby.$.enter(player);
	}

	onChat(player, {message}) {
		if (player.channel) {
			player.channel.broadcast('$CHAT', { player: { nickname: player.nickname, uuid: player.uuid }, message })
		}
	}

	onLogin(player, { nickname }) {
		let p = Player.getPlayerByNickname(nickname);
		if (p) {
			player.send('$ERROR', { message: '已经有同名玩家在线了' });
		} else {
			player.nickname = nickname;
			player.send('$LOGGED_IN', { nickname, uuid: player.uuid });
		}
	}
}

module.exports = MessageHandler;