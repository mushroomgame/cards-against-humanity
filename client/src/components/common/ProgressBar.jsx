import React, { Component } from 'react';

const ProgressBar = ({ text, total, completed }) => {
	return (
		<div className="ProgressBar">
			<div className="ProgressBar-Bar" style={{ '--progress': completed / total || 0 }}></div>
			<span className="ProgressBar-Title">{`${text}：${completed}/${total}`}</span>
		</div>
	);
}

export default ProgressBar;