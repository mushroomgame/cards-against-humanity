import http from './core/http';
import config from './config';

export function getWhiteCards(tags) {
	return new Promise(function (resolve, reject) {
		let url = config.get('cardsApiBase') + '/whitecards';
		http.get(url).then(d => {
			let data = d.data;
			data.forEach(d => {
				if (d.tags) {
					d.tags = JSON.parse(d.tags);
				}
			});
			resolve(data);
		}).catch(ex => reject(ex));
	});
}

export function getBlackCards(tags) {
	return new Promise(function (resolve, reject) {
		let url = config.get('cardsApiBase') + '/blackcards';
		http.get(url).then(d => {
			let data = d.data;
			data.forEach(d => {
				if (d.tags) {
					d.tags = JSON.parse(d.tags);
				}
			});
			resolve(data);
		}).catch(ex => reject(ex));
	});
}

export function submitCard(card) {
	return new Promise(function (resolve, reject) {
		const cardsApiBase = config.get('cardsApiBase');
		http.post(`${cardsApiBase}/${card.type}cards`, {
			text: card.text,
			tags: JSON.stringify(card.tags)
		}).then(d => {
			if (d.data.status === 'success') {
				resolve(d.data);
			} else {
				reject(d.data);
			}
		}).catch(ex => reject(ex));
	});
}

export function alterCard(id, type, changes) {
	return new Promise(function (resolve, reject) {
		changes.secret = config.get('secret');
		const cardsApiBase = config.get('cardsApiBase');
		if (changes._id) {
			delete changes._id;
		}
		http.put(`${cardsApiBase}/${type}cards/${id}`, changes).then(d => {
			if (d.data.status === 'success') {
				resolve(d.data);
			} else {
				reject(d.data);
			}
		}).catch(ex => reject(ex));
	});
}

export function deleteCard(id, type) {
	return new Promise(function (resolve, reject) {
		const cardsApiBase = config.get('cardsApiBase');
		http.delete(`${cardsApiBase}/${type}cards/${id}`, { secret: config.get('secret') }).then(d => {
			if (d.data.status === 'success') {
				resolve(d.data);
			} else {
				reject(d.data);
			}
		}).catch(ex => reject(ex));
	});
}

export default {
	getWhiteCards,
	getBlackCards,
	alterCard,
	submitCard,
	deleteCard
};