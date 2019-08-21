import React, { Component } from 'react';
import server from '../../services/server';
import alerter from '../../utils/alerter';
import whevent from 'whevent';
import Button from '../common/Button';
import Input from '../common/Input';


export default class Login extends Component {
	state = {
		connecting: false,
		changed: false,
		nickname: '游客' + Math.random().toString().substr(2, 4)
	}

	componentDidMount() {
		whevent.bind('$$OPEN', this.onOpen, this);
		whevent.bind('$$ERROR', this.onError, this);
	}

	componentWillUnmount() {
		whevent.unbind('$$OPEN', this.onOpen, this);
		whevent.unbind('$$ERROR', this.onError, this);
	}

	onError(err) {
		if (this.state.connecting) {
			alerter.alert('连接服务器失败');
			this.setState({ connecting: false });
		}
	}

	onOpen() {
		const { nickname } = this.state;
		server.send('$LOGIN', { nickname });
	}

	onNicknameChange = nickname => {
		this.setState({ nickname })
	}

	onClickLogin = () => {
		let { nickname } = this.state;
		nickname = nickname.trim();
		if (!nickname) {
			alerter.alert('请输入昵称!');
			return;
		} else if (nickname.length > 20) {
			alerter.alert('昵称太长了!');
			return;
		}

		this.setState({ connecting: true });
		server.connect();
	}

	render() {
		return (
			<section className='Login'>
				<h1>Cards Against Humanity</h1>
				<Input className="Login-Input" onChange={this.onNicknameChange} placeholder={!this.state.changed && this.state.nickname} />
				<Button className="Login-Button Button_Wide" disabled={this.state.connecting} onClick={this.onClickLogin}>进入游戏</Button>
			</section>
		);
	}
}