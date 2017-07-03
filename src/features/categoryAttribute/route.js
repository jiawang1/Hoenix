import {
  SamplePage,
  CategoryAttributeEditPage,
} from './index';

import {asyncLoad} from '../../common/helper.js';

export default {
  path: '',
  name: 'home',
  icon: 'appstore-o',
  siteIndexRoute: {  getComponent(nextState, cb){
			require.ensure([], (require) => {
				cb(null, require('./CategoryAttributePage').default)
			}, 'CategoryAttribute')
		}
 },
  text: '商品管理',
  childRoutes: [
	   { path: 'categoryAttribute',  getComponent(nextState, cb){
			require.ensure([], (require) => {
				cb(null, require('./CategoryAttributePage').default)
			}, 'CategoryAttribute')
		}
, text: "分类属性管理" },
		 { path: 'categoryAttributeEdit', component: CategoryAttributeEditPage, text:'编辑分类属性', isSubPage:true },
  ],
};
