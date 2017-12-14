import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, browserHistory } from "react-router";

ReactDOM.render(
	<div>
		<Router history={browserHistory}>
			<Route path="/" component={App} />
			<Route path="/about" component="<h1>TEST 1</h1>" />
			<Route path="*" component="<h1>TEST 2</h1>" />
		</Router>
	</div>, 
	document.getElementById('root')
);

registerServiceWorker();
