import React, { Component } from 'react';
import whevent from 'whevent';
import Chat from '../common/Chat';
import RoomTag from './lobby/RoomTag';
import PlayerTag from './lobby/PlayerTag';
import Button from '../common/Button';
import RoomCreation from './lobby/RoomCreation';

import global from '../../services/global';

class Lobby extends Component {
	state = {
		rooms: [],
		players: []
	}

	componentWillMount() {
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);

		whevent.bind('$ROOM_CREATED', this.onRoomCreated, this);
		whevent.bind('$ROOM_DESTROYED', this.onRoomDestroyed, this);
		whevent.bind('$ROOM_CHANGED', this.onRoomChanged, this);

		whevent.bind('CREATE_ROOM_CLICKED', this.onClickCreateRoom, this);

		const { rooms, players } = global.lobby;
		this.setState({ rooms, players });
	}

	componentWillUnmount() {
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);

		whevent.unbind('$ROOM_CREATED', this.onRoomCreated, this);
		whevent.unbind('$ROOM_DESTROYED', this.onRoomDestroyed, this);
		whevent.unbind('$ROOM_CHANGED', this.onRoomChanged, this);

		whevent.unbind('CREATE_ROOM_CLICKED', this.onClickCreateRoom, this);
	}

	onRoomCreated(room) {
		const rooms = [...this.state.rooms];
		rooms.push(room);
		rooms.sort((a, b) => a.id - b.id);
		this.setState({ rooms });
	}

	onRoomDestroyed({ id }) {
		this.setState({ rooms: this.state.rooms.filter(r => r.id !== id) });
	}

	onRoomChanged(room) {
		const rooms = [...this.state.rooms];
		let r = rooms.find(r => r.id === room.id);
		if (r) {
			Object.assign(r, room);
			console.log(rooms);
			this.setState({ rooms })
		}
	}

	onSomeoneEnter(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	onSomeoneLeave(player) {
		this.setState({ players: this.state.players.filter(p => p.uuid !== player.uuid) });
	}

	onClickCreateRoom() {
		const popup = <RoomCreation />;
		whevent.call('POPUP', 'ROOM_CREATION', popup);
	}

	render() {
		return (
			<React.Fragment>
				<section className="Lobby">
					<div className="Lobby-LeftPanel">
						<div className="Lobby-Rooms">{this.state.rooms.map(r =>
							<RoomTag key={`room_${r.id}`} data={r} />
						)}</div>
					</div>
					<div className="Lobby-CenterPanel">
						<Chat />
					</div>
					<div className="Lobby-RightPanel">
						<div className="Lobby-Players" data-title="玩家列表">{this.state.players.map((p, index) =>
							<PlayerTag key={`player_${index}`} player={p} />
						)}</div>
						<div className="Lobby-Settings">
							<Button className="Button_Wide" event="CREATE_ROOM_CLICKED"><i className="icon-plus"></i>创建房间</Button>
							<Button className="Button_Wide" event="CREATE_CARD_CLICKED"><i className="icon-upload2"></i>制作卡牌</Button>
							<Button className="Button_Wide" event="GAME_SETTINGS_CLICKED"><i className="icon-cog"></i>游戏设置</Button>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default Lobby;