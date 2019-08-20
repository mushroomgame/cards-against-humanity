import React, { Component } from 'react';
import Login from './views/Login';

export default class App extends Component {
	state = {}
	render() {
		return (
			<div className='App'>
				<Login />
			</div>
		);
	}
}