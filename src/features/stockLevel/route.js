import {
  DefaultPage,
} from './index';

import stockFreeze from '../stockFreeze/route';

export default {
 // path: 'stockLevel',
// indexRoute: { component: DefaultPage },
  text:"库存管理",
  name:'stockLevel',
  childRoutes: [
    { text:"库存冻结", name:"stockFreeze",
	  childRoutes:[{
    	path: 'viewStock', text:"创建库存冻结", component: DefaultPage}
    ]},
  ],
};
