import React, { Component } from 'react';

export default class WhiteCard extends Component {
	state = {}
	render() {
		return (<div className="WhiteCard">{this.props.children}</div>);
	}
}