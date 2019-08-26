import React, { Component } from 'react';
import whevent from 'whevent';
import Chat from '../common/Chat';
import RoomTag from './lobby/RoomTag';
import PlayerTag from './lobby/PlayerTag';
import Button from '../common/Button';
import Form from '../common/Form';
import RoomCreation from './lobby/RoomCreation';

class Lobby extends Component {
	state = {
		rooms: [],
		players: []
	}

	componentWillMount() {
		whevent.bind('$LOBBY', this.onGetLobby, this);
		whevent.bind('$ENTER', this.onSomeoneEnter, this);
		whevent.bind('$LEAVE', this.onSomeoneLeave, this);

		whevent.bind('CREATE_ROOM_CLICKED', this.onClickCreateRoom, this);
	}

	componentWillUnmount() {
		whevent.unbind('$LOBBY', this.onGetLobby, this);
		whevent.unbind('$ENTER', this.onSomeoneEnter, this);
		whevent.unbind('$LEAVE', this.onSomeoneLeave, this);

		whevent.unbind('CREATE_ROOM_CLICKED', this.onClickCreateRoom, this);
	}

	onGetLobby({ rooms, players }) {
		whevent.call('LOADING');
		this.setState({ rooms, players });
	}

	onSomeoneEnter(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	onSomeoneLeave(player) {
		this.setState({ players: this.state.players.filter(p => p.uuid !== player.uuid) });
	}

	onClickCreateRoom(){
		const popup = <RoomCreation />;
		whevent.call('POPUP', 'ROOM_CREATION', popup);
	}

	render() {
		return (
			<React.Fragment>
				<section className="Lobby">
					<div className="Lobby-LeftPanel">
						<div className="Lobby-Rooms">{this.state.rooms.map(r =>
							<RoomTag key={`room_${r.id}`} id={r.id} info={r.info} />
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