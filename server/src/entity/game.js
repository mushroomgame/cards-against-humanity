const cardService = require('../services/cardService');

class Game {
	constructor(room, blackDeck, whiteDeck) {
		console.log(blackDeck, whiteDeck);
		this.room = room;
		this.blackDeck = blackDeck;
		this.whiteDeck = whiteDeck;
		this.blackCards = [...this.blackDeck];
		this.playedBlackCards = [];
		this.whiteCards = [...this.whiteDeck];
		this.playedWhiteCards = [];
		this.hands = new Map();
		this.shuffle(true);
		this.shuffle(false);
		this.round = 0;
		this.czar = null;
		this.czarIndex = 0;
		this.phase = 'STOPPED';	// STOPPED, PICKING, JUDGING, SHOWING
	}

	start() {
		this.round++;
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

		// let round = this.round;
		// setTimeout(()=>{
		// 	if(this.round === round && this.phase === 'PICKING'){

		// 	}
		// }, 5000);
	}

	judging() {
		let data = [];
		[...this.pickedCards.keys()].forEach(key => {
			let cards = this.pickedCards.get(key);
			data.push({ uuid: key, cards });
		})
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

	pickWhiteCards(player, cards) {
		let hands = this.getHandCards(player);
		if (hands) {
			hands = hands.filter(h => !cards.find(c => c._id === h._id));
			this.hands.set(player.uuid, hands);
		}

		let pickedCards = [];

		cards.forEach(card => {
			let card = this.whiteDeck.find(c => c._id === card._id);
			pickedCards.push(card);
			if (card) {
				this.playedWhiteCards.push(card);
			}
		});

		this.room.broadcast('$PICKED', { player: { uuid: player.uuid, nickname: player.nickname } });

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