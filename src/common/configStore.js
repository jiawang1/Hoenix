import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import sagaMap from './rootSaga';

let sagaMiddle = createSagaMiddleware();

const middlewares = [thunk, sagaMiddle];

if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    (typeof window !== 'undefined'&&window.devToolsExtension) ? window.devToolsExtension() : f => f
  ));

  // TODO:
  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextReducer = require('../reducers');
  //     store.replaceReducer(nextReducer);
  //   });
  // }
  sagaMap.map(saga => sagaMiddle.run(saga));
  return store;
}
