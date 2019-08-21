import React, { Component } from 'react';

const Mask = ({ text }) => {
	return (
		<div className="Mask">
			<i className="Mask-Icon icon-spinner2"></i>
			<h1 className="Mask-Text">{text || '载入中...'}</h1>
		</div>
	);
}

export default Mask;