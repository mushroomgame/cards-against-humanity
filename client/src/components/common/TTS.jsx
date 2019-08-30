import React, { Component } from 'react';
import whevent from 'whevent';

class TTS extends Component {
	state = {
		system: '',
		user: ''
	}

	componentWillMount() {
		whevent.bind('READ', this.onRead, this);
	}

	componentWillUnmount() {
		whevent.unbind('READ', this.onRead, this);
	}

	onRead(text, from) {
		let obj = {};
		obj[from] = text;
		this.setState(obj, () => {
			document.getElementById('TTS_' + from).play();
		});
	}

	render() {
		return (
			<div className="TTS">
				<audio id="TTS_system" src={`https://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&idx=1&tex=${encodeURIComponent(this.state.system)}&per=0&ctp=1&cuid=1&pdt=1`}></audio>
				<audio id="TTS_user" src={`https://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&idx=1&tex=${encodeURIComponent(this.state.user)}&per=0&ctp=1&cuid=1&pdt=1`}></audio>
			</div>
		);
	}
}

export default TTS;