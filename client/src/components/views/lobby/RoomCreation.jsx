import React, { Component } from 'react';
import Form from '../../common/Form';

import alerter from '../../../utils/alerter';
import server from '../../../services/server';

const data = [
	{ name: 'roomName', type: 'text', label: '房间名', value: '' },
	{ name: 'password', type: 'password', label: '密码', value: '' },
	{
		name: 'blackDecks',
		type: 'checkboxes',
		label: '黑卡卡包',
		value: [
			{ id: '0', name: '基础', checked: true },
			{ id: '1', name: 'Cards Against Humanity 原版', checked: true },
			{ id: '2', name: '网络用语', checked: true },
			{ id: '3', name: 'A岛', checked: true },
			{ id: '4', name: '玩家自制', checked: true }
		]
	},
	{
		name: 'whiteDecks',
		type: 'checkboxes',
		label: '白卡卡包',
		value: [
			{ id: '0', name: '基础', checked: true },
			{ id: '1', name: 'Cards Against Humanity 原版', checked: true },
			{ id: '2', name: '网络用语', checked: true },
			{ id: '3', name: 'A岛', checked: true },
			{ id: '4', name: '玩家自制', checked: true }
		]
	}
];

class RoomCreation extends Component {
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
			<section className="RoomCreation">
				<Form onChange={this.onChange} buttons={[{ label: '创建房间', onClick: this.onCreate }]} data={data} />
			</section>
		);
	}
}

export default RoomCreation;