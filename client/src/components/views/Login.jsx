import React, { Component } from 'react';
import server from '../../services/server';
import alerter from '../../utils/alerter';
import whevent from 'whevent';

export default class Login extends Component {
	state = {
		connecting: false,
		nickname: ''
	}

	componentDidMount() {
		whevent.on('$$OPEN', this.onOpen, this);
	}

	onOpen() {
		const { nickname } = this.state;
		server.send('$LOGIN', { nickname });
	}

	onNicknameChange = ({ target }) => {
		this.setState({ nickname: target.value })
	}

	onClickLogin = () => {
		let { nickname, connecting } = this.state;
		if (connecting) return;
		nickname = nickname.trim();
		if (!nickname) {
			alerter.alert('请输入昵称!');
			return;
		}else if(nickname.length > 20){
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
				<div className="Login-Form">
					<label htmlFor="nickname">Nickname</label>
					<input type="text" id="nickname" name="nickname" onChange={this.onNicknameChange} value={this.state.nickname} />
				</div>
				<a className={`Button Button-Login${this.state.connecting ? ' Button-Disabled' : ''}`} href="javascript:void(0)" onClick={this.onClickLogin}>Login</a>
			</section>
		);
	}
}