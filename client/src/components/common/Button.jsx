import React, { Component } from 'react';

import whevent from 'whevent';

class Button extends Component {
	render() {
		const { className, children, onClick, disabled, backgroundColor, color, event } = this.props;
		return <a
			style={{ backgroundColor, color }}
			className={`Button ${className} ${disabled ? 'Button-Disabled' : ''}`}
			href="javascript: void(0)"
			onClick={e => {
				if (!disabled) {
					event && whevent.call(event);
					onClick && onClick(e);
				}
			}}
		>{children}</a>;
	}
}

export default Button;