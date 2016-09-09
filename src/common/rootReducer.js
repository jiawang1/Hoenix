import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import homeReducer from '../features/categoryAttribute/reducer';
import sampleReducer from '../features/sample/reducer';
import productInfoReducer from '../features/product-info/reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  home: homeReducer,
  sample: sampleReducer,
  productInfo: productInfoReducer,
});

export default rootReducer;
