import React, { Component } from 'react';

import whevent from 'whevent';
import Color from 'color';

class Button extends Component {
	render() {
		const { className, children, onClick, disabled, color, event } = this.props;
		let style = {};
		if(color){
			let textColor = Color(color).lighten(1).hsl().string();
			let backgroundColor = color;

			style = {
				backgroundColor,
				color: textColor,
				'--shadow-color': Color(color).darken(0.25).saturate(-0.5).hsl().string()
			}
		}
		return <a
			style={style}
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