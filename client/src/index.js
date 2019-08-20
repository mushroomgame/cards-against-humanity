import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './sass/style.scss';
import * as serviceWorker from './serviceWorker';

import { init } from './services/config';

(async ()=>{
	await init();
	ReactDOM.render(<App />, document.getElementById('root'));
	serviceWorker.unregister();
})();

