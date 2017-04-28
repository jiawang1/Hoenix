import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/categoryAttribute/reducer';
import sampleReducer from '../features/sample/reducer';
import productInfoReducer from '../features/productInfo/reducer';
import stockLevelReducer from '../features/stockLevel/reducer';
import stockFreezeReducer from '../features/stockFreeze/reducer';
import authContext from '../containers/contextState.js';

const rootReducer = combineReducers({
  routing: routerReducer,
  home: homeReducer,
  sample: sampleReducer,
  productInfo: productInfoReducer,
  stockLevel: stockLevelReducer,
  authContext,
  stockFreeze: stockFreezeReducer,
});

export default rootReducer;
