import React, { Component } from 'react';

export default class WhiteCard extends Component {
	state = {}
	render() {
		return (
			<div onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} onClick={this.props.onClick} className={`WhiteCard${this.props.chosen ? ' WhiteCard_Chosen' : ''}`}>{this.props.children}</div>
		);
	}
}