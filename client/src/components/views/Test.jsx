import React, { Component } from 'react';
import server from '../../services/server';

import whevent from 'whevent';

export default class Test extends Component {
	state = {
		logs: []
	}

	componentDidMount() {
		whevent.on('$OPEN', this.onConnect, this);
		whevent.on('$MESSAGE', this.onMessage, this);
		whevent.on('$ERROR', this.onError, this);
		whevent.on('$CLOSE', this.onClose, this);
		this.setState({ logs: [...this.state.logs, `Connecting to server...`] });
		try {
			server.connect();
		} catch (ex) {
			this.setState({ logs: [...this.state.logs, `ERROR: ${ex}`] });
		}
	}

	componentWillUnmount() {
		whevent.off('$OPEN', this.onConnect, this);
		whevent.off('$MESSAGE', this.onMessage, this);
		whevent.off('$ERROR', this.onError, this);
		whevent.off('$CLOSE', this.onClose, this);
	}

	onConnect() {
		const message = 'Hello server!';
		this.setState({ logs: [...this.state.logs, 'Connected to server!'] });
		server.send('GREET', { message });
		this.setState({ logs: [...this.state.logs, `Send: "${message}"`] });
	}

	onMessage(data) {
		this.setState({ logs: [...this.state.logs, `Receive: signal:"${data.signal}", data: "${JSON.stringify(data.data)}"`] });
	}

	onError(err) {
		this.setState({ logs: [...this.state.logs, `ERROR: ${err}`] });
	}

	onClose() {
		this.setState({ logs: [...this.state.logs, `Disconnected from server!`] });
	}

	render() {
		const { logs } = this.state;
		return (
			<div>{logs.map((log, index) => (
				<h4 key={index}>{log}</h4>
			))}</div>
		);
	}
}