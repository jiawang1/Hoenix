import {
  CategoryAttributePage,
  SamplePage,
  CategoryAttributeEditPage,
} from './index';
// import {
//   ProductDetailPage
// } from '../productInfo/index';

// import {
//   ProductDetailEditPage
// } from '../displayProduct/index';

// import classificationList from '../classificationList/route';
// import attributeList from '../attributeList/route';
// import productInfo from '../productInfo/route';
// import productPricePlan from '../productPricePlan/route';
// import productPrice from '../productPrice/route';
// import priceSetting from '../priceSetting/route';
// import productPriceCheck from '../productPriceCheck/route';
// import productShelf from '../productShelf/route';
// import productPublish from '../productPublish/route';
// //import spuSetting from '../spuSetting/route';
// import displayCategory from '../displayCategory/route';
// import operatorProduct from '../operatorProduct/route';
// import displayProduct from '../displayProduct/route';
// import productPriceChange from '../productPriceChange/route';
// import productPackage from '../productPackage/route';

export default {
  path: '',
  name: 'home',
  icon: 'appstore-o',
  siteIndexRoute: { component: CategoryAttributePage },
  text: '商品管理',
  childRoutes: [
	   { path: 'categoryAttribute', component: CategoryAttributePage, text: "分类属性管理" },
		 { path: 'categoryAttributeEdit', component: CategoryAttributeEditPage, text:'编辑分类属性', isSubPage:true },
    //  classificationList,
    //  attributeList,
    //  productInfo,
    //  { path: 'productDetail', component: ProductDetailPage, text:'商品详情', isSubPage:true},
    //  //spuSetting,
    //  productPackage,
    //  productPrice, 
    //  priceSetting,   
    //  //productPriceCheck,
    //  //productPricePlan,
    //  productPublish,
    //  productPriceChange,
    //  displayCategory,
    //  displayProduct,
    //  { path: 'productDetailEdit', component: ProductDetailEditPage, text:'编辑商品详情', isSubPage:true},
    //  productShelf,
    //  operatorProduct,
  ],
};
