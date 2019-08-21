import React, { Component } from 'react';
import Mask from '../common/Mask';
import whevent from 'whevent';
import Chat from '../common/Chat';
import RoomTag from './lobby/RoomTag';
import PlayerTag from './lobby/PlayerTag';

class Lobby extends Component {
	state = {
		loading: true,
		rooms: [],
		players: []
	}

	componentWillMount() {
		whevent.bind('$LOBBY', this.onGetLobby, this);
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);
	}

	componentWillUnmount() {
		whevent.unbind('$LOBBY', this.onGetLobby, this);
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);
	}

	onGetLobby({ rooms, players }) {
		this.setState({ loading: false, rooms, players });
	}

	onSomeoneEnter(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	onSomeoneLeave(player) {
		this.setState({ players: this.state.players.filter(p => p.uuid !== player.uuid) });
	}

	render() {
		return (
			<React.Fragment>
				{this.state.loading && <Mask text="获取大厅信息..." />}
				<section className="Lobby">
					<div className="Lobby-LeftPanel">
						<div className="Lobby-Rooms">{this.state.rooms.map((r, index) =>
							<RoomTag key={`room_${index}`} room={r} />
						)}</div>
					</div>
					<div className="Lobby-CenterPanel">
						<Chat />
					</div>
					<div className="Lobby-RightPanel">
						<div className="Lobby-Players">{this.state.players.map((p, index) =>
							<PlayerTag key={`player_${index}`} player={p} />
						)}</div>
						<div className="Lobby-Settings">

						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default Lobby;