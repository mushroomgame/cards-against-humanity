import React, { Component } from 'react';

class RoomTag extends Component {
	state = {}
	render() {
		const { id, info } = this.props;
		const decks = info.whiteDecks.map(w => ({
			name: w,
			selection: 'white'
		}));
		info.blackDecks.forEach(b => {
			let deck = decks.find(d => d.name === b);
			if (deck) {
				deck.selection = 'both'
			} else {
				decks.push({
					name: b,
					selection: 'black'
				});
			}
		})

		return (
			<div className="RoomTag">
				<div>
					<span className="RoomTag-Id">{id}</span>
					<h2 className="RoomTag-Name">{info.name}</h2>
				</div>
				<div>
					<ul className="RoomTag-Decks">{decks.map(d =>
						<li className={`RoomTag-Decks-Deck ${d.selection === 'white' ? 'RoomTag-Decks-Deck_White' : (d.selection === 'black' ? 'RoomTag-Decks-Deck_Black' : 'RoomTag-Decks-Deck_Both')}`}>{d.name}</li>
					)}</ul>
					<span className="RoomTag-Players"><i className="icon-users"></i>{info.players}</span>
					<span className="RoomTag-Spectators"><i className="icon-eye"></i>{info.spectators}</span>
				</div>
			</div>
		);
	}
}

export default RoomTag;