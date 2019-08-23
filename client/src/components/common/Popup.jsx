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
			this.setState({ popups });
		} else {
			this.setState({ popups: this.state.popups.filter(p => p.id !== id) });
		}
	}

	onClickBlankArea = id => {
		this.props.onClickBlankArea && this.props.onClickBlankArea();
		if (!this.props.preventBlankAreaDefaultBehavior) {
			this.setState({ popups: this.state.popups.filter(p => p.id !== id) });
		}
	}

	onClickClose = id => {
		this.setState({ popups: this.state.popups.filter(p => p.id !== id) });
	}

	render() {
		return (
			<section className={`Popup-Container ${this.state.popups.length > 0 ? 'Active' : ''}`}>
				{this.state.popups.map((p, index) =>
					<React.Fragment key={`popup_${index}`}>
						<div className="Popup-BlankArea" onClick={()=>this.onClickBlankArea(p.id)}></div>
						<div className="Popup" id={`popup_${p.id}`}>
							<a className="Popup-Close" href="javascript: void(0)" onClick={()=>this.onClickClose(p.id)}><i className="icon-cross"></i></a>
							{p.element}
						</div>
					</React.Fragment>
				)}
			</section>
		);
	}
}

export default Popup;