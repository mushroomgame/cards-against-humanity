import http from './core/http';
import config from './config';

export function getWhiteCards(tags) {
	return new Promise(function (resolve, reject) {
		let url = config.get('cardsApiBase') + '/whitecards';
		http.get(url).then(d => {
			let data = d.data;
			data.forEach(d => {
				if(d.tags){
					d.tags = JSON.parse(d.tags);
				}
			});
			resolve(data);
		});
	});
}

export function getBlackCards(tags) {
	return new Promise(function (resolve, reject) {
		let url = config.get('cardsApiBase') + '/blackcards';
		http.get(url).then(d => {
			let data = d.data;
			data.forEach(d => {
				if(d.tags){
					d.tags = JSON.parse(d.tags);
				}
			});
			resolve(data);
		});
	});
}

export function submitCard(card) {
	return new Promise(function (resolve, reject) {
		const cardsApiBase = config.get('cardsApiBase');
		http.post(`${cardsApiBase}/${card.type}cards`, {
			text: card.text,
			tags: JSON.stringify(card.tags)
		}).then(d => {
			resolve(d.data);
		});
	});
}

export default {
	getWhiteCards,
	getBlackCards,
	submitCard
};