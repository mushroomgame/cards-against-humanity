import React, { Component } from 'react';

import global from '../../services/global';

const PlayerList = ({ players }) => {
	return (
		<React.Fragment>{players.map(p =>
			<div className={`PlayerTag${p.host ? ' PlayerTag_Host' : ''}${global.uuid === p.uuid ? ' PlayerTag_Me' : ''}${p.czar ? ' PlayerTag_Czar' : ''}${p.picked ? ' PlayerTag_Picked' : ''}${p.won ? ' PlayerTag_Won' : ''}`} key={`player_${p.uuid}`}>{p.nickname}</div>
		)}</React.Fragment>
	);
}

export default PlayerList;