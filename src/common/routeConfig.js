import App from '../containers/App';

import { Page404 } from '../components';
import homeRoute from '../features/categoryAttribute/route';
import sampleRoute from '../features/sample/route';
import stockLevelRoute from '../features/stockLevel/route';
// import stockFreezeEditRoute from '../features/stockFreezeEdit/route';
import {hasAccessAuth} from './helper.js';
import routeMap from './routeMap.js';
import NoAuth from '../components/NoAuthPage.js';
import {actions} from '../containers/contextState.js';
import {NO_AUTH_PATH} from './constants.js';

const config = [{
  path: '/',
  component: App,
  indexRoute: sampleRoute.siteIndexRoute,
  childRoutes: [
	sampleRoute,
    homeRoute
  ],
}];

function routeConfig ( store  ){

	const onEnter = (nextState, replace, cb)=>{
		const checkAuth = (aAuth)=>{

			let _route = nextState.location.pathname;

			 _route =  _route.indexOf('/') === 0 ? _route.slice(1): _route;
			
			if(!hasAccessAuth(routeMap[_route],aAuth)){
				replace({
					pathname:NO_AUTH_PATH
				});
			}
			cb();
		}
		const state = store.getState();
		if(!state.authContext.auth){
			var unsubscribe = store.subscribe(()=>{
				if(store.getState().authContext.auth){
					unsubscribe();
					checkAuth(store.getState().authContext.auth);
				}
			});
		
		}else{
			checkAuth(state.authContext.auth);
		}
	};

	const bindEnter = (aRoutes)=>{
		aRoutes.forEach((oRoute)=>{
			if(oRoute.path && oRoute.path.length > 0){
				oRoute.onEnter = onEnter;
					console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
				console.log(oRoute.path);
			}
			if(oRoute.childRoutes){
				bindEnter(oRoute.childRoutes);
			}
		});
	};
	let __aConfig = config.slice();	
	bindEnter(__aConfig[0].childRoutes);

	__aConfig[0].childRoutes.push({
		path:NO_AUTH_PATH,
		component:NoAuth
	});
	__aConfig[0].childRoutes.push({
		 path: '*', name: '404', component: Page404 
	});

	actions.getAuthorization()(store.dispatch);
	
	function _getRoute (){
		return __aConfig;
	}
	routeConfig = _getRoute;
	return _getRoute();
}

export {routeConfig};
