import React, { Component } from 'react';
import Form from '../../common/Form';
import whevent from 'whevent';
import server from '../../../services/server';
import alerter from '../../../utils/alerter';

export default class RoomTag extends Component {
	state = {
		password: ''
	}

	onClick = () => {
		const { id, password } = this.props.data;
		const data = [
			{ name: 'password', type: 'password', label: '密码', value: this.state.password },
		];
		if (password) {
			const popup = <section>
				<Form onChange={this.onPasswordChange} buttons={[{ label: '进入', onClick: this.onClickEnter }]} data={data} />
			</section>;
			whevent.call('POPUP', 'ROOM_PASSWORD', popup);
		} else {
			server.send('$REQUEST_ENTER_ROOM', { id });
		}
	}

	onPasswordChange = (name, value) => {
		this.setState({ password: value });
	}

	onClickEnter = () => {
		const { password } = this.state;
		const { id } = this.props.data;
		if(!password){
			alerter.alert('请输入密码');
			return;
		}
		this.setState({password: ''});
		whevent.call('POPUP', 'ROOM_PASSWORD');
		server.send('$REQUEST_ENTER_ROOM', { id, password });
	}

	render() {
		const { id, name, password, whiteDecks, blackDecks, players, spectators } = this.props.data;
		const decks = whiteDecks.map(w => ({
			name: w,
			selection: 'white'
		}));
		blackDecks.forEach(b => {
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
			<div className="RoomTag" onClick={this.onClick}>
				<div>
					{password && <i className="RoomTag-Password icon-lock"></i>}
					<span className="RoomTag-Id">{id}</span>
					<h2 className="RoomTag-Name">{name}</h2>
				</div>
				<div>
					<ul className="RoomTag-Decks">{decks.map((d, index) =>
						<li key={`deck_${id}_${index}`} className={`RoomTag-Decks-Deck ${d.selection === 'white' ? 'RoomTag-Decks-Deck_White' : (d.selection === 'black' ? 'RoomTag-Decks-Deck_Black' : 'RoomTag-Decks-Deck_Both')}`}>{d.name}</li>
					)}</ul>
					<span className="RoomTag-Players"><i className="icon-users"></i>{players}</span>
					<span className="RoomTag-Spectators"><i className="icon-eye"></i>{spectators}</span>
				</div>
			</div>
		);
	}
}