import React, { Component } from 'react';

import global from '../../services/global';

export default class Room extends Component {
	state = {}

	componentWillMount() {
		const { id, name, password, blackDecks, whiteDecks, players, spectators } = global.room;
		console.log(global.room);
		this.setState({ id, name, password, blackDecks, whiteDecks, players, spectators });
	}

	componentWillUnmount() {

	}

	render() {
		return (
			<section className="Room"></section>
		);
	}
}