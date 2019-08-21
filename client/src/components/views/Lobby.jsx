import React, { Component } from 'react';
import Mask from '../common/Mask';

class Lobby extends Component {
	state = {
		loading: true
	}

	render() {
		return (
			<React.Fragment>
				{this.state.loading && <Mask text="获取大厅信息..." />}
				<section className='Lobby'>

				</section>
			</React.Fragment>
		);
	}
}

export default Lobby;