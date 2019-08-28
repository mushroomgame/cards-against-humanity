import React, { Component } from 'react';

import global from '../../services/global';
import Chat from '../common/Chat';
import BlackCard from './room/BlackCard';
import Timer from './room/Timer';

import whevent from 'whevent';
import Button from '../common/Button';

import server from '../../services/server';
import alerter from '../../utils/alerter';
import PlayerList from '../common/PlayerList';
import WhiteCard from './room/WhiteCard';

export default class Room extends Component {
	state = {
		started: false,
		whiteCards: [],
		blackCard: null,
		choosen: []
	}

	componentWillMount() {
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);
		whevent.bind('$HOST', this.onHostChange, this);
		whevent.bind('$JOIN', this.onJoin, this);
		whevent.bind('$SPECTATE', this.onSpectate, this);
		whevent.bind('$START', this.onGameStart, this);
		whevent.bind('$BLACK', this.onGetBlackCard, this);
		whevent.bind('$WHITE', this.onGetWhiteCards, this);


		const { id, name, password, blackDecks, whiteDecks, players, spectators } = global.room;
		this.setState({ id, name, password, blackDecks, whiteDecks, players, spectators });
	}

	componentWillUnmount() {
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);
		whevent.unbind('$HOST', this.onHostChange, this);
		whevent.unbind('$JOIN', this.onJoin, this);
		whevent.unbind('$SPECTATE', this.onSpectate, this);
		whevent.unbind('$START', this.onGameStart, this);
		whevent.unbind('$BLACK', this.onGetBlackCard, this);
		whevent.unbind('$WHITE', this.onGetWhiteCards, this);
	}

	onGetBlackCard(card) {
		this.setState({ blackCard: card });
	}

	onGetWhiteCards(cards) {
		this.setState({ whiteCards: [...this.state.whiteCards, ...cards] });
	}

	onGameStart() {
		this.setState({ started: true });
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

	isSpectating() {
		return !!this.state.spectators.find(p => p.uuid === global.uuid);
	}

	isMeHost() {
		let host = this.state.players.find(p => p.host);
		if (host) {
			return host.uuid === global.uuid;
		}
	}

	onClickExit = () => {
		whevent.call('LOADING', '载入中...');
		server.send('$LOBBY');
	}

	onClickStartGame = () => {
		if (this.state.started) return;
		if (!this.isMeHost()) return;
		if (this.state.players.length < 2) {
			alerter.alert('玩家过少，无法开始游戏');
			return;
		}

		server.send('$START');
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

	render() {
		const { id, name, password, blackDecks, whiteDecks, players, spectators, started, blackCard, whiteCards } = this.state;
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
						{blackCard ? <BlackCard text={blackCard.text} /> : <BlackCard />}
						{!started && this.isMeHost() && <Button onClick={this.onClickStartGame} className="Room-StartButton" color="#c87">开始游戏</Button>}
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
					<div className="Room-HandArea" data-title="手牌">{whiteCards.map(card =>
						<WhiteCard key={`whitecard_${card._id}`}>{card.text}</WhiteCard>
					)}</div>
				</div>
				<div className="Room-RightPanel">
					<div className="Room-Players" data-title="玩家列表">
						<PlayerList players={this.state.players} />
					</div>
					<div className="Room-Spectators" data-title="观众">
						<PlayerList players={this.state.spectators} />
					</div>
					<div className="Room-Settings">
						<Button color="#999"><i className="icon-cog"></i></Button>
						<Button onClick={this.onClickSpectate} color="#999">{this.isSpectating() ? <i className="icon-arrow-up"></i> : <i className="icon-eye-plus"></i>}</Button>
						<Button onClick={this.onClickExit} color="#999"><i className="icon-exit"></i></Button>
					</div>
				</div>
			</section>
		);
	}
}