import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import categoryReducer from '../features/categoryAttribute/categoryAttributeState.js';
import sampleReducer from '../features/sample/reducer';
import authContext from '../containers/contextState.js';
import componentCommonReducer from './../components/reducer';

import rootState from './rootState';


const reducerMap = Object.keys(rootState).filter(key=> typeof rootState[key].reducer === 'function').reduce((pre, cur)=>{
	pre[cur] = rootState[cur].reducer;
	return pre;
}, {});

const rootReducer = combineReducers({
  ...reducerMap,
  routing: routerReducer,
  home: categoryReducer,
  sample: sampleReducer,
  authContext,
  components:componentCommonReducer,
});

export default rootReducer;
