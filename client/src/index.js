import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './sass/style.scss';
import * as serviceWorker from './serviceWorker';

import config from './services/config';

(async ()=>{
	await config.init();
	ReactDOM.render(<App />, document.getElementById('root'));
	serviceWorker.unregister();
})();

