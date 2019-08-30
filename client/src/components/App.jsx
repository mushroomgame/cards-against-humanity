import React, { Component } from 'react';
import whevent from 'whevent';
import server from '../services/server';
import global from '../services/global';
import config from '../services/config';
import Login from './views/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lobby from './views/Lobby';
import alerter from '../utils/alerter';
import TTS from './common/TTS';
import Popup from './common/Popup';
import Loading from './common/Loading';
import Room from './views/Room';
import CardCreation from './common/CardCreation';

export default class App extends Component {

	state = {
		phase: 'LOGIN'
	}

	componentDidMount() {
		whevent.bind('$$CLOSE', this.onClosed, this);
		whevent.bind('$LOGGED_IN', this.onLoggedIn, this);
		whevent.bind('$LOBBY', this.onGetInLobby, this);
		whevent.bind('$ROOM', this.onGetInRoom, this);
		whevent.bind('$ALERT', this.onAlert, this);

		whevent.bind('CREATE_CARD_CLICKED', this.onCreateCard, this);
	}

	componentWillUnmount() {
		whevent.unbind('$$CLOSE', this.onClosed, this);
		whevent.unbind('$LOGGED_IN', this.onLoggedIn, this);
		whevent.unbind('$LOBBY', this.onGetInLobby, this);
		whevent.unbind('$ROOM', this.onGetInRoom, this);
		whevent.unbind('$ALERT', this.onAlert, this);

		whevent.unbind('CREATE_CARD_CLICKED', this.onCreateCard, this);
	}

	onAlert({ message }) {
		whevent.call('LOADING');
		alerter.alert(message);
	}

	onClosed() {
		alerter.alert('与服务器失去连接!');
		whevent.call('POPUP');
		this.setState({ phase: 'LOGIN' });
	}

	onLoggedIn({ uuid, nickname }) {
		global.uuid = uuid;
		global.nickname = nickname;
		server.send('$LOBBY');
	}

	onGetInLobby(data) {
		whevent.call('LOADING');
		global.lobby = data;
		this.setState({ phase: 'LOBBY' });
	}

	onGetInRoom(data) {
		whevent.call('LOADING');
		global.room = data;
		whevent.call('POPUP');
		this.setState({ phase: 'ROOM' });
	}

	onCreateCard(){
		const popup = <CardCreation />;
		whevent.call('POPUP', 'ROOM_CREATION', popup);
	}

	renderView() {
		const { phase } = this.state;
		switch (phase) {
			case 'LOGIN':
				return <Login />;
			case 'LOBBY':
				return <Lobby />;
			case 'ROOM':
				return <Room />;
			default:
				return null;
		}
	}

	render() {
		return (
			<div className='App'>
				{this.renderView()}
				<ToastContainer />
				<TTS />
				<Popup />
				<Loading />
			</div>
		);
	}
}