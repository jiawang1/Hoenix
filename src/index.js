import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configStore from './common/configStore';
import {routeConfig} from './common/routeConfig';

const store = configStore();
const history = syncHistoryWithStore(hashHistory, store);

const root = document.createElement('div');
root.className = "app-root";
document.body.appendChild(root);

render(
  <Provider store={store}>
	  <Router history={history} routes={routeConfig(store)} />
  </Provider>,
  root
);
