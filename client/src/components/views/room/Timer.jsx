import React, { CSSProperties } from 'react';

const Timer = ({ percentage }) => {
	return (
		<div className="Timer" style={{ '--percentage': percentage }}></div>
	);
}

export default Timer;