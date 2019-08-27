import React, { Component } from 'react';

import global from '../../services/global';
import Chat from '../common/Chat';
import BlackCard from './room/BlackCard';
import Timer from './room/Timer';

import whevent from 'whevent';
import Button from '../common/Button';

import server from '../../services/server';
import alerter from '../../utils/alerter';

export default class Room extends Component {
	state = {}

	componentWillMount() {
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);
		whevent.bind('$HOST', this.onHostChange, this);
		whevent.bind('$JOIN', this.onJoin, this);
		whevent.bind('$SPECTATE', this.onSpectate, this);


		const { id, name, password, blackDecks, whiteDecks, players, spectators } = global.room;
		this.setState({ id, name, password, blackDecks, whiteDecks, players, spectators });
	}

	componentWillUnmount() {
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);
		whevent.unbind('$HOST', this.onHostChange, this);
		whevent.unbind('$JOIN', this.onJoin, this);
		whevent.unbind('$SPECTATE', this.onSpectate, this);
	}

	isSpectating() {
		return !!this.state.spectators.find(p => p.uuid === global.uuid);
	}

	onClickExit = () => {
		whevent.call('LOADING', '载入中...');
		server.send('$LOBBY');
	}

	onClickSpectate = () => {
		if (this.isSpectating()) {
			if (this.state.players.length >= 8) {
				alerter.alert('玩家已满，无法加入！');
			} else {
				server.send('$JOIN');
			}
		} else {
			server.send('$SPECTATE');
		}
	}

	onSomeoneEnter(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	onSomeoneLeave(player) {
		this.setState({ players: this.state.players.filter(p => p.uuid !== player.uuid) });
	}

	onHostChange({ uuid }) {
		const players = [...this.state.players];
		const player = players.find(p => p.uuid === uuid);
		if (player) {
			player.host = true;
			this.setState({ players });
		}
	}

	onJoin(player) {
		player.spectate = false;
		const players = [...this.state.players];
		const spectators = [...this.state.spectators].filter(p => p.uuid !== player.uuid);
		players.push(player);
		this.setState({ players, spectators });
	}

	onSpectate(player) {
		player.spectate = true;
		const players = [...this.state.players].filter(p => p.uuid !== player.uuid);
		const spectators = [...this.state.spectators];
		spectators.push(player);
		this.setState({ players, spectators });
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
						{/* <BlackCard text="_还是_玩得好啊。" replacements={['奶奶']} preview={true} /> */}
						<BlackCard />
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
						<div className={`Room-Players-PlayerTag${p.host ? ' Room-Players-PlayerTag_Host' : ''}`} key={`player_${p.uuid}`}>{p.nickname}</div>
					)}</div>
					<div className="Room-Spectators" data-title="观众">{spectators.map(p =>
						<div className={`Room-Spectators-PlayerTag`} key={`player_${p.uuid}`}>{p.nickname}</div>
					)}</div>
					<div className="Room-Settings">
						<Button><i className="icon-cog"></i></Button>
						<Button onClick={this.onClickSpectate}>{this.isSpectating() ? <i className="icon-arrow-up"></i> : <i className="icon-eye-plus"></i>}</Button>
						<Button onClick={this.onClickExit}><i className="icon-exit"></i></Button>
					</div>
				</div>
			</section>
		);
	}
}