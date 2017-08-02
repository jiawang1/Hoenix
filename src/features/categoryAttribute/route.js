import {
	SamplePage,
	CategoryAttributeEditPage,
} from './index';
import productInfo from '../productInfo/route';
import {asyncLoad} from '../../common/helper.js';
import {ProductDetailPage} from '../productInfo/index';

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
	productInfo,
	{path:'productDetail',component: ProductDetailPage, text:'商品详情',isSubPage:true}
	],
};
