import App from '../containers/App';

import { Page404 } from '../components';
import homeRoute from '../features/categoryAttribute/route';
import sampleRoute from '../features/sample/route';

export default [{
  path: '/',
  component: App,
  indexRoute: sampleRoute.siteIndexRoute,
  childRoutes: [
	sampleRoute,
    homeRoute,
       { path: '*', name: '404', component: Page404 },
  ],
}];
