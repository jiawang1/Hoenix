import {
  DefaultPage,
} from './index';

export default {
  path: 'stockLevel',
  indexRoute: { component: DefaultPage },
  text:"库存管理",
  childRoutes: [
    { path: 'stockFreeze', text:"库存冻结", childRoutes:[{
    	path: 'defaultPage', text:"库存查看处理", component: DefaultPage}

    ] },
  ],
};
