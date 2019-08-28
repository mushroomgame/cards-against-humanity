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
		completedPick: false,
		blanks: 0,
		chosen: [],
		peek: null,
		czar: null
	}

	componentWillMount() {
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);
		whevent.bind('$HOST', this.onHostChange, this);
		whevent.bind('$JOIN', this.onJoin, this);
		whevent.bind('$SPECTATE', this.onSpectate, this);
		whevent.bind('$START', this.onGameStart, this);
		whevent.bind('$NEW_ROUND', this.onNewRound, this);
		whevent.bind('$WHITE', this.onGetWhiteCards, this);
		whevent.bind('$PICKED', this.onPlayerPicked, this);

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
		whevent.unbind('$NEW_ROUND', this.onNewRound, this);
		whevent.unbind('$WHITE', this.onGetWhiteCards, this);
		whevent.unbind('$PICKED', this.onPlayerPicked, this);
	}

	onNewRound({ blackCard, czar }) {
		const players = [...this.state.players];
		players.forEach(p => p.czar = false);
		let player = players.find(p => p.uuid === czar.uuid);
		if (player) {
			player.czar = true;
		}
		this.setState({ blackCard, blanks: blackCard.text.split('_').length - 1, players, completedPick: false, czar });
	}

	onPlayerPicked({ uuid, nickname }) {
		if (uuid === global.uuid) {
			whevent.call('LOADING');
			this.setState({ whiteCards: this.state.whiteCards.filter(w => !this.state.chosen.find(c => c._id === w._id)), chosen: [], completedPick: true });
		}
		const players = [...this.state.players];
		const player = players.find(p => p.uuid === uuid);
		if (player) {
			player.picked = true;
			this.setState({ players });
		}
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

	isMeSpectating() {
		return !!this.state.spectators.find(p => p.uuid === global.uuid);
	}

	isMeHost() {
		let host = this.state.players.find(p => p.host);
		if (host) {
			return host.uuid === global.uuid;
		}
	}

	isMeCzar() {
		let player = this.state.players.find(p => p.czar);
		if (player) {
			return player.uuid === global.uuid;
		}
	}

	onChooseCard(card) {
		if (this.state.chosen.length >= this.state.blanks) {
			return;
		} else if (this.state.chosen.includes(card)) {
			this.setState({ chosen: this.state.chosen.filter(c => c !== card) });
		} else {
			this.setState({ chosen: [...this.state.chosen, card] }, () => {
				if (this.state.chosen.length >= this.state.blanks) {
					whevent.call('LOADING', '发送中...');
					// this.setState({ whiteCards: this.state.whiteCards.filter(c => !this.state.chosen.includes(c)) })
					server.send('$PICK', this.state.chosen.map(c => ({ _id: c._id })));
				}
			});
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
		if (this.isMeSpectating()) {
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
		const { id, name, password, blackDecks, whiteDecks, players, spectators, started, blackCard, whiteCards, chosen, peek, completedPick } = this.state;
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
						{blackCard ?
							<BlackCard
								text={blackCard.text}
								replacements={chosen.map(c => c.text)}
								peek={peek && peek.text}
								preview={true}
							/> : <BlackCard />}
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
					<div className={`Room-HandArea${this.isMeCzar() ? ' Room-HandArea_Disabled' : ''}`} data-title="手牌">{whiteCards.map(card =>
						<WhiteCard
							chosen={!!chosen.find(c => c._id === card._id)}
							onMouseEnter={() => !completedPick && this.setState({ peek: card })}
							onMouseLeave={() => this.setState({ peek: null })}
							onClick={() => !completedPick && this.onChooseCard(card)}
							key={`whitecard_${card._id}`}
						>
							{card.text}
						</WhiteCard>
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
						<Button onClick={this.onClickSpectate} color="#999">{this.isMeSpectating() ? <i className="icon-arrow-up"></i> : <i className="icon-eye-plus"></i>}</Button>
						<Button onClick={this.onClickExit} color="#999"><i className="icon-exit"></i></Button>
					</div>
				</div>
			</section>
		);
	}
}