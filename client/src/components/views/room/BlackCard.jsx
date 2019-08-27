import React, { Component } from 'react';

const BlackCard = ({ text, replacements, preview }) => {
	text = text || '';
	let arr = text.split('_');
	let t = arr.map((s, index) => <React.Fragment key={`text_${index}`}>
		{s && <span className="BlackCard-Text">{s}</span>}
		{(index < arr.length - 1) && <span className={replacements[index] ? (preview ? 'BlackCard-Replacement BlackCard-Replacement_Preview' : 'BlackCard-Replacement') : 'BlackCard-Blank'}>{replacements[index] || '____'}</span>}
	</React.Fragment>);
	return (
		<div className="BlackCard">{t}</div>
	);
}

export default BlackCard;