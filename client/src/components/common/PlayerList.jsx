import React, { Component } from 'react';

import global from '../../services/global';

const PlayerList = ({ players }) => {
	return (
		<React.Fragment>{players.map(p =>
			<div className={`PlayerTag${p.host ? ' PlayerTag_Host' : ''}${global.uuid === p.uuid ? ' PlayerTag_Me' : ''}`} key={`player_${p.uuid}`}>{p.nickname}</div>
		)}</React.Fragment>
	);
}

export default PlayerList;