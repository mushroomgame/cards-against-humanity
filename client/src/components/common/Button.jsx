import React, { Component } from 'react';

class Button extends Component {
	render() {
		const { className, children, onClick, disabled, backgroundColor, color } = this.props;
		return <a style={{ backgroundColor, color }} className={`Button ${className} ${disabled ? 'Button-Disabled' : ''}`} href="javascript: void(0)" onClick={e => !disabled && onClick(e)}>{children}</a>;
	}
}

export default Button;