const cache = require('../core/cache');
const config = require('config');
const http = require('../core/http');

function getDecks() {
	return new Promise((resolve, reject) => {
		const decks = [
			{ id: 1, name: '基本', white: 193, black: 88 },
			{ id: 2, name: 'A岛', white: 445, black: 156 },
			{ id: 3, name: '玩家自制', white: 1123, black: 557 }
		];
		cache.decks = decks;
		resolve(decks);
	});
}

async function getBlackCards(force) {
	if (!force && cache.blackCards) {
		return cache.blackCards;
	} else {
		cache.blackCards = await http.get(config.get('apiBase') + '/blackcards');
		return cache.blackCards;
	}
}

async function getWhiteCards(force) {
	if (!force && cache.whiteCards) {
		return cache.whiteCards;
	} else {
		cache.whiteCards = await http.get(config.get('apiBase') + '/whitecards');
		return cache.whiteCards;
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