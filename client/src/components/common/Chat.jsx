import React, { Component } from 'react';

import whevent from 'whevent';

import global from '../../services/global';
import Input from './Input';
import Button from './Button';

import server from '../../services/server';
import alerter from '../../utils/alerter';
import config from '../../services/config';

const sentMessages = [];
let pointer = 0;

export default class Chat extends Component {
	state = {
		logs: [],
		message: '',
		lastShowTime: null,
		mute: global.mute
	}

	componentWillMount() {
		whevent.bind('$CHAT', this.onReceiveChat, this);
		whevent.bind('$ENTER', this.onPlayerEnter, this);
		whevent.bind('$LEAVE', this.onPlayerLeave, this);
		whevent.bind('$HOST', this.onHostChange, this);
		whevent.bind('$SPECTATE', this.onSpectate, this);
		whevent.bind('$JOIN', this.onJoin, this);
		whevent.bind('$STOP', this.onStop, this);
		whevent.bind('$NEW_ROUND', this.onNewRound, this);

		whevent.bind('LOG', this.onLog, this);
	}

	componentWillUnmount() {
		whevent.unbind('$CHAT', this.onReceiveChat, this);
		whevent.unbind('$ENTER', this.onPlayerEnter, this);
		whevent.unbind('$LEAVE', this.onPlayerLeave, this);
		whevent.unbind('$HOST', this.onHostChange, this);
		whevent.unbind('$SPECTATE', this.onSpectate, this);
		whevent.unbind('$JOIN', this.onJoin, this);
		whevent.unbind('$STOP', this.onStop, this);
		whevent.unbind('$NEW_ROUND', this.onNewRound, this);

		whevent.unbind('LOG', this.onLog, this);
	}

	onNewRound({ czar }) {
		this.addLog({
			speaker: '系统',
			message: czar.uuid === global.uuid ? `新一轮游戏已开始，您是裁判` : `新一轮游戏已开始，裁判是 ${czar.nickname}`,
			from: 'System'
		});
	}

	onLog(message) {
		this.addLog({
			speaker: '系统',
			message,
			from: 'System'
		});
	}

	onStop() {
		this.addLog({
			speaker: '系统',
			message: '游戏已停止',
			from: 'System'
		});
	}

	onSpectate({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `${nickname} 开始观战`,
			from: 'System'
		});
	}

	onJoin({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `${nickname} 加入了游戏`,
			from: 'System'
		});
	}

	onHostChange({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `房主是 ${nickname}`,
			from: 'System'
		});
	}

	onReceiveChat({ player, message }) {
		const regex = /((http(s?):)\/\/.*\.(?:jpg|gif|png|jpeg|svg))/g;
		let result = regex.exec(message);
		if (result) {
			let messages = message.split(result[1]);
			if (!this.state.mute) {
				whevent.call('READ', messages[0] + messages[1], 'user');
			}
		} else {
			if (!this.state.mute) {
				whevent.call('READ', message, 'user');
			}
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
			message: `${nickname} 进入了${this.props.roomName || '大厅'}`,
			from: 'System'
		});
	}

	onPlayerLeave({ nickname }) {
		this.addLog({
			speaker: '系统',
			message: `${nickname} 离开了${this.props.roomName || '大厅'}`,
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
		} else if (message.startsWith('!')) {
			let result = /^\!(\w+)\s?(.+)?$/.exec(message);
			const command = result[1];
			let params = result[2];
			if (params) {
				params = params.split(' ').filter(p => p);
			}
			switch (command) {
				case 'card':
					whevent.call('CREATE_CARD_CLICKED');
					break;
				case 'manage':
					if (!params || !['white', 'black'].includes(params[0])) {
						alerter.alert('未知的卡牌类型');
					} else {
						whevent.call('MANAGE_CARDS', params[0]);
					}
					break;
				case 'reload':
					server.send('$RELOAD');
					break;
				case 'key':
					if (params && params[0]) {
						global.secret = params[0];
						alerter.info('密钥已设置');
						console.log(global.key);
					} else {
						alerter.alert('请输入密钥');
					}
					break;
				default:
					alerter.alert('未知指令');
					break;
			}
		} else if (message.length > 144) {
			alerter.alert('信息过长');
			return;
		} else {
			pointer = sentMessages.length;
			server.send('$CHAT', { message: this.state.message });
		}
		sentMessages.push(message);
		this.setState({ message: '' });

	}

	onClickMute = () => {
		global.mute = !global.mute;
		this.setState({ mute: global.mute });
		document.getElementById('TTS_system').pause();
		document.getElementById('TTS_user').pause();
	}

	onMessageChange = message => {
		this.setState({ message });
	}

	onKeyPress = (e) => {
		const { key } = e;
		if (key === 'Enter') {
			e.preventDefault();
			this.onClickSend();
		} else if (key === 'ArrowUp') {
			e.preventDefault();
			pointer = Math.max(pointer - 1, 0);
			const message = sentMessages[pointer];
			if (message) {
				this.setState({ message });
			}
		} else if (key === 'ArrowDown') {
			e.preventDefault();
			pointer = Math.min(pointer + 1, sentMessages.length - 1);
			const message = sentMessages[pointer];
			if (message) {
				this.setState({ message });
			}
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
										<img src={result[1]} alt="Chat" />
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
					<Button onClick={this.onClickMute} color="#999"><i className={this.state.mute ? "icon-volume-mute2" : "icon-volume-medium"}></i></Button>
					<Input onKeyDown={this.onKeyPress} onChange={this.onMessageChange} value={this.state.message} />
					<Button onClick={this.onClickSend} color="#999">发送</Button>
				</div>
			</div>
		);
	}
}