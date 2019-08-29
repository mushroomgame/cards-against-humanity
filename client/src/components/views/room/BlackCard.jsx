import React, { Component } from 'react';

const BlackCard = ({ text, replacements }) => {
	text = text || '';
	let arr = text.split('_');
	let rep = (replacements && replacements.map(r => r.text)) || [];

	let t = arr.map((s, index) =>
		<React.Fragment key={`text_${index}`}>
			{s && <span className="BlackCard-Text">{s}</span>}
			{(index < arr.length - 1) &&
				<span className={rep && rep[index] ? 'BlackCard-Replacement' : 'BlackCard-Blank'}>{rep && rep[index] || '____'}</span>}
		</React.Fragment>);
	return (
		<div className="BlackCard">{t}</div>
	);
}

export default BlackCard;