const cardService = require('../services/cardService');

class Game {
	constructor(room, blackDeck, whiteDeck) {
		this.room = room;
		this.blackDeck = blackDeck;
		this.whiteDeck = whiteDeck;
		this.phase = 'STOPPED';	// STOPPED, PICKING, JUDGING, SHOWING
		this.pickingTimer = null;
		this.judgingTimer = null;
	}

	getGameInfo() {
		return {
			phase: this.phase,
			blackCard: this.currentBlackCard,
			czar: this.czar && this.czar.uuid,
		}
	}

	start() {
		this.blackCards = [...this.blackDeck];
		this.whiteCards = [...this.whiteDeck];
		this.playedBlackCards = [];
		this.playedWhiteCards = [];
		this.hands = new Map();
		this.round = 0;
		this.czar = null;
		this.czarIndex = 0;
		this.shuffle(true);
		this.shuffle(false);
		this.round = 0;
		this.nextRound();
	}

	clearAFKPlayers() {
		const afkPlayers = this.room.gamePlayers.filter(p => p.afk >= 3);
		afkPlayers.forEach(p => {
			this.room.lobby.enter(p);
			p.afk = 0;
			p.send('$ALERT', { message: '您由于太久没有操作，被自动请出了对局' });
		});
	}

	nextRound() {
		this.clearAFKPlayers();

		if (this.pickingTimer) {
			clearTimeout(this.pickingTimer);
		}
		if (this.judgingTimer) {
			clearTimeout(this.judgingTimer);
		}
		this.round++;

		this.currentRoundPlayers = [...this.room.gamePlayers];
		if (this.currentRoundPlayers.length < 2) {
			this.stop();
			return;
		}

		this.pickedCards = new Map();

		let blackCard = this.getBlackCard();
		this.blanks = this.currentBlackCard.text.split('_').length - 1;
		this.phase = 'PICKING';
		this.czarIndex--;
		if (this.czarIndex < 0) {
			this.czarIndex = this.room.gamePlayers.length - 1;
		} else if (this.czarIndex >= this.room.gamePlayers.length) {
			this.czarIndex = this.room.gamePlayers.length - 1;
		}
		this.czar = this.room.gamePlayers[this.czarIndex];

		this.room.broadcast('$NEW_ROUND', { blackCard, czar: { uuid: this.czar.uuid, nickname: this.czar.nickname } });
		this.dealWhiteCards(...this.room.gamePlayers);

		this.setupPickingTimer();

		// console.log({
		// 	blackDeck: this.blackDeck.length,
		// 	whiteDeck: this.whiteDeck.length,
		// 	blackCards: this.blackCards.length,
		// 	whiteCards: this.whiteCards.length,
		// 	playedBlackCards: this.playedBlackCards.length,
		// 	playedWhiteCards: this.playedWhiteCards.length,
		// 	totalBlackCards: this.blackCards.length + this.playedBlackCards.length,
		// 	totalWhiteCards: this.whiteCards.length + this.playedWhiteCards.length
		// })
	}

	setupPickingTimer() {
		let round = this.round;
		let time = 15000 + (this.blanks * 5000);
		this.pickingTimer = setTimeout(() => {
			if (this.round === round && this.phase === 'PICKING') {
				let unpickedPlayers = this.currentRoundPlayers.filter(p => ![...this.pickedCards.keys()].find(k => k === p.uuid) && this.czar !== p);

				unpickedPlayers.forEach(p => {
					const hand = this.getHandCards(p);
					const cards = [];
					for (let i = 0; i < this.blanks; i++) {
						cards.push(hand[i]);
					}
					p.afk = (p.afk || 0) + 1;
					this.room.pickCards(p, cards);
				})
			}
		}, time);
		this.room.broadcast('$TIMER', { time });
	}

	setupJudgingTimer() {
		let round = this.round;
		let time = 15000 + (this.blanks * 5000);
		this.pickingTimer = setTimeout(() => {
			if (this.czar) {
				if (this.round === round && this.phase === 'JUDGING') {
					this.czar.afk = (this.czar.afk || 0) + 1;
					let uuid = [...this.pickedCards.keys()][Math.floor(this.pickedCards.size * Math.random())];
					this.setWinner(uuid);
				}
			}
		}, time);
		this.room.broadcast('$TIMER', { time });
	}

	stop() {
		this.phase = 'STOPPED';
		this.currentRoundPlayers.forEach(p => {
			this.hands.delete(p.uuid);
			p.score = 0;
			p.streak = 0;
		});
		this.room.broadcast('$STOP');
	}

	onPlayerLeave(player) {
		this.hands.delete(player.uuid)
		this.currentRoundPlayers = this.currentRoundPlayers.filter(p => p !== player);
		if ([...this.pickedCards.keys()].includes(player.uuid)) {
			this.pickedCards.delete(player.uuid);
		}
		if (this.currentRoundPlayers.length < 2) {
			this.stop();
		} else if (this.czar === player) {
			this.nextRound();
		}
	}

	setWinner(uuid) {
		const cards = this.pickedCards.get(uuid);
		const player = this.currentRoundPlayers.find(p => p.uuid === uuid);
		const nickname = (player && player.nickname) || '';

		this.currentRoundPlayers.forEach(p => {
			if (p.uuid !== uuid) {
				if (this.czar !== p) {
					p.streak = 0;
				}
			} else {
				p.streak = (p.streak || 0) + 1;
			}
		});

		let score = 1;
		let streak = 0;

		if (player) {
			streak = player.streak;
			score = Math.max(Math.floor(this.currentRoundPlayers.length * 0.5) + (streak - 1), 1);
			player.score = (player.score || 0) + score;
		}

		this.phase = 'WAITING';
		this.room.broadcast('$WINNER', { uuid, nickname, cards, score, streak });

		let time = 6000;
		this.room.broadcast('$TIMER', { time });
		setTimeout(() => {
			this.nextRound();
		}, time);
	}

	judging() {
		let aiCards = [];
		for (let i = 0; i < this.blanks; i++) {
			aiCards.push(this.getWhiteCard());
		}
		this.pickedCards.set(-1, aiCards);

		let data = [];
		[...this.pickedCards.keys()].forEach(key => {
			let cards = this.pickedCards.get(key);
			data.push({ uuid: key, cards });
		});

		this.phase = 'JUDGING';
		this.room.broadcast('$JUDGING', data);
		this.setupJudgingTimer();
	}

	shuffle(black) {
		if (black) {
			this.blackCards.sort(() => Math.random() > 0.5);
		} else {
			this.whiteCards.sort(() => Math.random() > 0.5);
		}
	}

	getHandCards(player) {
		return this.hands.get(player.uuid);
	}

	getWhiteCard() {
		if (this.whiteCards.length <= 0) {
			this.whiteCards = this.playedWhiteCards;
			this.playedWhiteCards = [];
			this.shuffle(false);
		}
		let card = this.whiteCards.pop();
		this.playedWhiteCards.push(card);
		return card;
	}

	getBlackCard() {
		if (this.blackCards.length === 0) {
			this.blackCards = this.playedBlackCards;
			this.playedBlackCards = [];
			this.shuffle(true);
		}
		let card = this.blackCards.pop();
		this.currentBlackCard = card;
		this.playedBlackCards.push(card);
		return card;
	}

	pickWhiteCards(player, cards) {
		let hands = this.getHandCards(player);
		if (hands) {
			hands = hands.filter(h => !cards.find(c => c._id === h._id));
			this.hands.set(player.uuid, hands);
		}

		let pickedCards = [];

		cards.forEach(_c => {
			let card = this.whiteDeck.find(c => c._id === _c._id);
			pickedCards.push(card);
		});

		this.room.broadcast('$PICKED', { uuid: player.uuid, nickname: player.nickname });

		this.pickedCards.set(player.uuid, pickedCards);

		if (this.pickedCards.size >= this.currentRoundPlayers.length - 1) {
			this.judging();
		}
	}

	dealWhiteCards(...players) {
		players.forEach(p => {
			let cards = this.getHandCards(p);
			if (!cards) {
				cards = [];
				this.hands.set(p.uuid, cards);
			}
			let dealCards = [];
			while (cards.length < 10) {
				let card = this.getWhiteCard();
				cards.push(card);
				dealCards.push(card);
			}
			p.send('$WHITE', dealCards);
		});
	}
}

module.exports = Game;