import React, { Component } from 'react';

const BlackCard = ({ text, replacements }) => {
	let arr = text.split('_');
	let t = arr.map((s, index) => <React.Fragment>
		{s && <span className="BlackCard-Text">{s}</span>}
		{(index < arr.length - 1) && <span className={replacements[index] ? 'BlackCard-Replacement' : 'BlackCard-Blank'}>{replacements[index] || '____'}</span>}
	</React.Fragment>);
	return (
		<div className="BlackCard">{t}</div>
	);
}

export default BlackCard;