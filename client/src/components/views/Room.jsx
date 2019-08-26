import React, { Component } from 'react';

import global from '../../services/global';
import Chat from '../common/Chat';
import BlackCard from './room/blackCard';

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
		const { id, name, password, blackDecks, whiteDecks, players, spectators } = this.state;
		return (
			<section className="Room">
				<div className="Room-LeftPanel">
					<div className="Room-Info">
						{password && <i className="Room-Info-Password icon-lock"></i>}
						<span className="Room-Info-Id">{id}</span>
						<h2 className="Room-Info-Name">{name}</h2>
					</div>
					<div className="Room-BlackCardArea">
						<BlackCard text="_还是_玩得好啊。" replacements={['奶奶', '爷爷']} />
					</div>
					<div className="Room-Chat">
						<Chat roomName="房间" />
					</div>
				</div>
				<div className="Room-MiddleLeftPanel">
					<div className="Room-PlayArea"></div>
				</div>
				<div className="Room-MiddleRightPanel">
					<div className="Room-HandArea"></div>
				</div>
				<div className="Room-RightPanel">
					<div className="Room-Players"></div>
					<div className="Room-Spectators"></div>
				</div>
			</section>
		);
	}
}