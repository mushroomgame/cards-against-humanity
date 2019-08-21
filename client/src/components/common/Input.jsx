import React, { Component } from 'react';

export default class Input extends Component {
	state = {
		content: ''
	}

	onChange = ({ target }) => {
		this.setState({ content: target.value });
		this.props.onChange && this.props.onChange(target.value);
	}

	render() {
		const { className, onChange, placeholder, onKeyPress, ...rest } = this.props;
		return (
			<input
				className={`Input ${className}`}
				type="text" placeholder={placeholder}
				onChange={this.onChange}
				onKeyPress={e => onKeyPress && onKeyPress(e)}
				value={this.props.value || this.state.content} {...rest}
			/>
		);
	}
}