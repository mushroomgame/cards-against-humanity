import React, { Component } from 'react';

const BlackCard = ({ text, replacements, peek, preview }) => {
	text = text || '';
	let arr = text.split('_');
	let rep = [];
	if (replacements) {
		rep = [...replacements];
	}

	if (peek) {
		rep.push(peek);
	}
	let t = arr.map((s, index) =>
		<React.Fragment key={`text_${index}`}>
			{s && <span className="BlackCard-Text">{s}</span>}
			{(index < arr.length - 1) &&
				<span className={rep && rep[index] ? (preview ? 'BlackCard-Replacement BlackCard-Replacement_Preview' : 'BlackCard-Replacement') : 'BlackCard-Blank'}>{rep && rep[index] || '____'}</span>}
		</React.Fragment>);
	return (
		<div className="BlackCard">{t}</div>
	);
}

export default BlackCard;