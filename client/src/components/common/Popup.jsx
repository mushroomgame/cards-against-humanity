import React, { Component } from 'react';
import whevent from 'whevent';

class Popup extends Component {
	state = {
		popups: []
	}

	componentWillMount() {
		whevent.bind('POPUP', this.onPopup, this);
	}

	componentWillUnmount() {
		whevent.unbind('POPUP', this.onPopup, this);
	}

	onPopup(id, element) {
		if (element) {
			let popups = this.state.popups.filter(p => p.id !== id);
			popups.push({ id, element });
			console.log(popups);
			this.setState({popups});
		} else {
			this.setState({ popups: this.state.popups.filter(p => p.id !== id) });
		}
	}

	render() {
		return (
			<section className="Popup-Container">{this.state.popups.map((p, index) =>
				<div key={`popup_${index}`} className="Popup" id={`popup_${p.id}`}>
					{p.element}
				</div>
			)}</section>
		);
	}
}

export default Popup;