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
		const { className, onChange, placeholder, ...rest } = this.props;
		return (
			<input className={`Input ${className}`} type="text" placeholder={placeholder} onChange={this.onChange} value={this.state.content} {...rest} />
		);
	}
}