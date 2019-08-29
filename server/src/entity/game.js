const cardService = require('../services/cardService');

class Game {
	constructor(room, blackDeck, whiteDeck) {
		this.room = room;
		this.blackDeck = blackDeck;
		this.whiteDeck = whiteDeck;
		this.phase = 'STOPPED';	// STOPPED, PICKING, JUDGING, SHOWING
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
		this.nextRound();
		// let round = this.round;
		// setTimeout(()=>{
		// 	if(this.round === round && this.phase === 'PICKING'){

		// 	}
		// }, 5000);
	}

	nextRound(){
		this.currentRoundPlayers = [...this.room.gamePlayers];
		this.pickedCards = new Map();

		let blackCard = this.getBlackCard();
		this.phase = 'PICKING';
		this.czarIndex--;
		if (this.czarIndex < 0) {
			this.czarIndex = this.room.gamePlayers.length - 1;
		}
		this.czar = this.room.gamePlayers[this.czarIndex];

		this.room.broadcast('$NEW_ROUND', { blackCard, czar: { uuid: this.czar.uuid, nickname: this.czar.nickname } });
		this.dealWhiteCards(...this.room.gamePlayers);
	}

	stop() {
		this.phase = 'STOPPED';
		this.currentRoundPlayers.forEach(p => this.returnAllCardsOfPlayer(p));
		this.room.broadcast('$STOP');
	}

	onPlayerLeave(player) {
		this.returnAllCardsOfPlayer(player);
		this.currentRoundPlayers = this.currentRoundPlayers.filter(p => p !== player);
		if (this.czar === player) {
			// TODO: next round
			this.stop();
		} else if (this.currentRoundPlayers.length < 2) {
			this.stop();
		}
	}

	setWinner(uuid) {
		const cards = this.pickedCards.get(uuid);
		const player = this.currentRoundPlayers.find(p => p.uuid === uuid);
		const nickname = (player && player.nickname) || '';
		this.phase = 'WAITING';
		this.room.broadcast('$WINNER', { uuid, nickname, cards });

		setTimeout(()=>{
			this.nextRound();
		}, 2000);
	}

	judging() {
		let data = [];
		[...this.pickedCards.keys()].forEach(key => {
			let cards = this.pickedCards.get(key);
			data.push({ uuid: key, cards });
		})
		this.phase = 'JUDGING';
		this.room.broadcast('$JUDGING', data);
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
		if (this.whiteCards.length > 0) {
			return this.whiteCards.pop();
		} else {
			this.whiteCards = this.playedWhiteCards;
			this.playedWhiteCards = [];
			this.shuffle(false);
		}

		return this.whiteCards.pop();
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

	returnAllCardsOfPlayer(player) {
		let cards = this.getHandCards(player);
		if (cards && cards.length > 0) {
			cards.forEach(c => this.returnWhiteCard(c));
			this.hands.delete(player.uuid);
		}
	}

	returnWhiteCard(card) {
		this.playedWhiteCards.push(card);
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
			if (card) {
				this.returnWhiteCard(card);
			}
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