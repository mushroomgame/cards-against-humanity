import React, { Component } from 'react';

export default class PlayerTag extends Component {
	state = {}
	render() {
		const { uuid, nickname } = this.props.player;
		return (
			<div className="PlayerTag">{nickname}</div>
		);
	}
}