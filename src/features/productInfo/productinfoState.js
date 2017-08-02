import * as service from './service.js';
import {put, takeEvery,select} from 'redux-saga/effects';


export const RETRIEVE_PAGE_META = 'productInfo/RETRIEVE_PAGE_META';
export const PRODUCT_INFO_META = 'productInfo/PRODUCT_INFO_META';
export const PRODUCT_INFO_QUERY_CITY = 'productInfo/PRODUCT_INFO_QUERY_CITY';
export const PRODUCT_INFO_QUERY_CITY_SAGA = 'productInfo/PRODUCT_INFO_QUERY_CITY_SAGA';

export const PRODUCT_INFO_QUERY_POINTOFSERVICE = 'productInfo/PRODUCT_INFO_QUERY_POINTOFSERVICE';
export const PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA = 'productInfo/PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA';

export const GET_CATEGORY_ATTRIBUTE = 'productInfo/GET_CATEGORY_ATTRIBUTE';
export const GET_CATEGORY_ATTRIBUTE_SAGA = 'productInfo/GET_CATEGORY_ATTRIBUTE_SAGA';
export const SEARCH_PRODUCT_INFO = 'productInfo/SEARCH_PRODUCT_INFO';
export const SEARCH_PRODUCT_INFO_SAGA = 'productInfo/SEARCH_PRODUCT_INFO_SAGA';
export const PRODUCT_INFO_TEST_ACTION = 'productInfo/PRODUCT_INFO_TEST_ACTION';
export const UPDATE_PRODUCT_DETAIL_INFO = 'productInfo/UPDATE_PRODUCT_DETAIL_INFO';
export const UPDATE_PRODUCT_DETAIL_INFO_SAGA = 'productInfo/UPDATE_PRODUCT_DETAIL_INFO_SAGA';
export const UPDATE_PRODUCT_DETAIL_PRICE= 'productInfo/UPDATE_PRODUCT_DETAIL_PRICE';
export const UPDATE_PRODUCT_DETAIL_PRICE_SAGA= 'productInfo/UPDATE_PRODUCT_DETAIL_PRICE_SAGA';
export const DYNAMIC_FORM_PREFIX= '-data-';
export const PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH = 'productInfo/PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH';
export const PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH_SAGA = 'productInfo/PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH_SAGA';
export const PRODUCT_STOCK_DETAIL_INFO = 'productInfo/PRODUCT_STOCK_DETAIL_INFO';
export const PRODUCT_STOCK_DETAIL_INFO_SAGA = 'productInfo/PRODUCT_STOCK_DETAIL_INFO_SAGA';


function *retrievePageMeta(){
	let data = yield service.retrievePageMeta();
	yield put({type:PRODUCT_INFO_META, data});
}

function *searchProductInfo(ops){
	let data = yield service.searchProductInfo(ops.data);
	yield put({type:SEARCH_PRODUCT_INFO, data});
	if(ops.cb){
		ops.cb(null,data);
	}
}

function * queryCategoryAttribute(ops){
	let data = yield service.queryCategoryAttribute(ops.data);
	yield put({type:GET_CATEGORY_ATTRIBUTE, attr: data});
}

function * queryCity(ops){
	let data = yield service.queryCity(ops.data);
	yield put({type:PRODUCT_INFO_QUERY_CITY, attr: data});
	
}

function * queryPointOfService(ops){
	let data = yield service.queryPointOfService(ops.data);
	yield put({type:PRODUCT_INFO_QUERY_POINTOFSERVICE, attr: data});
}

function * getProductDetail(ops){
	let data = yield service.getProductDetail(ops.data);
	yield put({type:UPDATE_PRODUCT_DETAIL_INFO,  data});
		if(ops.cb){
					ops.cb(null);
					return ;
				}	

};

function * retrieveProductDetailPriceList(option){

	let productInfo = select(state=>state.productInfo);
	console.log(productInfo)
	if (productInfo && productInfo.priceData && productInfo.priceData.results) {
		if (option.currentPage === productInfo.priceData.pagination.currentPage &&
			option.pageSize === productInfo.priceData.pagination.pageSize &&
			option.productCodes[0] === productInfo.priceData.results[0].code) {
				yield put({type:UPDATE_PRODUCT_DETAIL_PRICE, data:productInfo.priceData });

					console.log(productInfo.priceData)

			if(option.cb){

				option.cb(null, productInfo.priceData);
				return ;
			}	
		}
	}
	try{
		let _data = yield service.searchProductInfo(option.data);
		_data.pagination.currentPage = option.currentPage;
		_data.pagination.pageSize = option.pageSize;
		yield put({type:UPDATE_PRODUCT_DETAIL_PRICE, data:_data.priceData});
		if(option.cb){
			option.cb(null, _data.priceData);
			return ;
		}	
	}catch(err){
			
	}
}

function * retrieveProductDetailPublishList(option){

	let productInfo = select(state=>state.productInfo);

	if (productInfo && productInfo.publishData && productInfo.publishData.results) {
		if (option.currentPage === productInfo.publishData.pagination.currentPage &&
			option.pageSize === productInfo.publishData.pagination.pageSize &&
			option.productCodes[0] === productInfo.publishData.results[0].code) {
				yield put({type:PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH, data:productInfo.priceData });
				if(option.cb){
					option.cb(null);
					return ;
				}	
			}
	}

	let data = yield service.retrieveProductDetailPublishList(option.data);
	yield put({type:PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH, data});
	if(option.cb){
		option.cb(null);
		return ;
	}		
}

function * getProductStockList(option){
	let data = yield service.getProductDetail(option.data);
	yield put({type:PRODUCT_STOCK_DETAIL_INFO,  data});
	if(option.cb){
		option.cb(null);
		return ;
	}	
}

/**
 *  construct initial state. this should be immutable object
 */
const initialState = {

};


export default {
	
	watcher:{
		*watchPageMeta(){
			yield takeEvery(RETRIEVE_PAGE_META,retrievePageMeta);
		},
		*watchProductInfo(){
			yield takeEvery(SEARCH_PRODUCT_INFO_SAGA,searchProductInfo );	
		},
		*watchCategoryAttr(){
			yield takeEvery(GET_CATEGORY_ATTRIBUTE_SAGA,queryCategoryAttribute );
		},
		*watchqueryCity(){
			yield takeEvery(PRODUCT_INFO_QUERY_CITY_SAGA,queryCity);
		},
		*watchqueryPOS(){
			yield takeEvery(PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA,queryPointOfService);
		},
		*watchqueryProductDetail(){
			yield takeEvery(PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA,getProductDetail);
		},
		*watchRetrieveProductDetailPriceList(){
			yield takeEvery(UPDATE_PRODUCT_DETAIL_PRICE_SAGA,getProductDetail);
		},
		*watchPublishList(){
			yield takeEvery(PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH_SAGA,retrieveProductDetailPublishList);
		},
		*watchProductStockList(){
			yield takeEvery(PRODUCT_STOCK_DETAIL_INFO_SAGA,getProductStockList);

		}

	},
	reducer: (state = initialState, action)=>{
		switch (action.type) {
			case PRODUCT_INFO_TEST_ACTION:
				return {
					...state,
				};
			case PRODUCT_INFO_META:

				return {
					...state,
					productInfoMeta: action.data
				}
			case PRODUCT_INFO_QUERY_CITY:
				return {
					...state,
					cities: action.cities
				}
			case PRODUCT_INFO_QUERY_POINTOFSERVICE:
				return {
					...state,
					pointOfServices: action.pointOfServices
				}
			case GET_CATEGORY_ATTRIBUTE:
				return {
					...state,
					categoryAttribute: action.attr
				}

			case UPDATE_PRODUCT_DETAIL_INFO:
				return {
					...state,
					detail: action.data
				};

			case UPDATE_PRODUCT_DETAIL_PRICE:

				return {
					...state,
					priceData: action.data || {}

				};
			case PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH:
				let products = action.data;
				products.productList.forEach(p => p.isSaleable = (p.isSaleable ? "已组货" : "未组货"))
				return {
					...state,
					publishData: products || {}
				};
			case SEARCH_PRODUCT_INFO:
				if (action.data) {
					var aData = action.data;
					return {
						...state,
						aData: aData
					};
				} else {
					return state;
				}
			case PRODUCT_STOCK_DETAIL_INFO:
				return {
					...state,
					stockData: action.data
				}
			default:
				return state;
		}


	}

};


