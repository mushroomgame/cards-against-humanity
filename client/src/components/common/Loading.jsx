import React, { Component } from 'react';

import whevent from 'whevent';

export default class Loading extends Component {
	state = {
		showing: false,
		text: ''
	}

	componentWillMount() {
		whevent.bind('LOADING', this.onLoading, this);
	}

	componentWillUnmount() {
		whevent.unbind('LOADING', this.onLoading, this);
	}

	onLoading(text) {
		if (text) {
			this.setState({ showing: true, text });
		} else {
			this.setState({ showing: false });
		}
	}

	render() {
		return (
			this.state.showing && <div className="Loading">
				<i className="Loading-Icon icon-spinner2"></i>
				<h1 className="Loading-Text">{this.state.text}</h1>
			</div>
		);
	}
}