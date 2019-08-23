import React, { Component } from 'react';
import Form from '../../common/Form';
import whevent from 'whevent';

import alerter from '../../../utils/alerter';
import server from '../../../services/server';
import global from '../../../services/global';

let data = [
	{ name: 'roomName', type: 'text', label: '房间名', value: '' },
	{ name: 'password', type: 'password', label: '密码', value: '' },
];

class RoomCreation extends Component {
	state = {
		initialized: false,
		loaded: false
	}

	componentDidMount() {
		whevent.bind('$DECKS', this.onGetDecks, this);
		if (!global.decks) {
			whevent.call('LOADING', '获取服务器信息...');
			server.send('$DECKS');
		} else {
			this.setState({ loaded: true });
		}
	}

	componentWillUnmount() {
		whevent.unbind('$DECKS', this.onGetDecks, this);
	}

	onGetDecks(decks) {
		if (this.state.initialized) return;
		whevent.call('LOADING');
		let whiteDecks = {
			name: 'whiteDecks',
			type: 'checkboxes',
			label: '白卡卡包',
			value: decks.map(d => ({
				id: d.id,
				name: d.name,
				// name: `${d.name}(${d.white}张)`,
				checked: true
			}))
		};

		let blackDecks = {
			name: 'blackDecks',
			type: 'checkboxes',
			label: '黑卡卡包',
			value: decks.map(d => ({
				id: d.id,
				name: d.name,
				// name: `${d.name}(${d.black}张)`,
				checked: true
			}))
		};
		data.push(whiteDecks, blackDecks);
		global.decks = decks;
		this.setState({ loaded: true, initialized: true });
	}

	onChange = (name, value) => {
		let item = data.find(d => d.name === name);
		item.value = value;
	}

	onCreate = () => {
		const finalData = {};
		data.map(d => {
			if (d.type === 'checkboxes') {
				finalData[d.name] = [];
				d.value.forEach(v => {
					v.checked && finalData[d.name].push(v.id);
				});
			} else {
				finalData[d.name] = d.value;
			}
			return finalData;
		});

		if (finalData.whiteDecks.length === 0) {
			alerter.alert('必须至少选择一个白卡卡包！');
			return;
		} else if (finalData.blackDecks.length === 0) {
			alerter.alert('必须至少选择一个黑卡卡包！');
			return;
		}

		server.send('$CREATE_ROOM', finalData);
	}

	render() {
		return (
			this.state.loaded && <section className="RoomCreation">
				<Form onChange={this.onChange} buttons={[{ label: '创建房间', onClick: this.onCreate }]} data={data} />
			</section>
		);
	}
}

export default RoomCreation;