import React, { Component } from 'react';

import global from '../../services/global';

const PlayerList = ({ players, showScore }) => {
	return (
		<React.Fragment>{players.map(p =>
			<div
				className={`
					PlayerTag
					${p.host ? ' PlayerTag_Host' : ''}
					${global.uuid === p.uuid ? ' PlayerTag_Me' : ''}
					${p.czar ? ' PlayerTag_Czar' : ''}
					${p.picked ? ' PlayerTag_Picked' : ''}
					${p.won ? ' PlayerTag_Won' : ''}
					${showScore ? ' PlayerTag_Score' : ''}
				`}
				data-score={(p.score || 0) + ''}
				key={`player_${p.uuid}`}>
				{p.nickname}
			</div>
		)}</React.Fragment>
	);
}

export default PlayerList;