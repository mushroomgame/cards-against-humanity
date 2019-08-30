import React, { Component } from 'react';
import Button from './Button';
import Article from './Article';
import config from '../../services/config';

const Welcome = ({ children }) => {
	return (
		<section className="Welcome">
			<div className="Welcome-Content"><Article source="welcome" data={{version: config.get('version')}} /></div>
		</section>
	);
}

export default Welcome;