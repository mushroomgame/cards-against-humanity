import React, { Component } from 'react';

import whevent from 'whevent';

import global from '../../services/global';
import Input from './Input';
import Button from './Button';

import server from '../../services/server';
import alerter from '../../utils/alerter';

export default class Chat extends Component {
	state = {
		logs: [],
		message: ''
	}

	componentWillMount() {
		whevent.bind('$CHAT', this.onReceiveChat, this);
		whevent.bind('$ENTER', this.onPlayerEnter, this);
		whevent.bind('$LEAVE', this.onPlayerLeave, this);
	}

	componentWillUnmount() {
		whevent.unbind('$CHAT', this.onReceiveChat, this);
		whevent.unbind('$ENTER', this.onPlayerEnter, this);
		whevent.unbind('$LEAVE', this.onPlayerLeave, this);
	}

	onReceiveChat({ player, message }) {
		this.setState({
			logs: [...this.state.logs, {
				speaker: player.nickname,
				message,
				from: global.uuid === player.uuid ? 'Me' : (player.isSystem ? 'System' : 'Others')
			}]
		});
	}

	onPlayerEnter({ nickname }) {
		this.setState({
			logs: [...this.state.logs, {
				speaker: '系统',
				message: `${nickname} 进入了${this.props.roomName || '房间'}`,
				from: 'System'
			}]
		});
	}

	onPlayerLeave({ nickname }) {
		this.setState({
			logs: [...this.state.logs, {
				speaker: '系统',
				message: `${nickname} 离开了${this.props.roomName || '房间'}`,
				from: 'System'
			}]
		});
	}

	onClickSend = () => {
		const message = this.state.message.trim();
		if (!message) {
			alerter.alert('请输入聊天内容!');
			return;
		}
		this.setState({message: ''});
		server.send('$CHAT', { message: this.state.message });
	}

	onMessageChange = message => {
		this.setState({ message });
	}

	onKeyPress = ({ key }) => {
		if (key === 'Enter') {
			this.onClickSend();
		} else if (key === 'Up') {

		} else if (key === 'Down') {

		}
	}

	render() {
		return (
			<div className="Chat">
				<div className="Chat-Logs">{this.state.logs.map((log, index) =>
					<dl key={`chat_${index}`} className={`Chat-Log Chat-Log-${log.from}`}>
						<dt className="Chat-Log-Speaker">{log.speaker}</dt>
						<dd className="Chat-Log-Message">{log.message}</dd>
					</dl>
				)}</div>
				<div className="Chat-InputArea">
					<Input onKeyPress={this.onKeyPress} onChange={this.onMessageChange} value={this.state.message} />
					<Button onClick={this.onClickSend}>发送</Button>
				</div>
			</div>
		);
	}
}