import {
  DefaultPage,
} from './index';

import stockFreeze from '../stockFreeze/route';

export default {
  path: 'stockLevel',
  indexRoute: { component: DefaultPage },
  text:"库存管理",
  childRoutes: [
    { path: 'stockFreeze', text:"库存冻结", childRoutes:[
    	{ path: 'defaultPage', text:"创建库存冻结", component: DefaultPage},
    	stockFreeze,
    ] },
  ],
};
