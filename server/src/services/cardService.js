function getDecks() {
	return new Promise((resolve, reject) => {
		resolve([
			{ id: 1, name: '基本', white: 193, black: 88 },
			{ id: 2, name: 'Cards Against Humanity原版', white: 445, black: 156 },
			{ id: 3, name: 'A岛', white: 102, black: 54 },
			{ id: 4, name: '作死', white: 75, black: 36 },
			{ id: 5, name: '玩家自制', white: 1123, black: 557 }
		]);
	});
}

module.exports = {
	getDecks
};