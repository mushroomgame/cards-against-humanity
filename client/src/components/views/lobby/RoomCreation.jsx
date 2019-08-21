import React, { Component } from 'react';
import Form from '../../common/Form';

class RoomCreation extends Component {
	state = {
		form: [
			{ name: 'roomName', type: 'text', value: '' },
			{ name: 'password', type: 'password', value: '' },
			{
				name: 'blackDecks',
				type: 'checkboxs',
				value: [
					{ name: '基础', id: 0, active: true },
					{ name: '网络用语', id: 1, active: true },
					{ name: 'A岛', id: 2, active: true },
				]
			},
			{
				name: 'whiteDecks',
				type: 'checkboxs',
				value: [
					{ name: '基础', id: 0, active: true },
					{ name: '网络用语', id: 1, active: true },
					{ name: 'A岛', id: 2, active: true },
				]
			}
		]
	}

	onChange = (name, value) => {
		
	}

	render() {
		return (
			<section className="RoomCreation">
				<Form onChange={this.onChange} data={this.state.form} />
			</section>
		);
	}
}

export default RoomCreation;