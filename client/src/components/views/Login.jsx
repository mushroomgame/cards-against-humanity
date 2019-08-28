import React, { Component } from 'react';
import server from '../../services/server';
import alerter from '../../utils/alerter';
import whevent from 'whevent';
import Button from '../common/Button';
import Input from '../common/Input';


export default class Login extends Component {
	state = {
		connecting: false,
		nickname: '',
		placeholder: '游客' + Math.random().toString().substr(2, 4)
	}

	componentDidMount() {
		whevent.bind('$$OPEN', this.onOpen, this);
		whevent.bind('$$ERROR', this.onError, this);
		whevent.bind('$ALERT', this.onAlert, this);

		let nickname = localStorage.getItem('nickname');
		if (nickname) {
			this.setState({ nickname });
		}
	}

	componentWillUnmount() {
		whevent.unbind('$$OPEN', this.onOpen, this);
		whevent.unbind('$$ERROR', this.onError, this);
		whevent.unbind('$ALERT', this.onAlert, this);
	}

	onAlert(){
		this.setState({ connecting: false });
	}

	onError(err) {
		if (this.state.connecting) {
			alerter.alert('连接服务器失败');
			this.setState({ connecting: false });
			whevent.call('LOADING');
		}
	}

	onOpen() {
		const { nickname, placeholder } = this.state;
		server.send('$LOGIN', { nickname: nickname || placeholder });
	}

	onNicknameChange = nickname => {
		this.setState({ nickname });
	}

	onClickLogin = () => {
		const { nickname, placeholder } = this.state;
		const name = (nickname || placeholder).trim();
		if (!name) {
			alerter.alert('请输入昵称!');
			return;
		} else if (name.length > 20) {
			alerter.alert('昵称太长了!');
			return;
		}

		if (nickname) {
			localStorage.setItem('nickname', nickname);
		}
		this.setState({ connecting: true });
		whevent.call('LOADING', '登录中...');
		server.connect();
	}

	render() {
		return (
			<section className='Login'>
				<h1>Cards Against Humanity</h1>
				<Input className="Login-Input" onChange={this.onNicknameChange} placeholder={this.state.placeholder} value={this.state.nickname} />
				<Button className="Login-Button Button Button_Wide" color="#999" disabled={this.state.connecting} onClick={this.onClickLogin}>进入游戏</Button>
			</section>
		);
	}
}