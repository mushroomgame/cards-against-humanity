import React, { Component } from 'react';

import global from '../../services/global';
import Chat from '../common/Chat';
import BlackCard from './room/BlackCard';
import Timer from './room/Timer';

import whevent from 'whevent';

export default class Room extends Component {
	state = {}

	componentWillMount() {
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);


		const { id, name, password, blackDecks, whiteDecks, players, spectators } = global.room;
		this.setState({ id, name, password, blackDecks, whiteDecks, players, spectators });
	}

	componentWillUnmount() {
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);
	}

	onSomeoneEnter(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	onSomeoneLeave(player) {
		this.setState({ players: this.state.players.filter(p => p.uuid !== player.uuid) });
	}

	render() {
		const { id, name, password, blackDecks, whiteDecks, players, spectators } = this.state;
		return (
			<section className="Room">
				<div className="Room-LeftPanel">
					<div className="Room-BlackCardArea">
						<div className="Room-Info">
							{password && <i className="Room-Info-Password icon-lock"></i>}
							<span className="Room-Info-Id">{id}</span>
							<h2 className="Room-Info-Name">{name}</h2>
						</div>
						<BlackCard text="_还是_玩得好啊。" replacements={['奶奶']} preview={true} />
						<Timer percentage={1} />
					</div>
					<div className="Room-Chat">
						<Chat roomName="房间" />
					</div>
				</div>
				<div className="Room-MiddleLeftPanel">
					<div className="Room-PlayArea" data-title="出牌区域"></div>
				</div>
				<div className="Room-MiddleRightPanel">
					<div className="Room-HandArea" data-title="手牌"></div>
				</div>
				<div className="Room-RightPanel">
					<div className="Room-Players" data-title="玩家列表">{players.map(p =>
						<div className="Room-Players-PlayerTag" key={`player_${p.uuid}`}>{p.nickname}</div>
					)}</div>
					<div className="Room-Spectators" data-title="观众"></div>
				</div>
			</section>
		);
	}
}