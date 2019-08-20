import React, { Component } from 'react';
import whevent from 'whevent';
import server from '../services/server';
import global from '../services/global';
import Login from './views/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {

	state = {
		phase: 'LOGIN'
	}

	componentDidMount() {
		whevent.bind('$LOGGED_IN', this.onLoggedIn, this);
	}

	componentWillUnmount() {
		whevent.unbind('$LOGGED_IN', this.onLoggedIn, this);
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
					}
				})()}
				<ToastContainer />
			</div>
		);
	}
}