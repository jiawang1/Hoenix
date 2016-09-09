import {
  CategoryAttributePage,
  SamplePage,
} from './index';

import productInfo from '../productInfo/route';

export default {
  path: '',
  name: 'home',
  siteIndexRoute: { component: CategoryAttributePage },
  text: '商品管理',
  childRoutes: [
	     { path: 'categoryAttribute', component: CategoryAttributePage, text: "分类属性管理" },
		  productInfo,

  ],
};
