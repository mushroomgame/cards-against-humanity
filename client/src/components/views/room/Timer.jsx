import React, { Component } from 'react';
import whevent from 'whevent';

let timer = null;

class Timer extends Component {
	state = {
		percentage: 0,
	}

	componentWillMount() {
		whevent.bind('$TIMER', this.onTimer, this);
	}

	componentWillUnmount() {
		whevent.bind('$TIMER', this.onTimer, this);
	}

	onTimer({ time }) {
		let totalTime = time;
		let remainingTime = time;
		if(timer){
			clearInterval(timer);
		}

		timer = setInterval(()=>{
			remainingTime -= 24;
			this.setState({percentage: Math.max(remainingTime / totalTime, 0)})
		}, 24);
	}

	update(){
		requestAnimationFrame(this.update.bind(this));
	}

	render() {
		return (<div className="Timer" style={{ '--percentage': this.state.percentage }}></div>);
	}
}

export default Timer;