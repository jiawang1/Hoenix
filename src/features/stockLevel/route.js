import {
  DefaultPage,
} from './index';

export default {
 // path: 'stockLevel',
// indexRoute: { component: DefaultPage },
  text:"库存管理",
  name:'stockLevel',
  childRoutes: [
    { text:"库存冻结", name:"stockFreeze",
	  childRoutes:[{
    	path: 'viewStock', text:"库存查看处理", component: DefaultPage}
    ]},
  ],
};
