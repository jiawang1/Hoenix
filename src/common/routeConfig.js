import App from '../containers/App';

import { Page404 } from '../components';
import homeRoute from '../features/categoryAttribute/route';
import sampleRoute from '../features/sample/route';
import stockLevelRoute from '../features/stockLevel/route';
// import stockFreezeEditRoute from '../features/stockFreezeEdit/route';

export default [{
  path: '/',
  component: App,
  indexRoute: sampleRoute.siteIndexRoute,
  childRoutes: [
	sampleRoute,
    homeRoute,
    stockLevelRoute,
    // stockFreezeEditRoute,
    //    { path: '*', name: '404', component: Page404 },
  ],
}];
