import React, { Component } from 'react';

import whevent from 'whevent';

import global from '../../services/global';
import Input from './Input';
import Button from './Button';

import server from '../../services/server';
import alerter from '../../utils/alerter';
import config from '../../services/config';

export default class Chat extends Component {
	state = {
		logs: [],
		message: '',
		lastShowTime: null
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
		
		const regex = /((http(s?):)\/\/.*\.(?:jpg|gif|png|jpeg|svg))/g;
		let result = regex.exec(message);
		if (result) {
			let messages = message.split(result[1]);
			whevent.call('READ', messages[0] + messages[1], 'user');
		} else {
			whevent.call('READ', message, 'user');
		}

		this.addLog({
			speaker: player.nickname,
			message,
			from: global.uuid === player.uuid ? 'Me' : (player.isSystem ? 'System' : 'Others')
		});
	}

	onPlayerEnter({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `${nickname} 进入了${this.props.roomName || '房间'}`,
			from: 'System'
		});
	}

	onPlayerLeave({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `${nickname} 离开了${this.props.roomName || '房间'}`,
			from: 'System'
		});
	}

	addLog(log) {
		let now = new Date();
		log.time = now.toLocaleTimeString();
		if (!this.state.lastShowTime || now.getTime() - this.state.lastShowTime.getTime() > 30000) {
			this.setState({ lastShowTime: now });
		} else {
			log.hideTime = true;
			if (this.state.logs[this.state.logs.length - 1].speaker === log.speaker) {
				log.consecutive = true;
			}
		}
		this.setState({ logs: [...this.state.logs, log] }, () => {
			document.querySelector('.Chat-Logs').scrollTop = document.querySelector('.Chat-Logs').scrollHeight;
		});
	}

	onClickSend = () => {
		const message = this.state.message.trim();
		if (!message) {
			alerter.alert('请输入聊天内容!');
			return;
		}
		this.setState({ message: '' });
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
					<dl key={`chat_${index}`} className={`Chat-Log Chat-Log-${log.from}${log.consecutive ? ' Chat-Log_Consecutive' : ''}${log.hideTime ? ' Chat-Log_HideTime' : ''}`} data-time={log.time}>
						<dt className="Chat-Log-Speaker">{log.speaker}</dt>
						{(() => {
							if (config.get('allowSendImage')) {
								const regex = /((http(s?):)\/\/.*\.(?:jpg|gif|png|jpeg|svg))/g;
								let result = regex.exec(log.message);
								if (result) {
									let messages = log.message.split(result[1]);
									return <dd className="Chat-Log-Message">
										{messages[0]}
										<img src={result[1]} />
										{messages[1]}
									</dd>;
								} else {

									return <dd className="Chat-Log-Message">{log.message}</dd>;
								}
							} else {
								return <dd className="Chat-Log-Message">{log.message}</dd>;
							}
						})()}
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