const cardService = require('../services/cardService');

class Game {
	constructor(blackDeck, whiteDeck) {
		console.log(blackDeck, whiteDeck);
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
		this.phase = 'STOPPED';	// STOPPED, CHOOSING, JUDGING, SHOWING
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

	returnWhiteCard(id) {
		let card = this.whiteDeck.find(c => c._id === id);
		if (card) {
			this.playedWhiteCards.push(card);
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