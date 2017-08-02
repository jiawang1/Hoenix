import {
	PRODUCT_INFO_META,
	PRODUCT_INFO_QUERY_CITY,
	PRODUCT_INFO_QUERY_POINTOFSERVICE,
	GET_CATEGORY_ATTRIBUTE,
	SEARCH_PRODUCT_INFO,
	UPDATE_PRODUCT_DETAIL_PRICE,
	UPDATE_PRODUCT_DETAIL_INFO,
	PRODUCT_INFO_TEST_ACTION,
	PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH,
	PRODUCT_STOCK_DETAIL_INFO
} from './constants';

const initialState = {
	aData: [],
	productDetail: {}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case PRODUCT_INFO_TEST_ACTION:
			return {
				...state,
			};
		case PRODUCT_INFO_META:
			return {
				...state,
				productInfoMeta: action.meta
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

