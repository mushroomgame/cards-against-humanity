import React, { Component } from 'react';
import whevent from 'whevent';
import server from '../services/server';
import global from '../services/global';
import Login from './views/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lobby from './views/Lobby';
import alerter from '../utils/alerter';
import TTS from './common/TTS';
import Popup from './common/Popup';
import Loading from './common/Loading';

export default class App extends Component {

	state = {
		phase: 'LOGIN'
	}

	componentDidMount() {
		whevent.bind('$$CLOSE', this.onClosed, this);
		whevent.bind('$LOGGED_IN', this.onLoggedIn, this);
	}

	componentWillUnmount() {
		whevent.unbind('$$CLOSE', this.onClosed, this);
		whevent.unbind('$LOGGED_IN', this.onLoggedIn, this);
	}

	onClosed() {
		alerter.alert('与服务器失去连接!');
		whevent.call('POPUP');
		this.setState({ phase: 'LOGIN' });
	}

	onLoggedIn({ uuid, nickname }) {
		global.uuid = uuid;
		global.nickname = nickname;
		this.setState({ phase: 'LOBBY' }, () => {
			server.send('$LOBBY');
		});
	}

	renderView() {
		const { phase } = this.state;
		switch (phase) {
			case 'LOGIN':
				return <Login />;
			case 'LOBBY':
				return <Lobby />;
			case 'ROOM':
				return null;
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