const cache = require('../core/cache');
const config = require('config');
const http = require('../core/http');

async function getDecks(force) {
	//TODO: Update API /api/decks/[white,black]
	const blacks = await getBlackCards(force);
	const whites = await getWhiteCards(force);

	const decks = [
		{ id: 1, name: '所有', white: whites.length, black: blacks.length }
	];

	const deckTexts = new Set();

	blacks.forEach(b => {
		let pack = b.tags && b.tags.find(t => t.startsWith('#'));
		if (pack) {
			deckTexts.add(pack.substr(1));
		}
	});

	[...deckTexts].forEach(d => {
		let deck = {id: decks.length + 1, name: d};
		decks.push(deck);
	});

	cache.decks = decks;
	return decks;
}

async function getBlackCards(force) {
	if (!force && cache.blackCards) {
		return cache.blackCards;
	} else {
		const result = await http.get(config.get('apiBase') + '/blackcards');
		if (result.data) {
			cache.blackCards = result.data.filter(c => c.status);
			cache.blackCards.forEach(c => c.tags = JSON.parse(c.tags));
			return cache.blackCards;
		}
	}
}

async function getWhiteCards(force) {
	if (!force && cache.whiteCards) {
		return cache.whiteCards;
	} else {
		const result = await http.get(config.get('apiBase') + '/whitecards');
		if (result.data) {
			cache.whiteCards = result.data.filter(c => c.status);
			cache.whiteCards.forEach(c => c.tags = JSON.parse(c.tags));
			return cache.whiteCards;
		}
	}
}

function getDecksFromCache() {
	return cache.decks;
}

module.exports = {
	getDecks,
	getDecksFromCache,
	getBlackCards,
	getWhiteCards
};