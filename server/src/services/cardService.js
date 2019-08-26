const cache = require('../core/cache');

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

function getDecksFromCache() {
	return cache.decks;
}

module.exports = {
	getDecks,
	getDecksFromCache
};