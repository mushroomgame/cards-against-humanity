import React, { Component } from 'react';
import whevent from 'whevent';
import server from '../services/server';
import global from '../services/global';
import Login from './views/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lobby from './views/Lobby';
import alerter from '../utils/alerter';

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

	onClosed(){
		alerter.alert('与服务器失去连接!');
		this.setState({ phase: 'LOGIN' });
	}

	onLoggedIn({ uuid, nickname }) {
		global.uuid = uuid;
		global.nickname = nickname;
		this.setState({ phase: 'LOBBY' }, () => {
			server.send('$LOBBY');
		});
	}

	render() {
		const { phase } = this.state;
		return (
			<div className='App'>
				{(() => {
					switch (phase) {
						case 'LOGIN':
							return <Login />;
						case 'LOBBY':
							return <Lobby />;
						default:
							return null;
					}
				})()}
				<ToastContainer />
			</div>
		);
	}
}