import {
	RECEIVE_CATEGORY,
	UPDATE_PRODUCT_BRAND,
	CLEANUP_PRODUCT_BRAND,
	UPDATE_SUPPLIER,
	CLEANUP_SUPPLIER,
	CLEANUP_POPUP_CATEGORY,
	SEARCH_PRODUCT_LIST_FOR_STOCK,
	CLEANUP_PRODUCT_FOR_STOCK,
	PRODUCT_DIALOG_META,
	SEARCH_PRODUCT_LIST,
	CACHE_FORM_INFO,
	UPDATE_CURRENT_USER_INFO,
	CLEANUP_PRODUCT_LIST,
	SEARCH_WAREHOUSE,
	SEARCH_EMPLOYEE,
	SEARCH_DISPLAY_CATEGORY,
	SEARCH_POINT_OF_SERVICE,
	SEARCH_MEMBER_FOR_DIALOG,
	SEARCH_EXCLUDE_PRODUCT_LIST,
	SEARCH_PRODUCT_LIST_FOR_GIFT,
	SEARCH_PRODUCT_LIST_FOR_LIMIT_PRICE

} from './constants';
import { addKeyToResults } from './../common/helper.js';


export default function reducer(state = {}, action) {

	switch (action.type) {

		case RECEIVE_CATEGORY:
			return {
				...state,
				categoryList: dealwithPopupData(action.data)
			};

		case CLEANUP_POPUP_CATEGORY:
			return {
				...state,
				categoryList: null
			};

		case UPDATE_PRODUCT_BRAND:

			return {
				...state,
				oBrand: dealwithPopupData(action.data)
			};

		case CLEANUP_PRODUCT_BRAND:
			return {
				...state,
				oBrand: null
			};

		case UPDATE_SUPPLIER:

			let __o = Object.assign({}, action.oData);

			__o.data = __o.data?__o.data.map(aData => {
				return {
					key: aData[1],
					code: aData[1],
					name: aData[2]
				};
			}):[];

			return {
				...state,
				oSupplier: __o
			};
		case CLEANUP_SUPPLIER:
			return {
				...state,
				oSupplier: null
			};

		case SEARCH_PRODUCT_LIST_FOR_STOCK:
			action.products.products.forEach(p => p.key = p.code);
			return {
				...state,
				pagedProducts: action.products
			};

		case CLEANUP_PRODUCT_FOR_STOCK:
			return {
				...state,
				pagedProducts: null
			}

		case PRODUCT_DIALOG_META:
			return {
				...state,
				meta: action.meta
			}

		case SEARCH_PRODUCT_LIST:
			let searchResult = {};
			let products = [];
			if ( action.products && action.products.data) {
				products = action.products.data.map(transformProduct);
			}
			let totalNumberOfResults = 0;
			action.products && (totalNumberOfResults = action.products.recordsTotal);
			
			return {
				...state,
				productResult: {
					products: products,
					totalNumberOfResults: totalNumberOfResults
				}
			}
		case CLEANUP_PRODUCT_LIST:
			return {
				...state,
				productResult: null
			}

		case SEARCH_WAREHOUSE:
			let {results = []} = action.data;
			results.map(w => w.key = w.code);
			let total = action.data.pagination ? action.data.pagination.totalNumberOfResults : 0;
			return {
				...state,
				pagedWarehouses: {
					warehouses: results,
					totalNumberOfResults: total
				}
			}

		case SEARCH_EMPLOYEE:
			return {
				...state,
				pagedEmployees: addKeyToResults(action.data, 'results', 'uid')
			}

		case CACHE_FORM_INFO:
			var _state = {
				...state
			};
			_state[action.name] = action.info;
			return _state;
		case SEARCH_DISPLAY_CATEGORY:
			return {
				...state,
				displayCategoryList: action.data ? dealwithPopupData(action.data) : null
			}
		case SEARCH_POINT_OF_SERVICE:
			return {
				...state,
				pagedPointOfServices: addKeyToResults(action.data, 'results', 'name')
			}
		case SEARCH_MEMBER_FOR_DIALOG:
			return {
				...state,
				pagedMembers: addKeyToResults(action.data, 'customerList', 'uid')
			}
		case SEARCH_EXCLUDE_PRODUCT_LIST:
			return {
				...state,
				pagedExProduct: addKeyToResults(action.data, 'products', 'code')
			}
		case SEARCH_PRODUCT_LIST_FOR_GIFT:
			return {
				...state,
				pagedProductForGift: addKeyToResults(action.data, 'products', 'code')
			}
		case SEARCH_PRODUCT_LIST_FOR_LIMIT_PRICE:
			return {
				...state,
				pagedProductForLimitPrice: addKeyToResults(action.data, 'products', 'code')
			}

		default:
			return state;
	}
}

const dealwithPopupData = (data) => {
	let __o = Object.assign({}, data);
	if (data.results) {
		__o.results.map(data => data.key = data.code);
	}
	return __o;
};

const transformProduct = (data) => {
	let attrs = ['PK', 'code', 'name', 'lifeCycle', 'manufacturerAID', 'isDummy', 'sellerName', 'createTimeStr', 'brandName', 'categoryName']; // 'productAttribute',
	let p = {};
	data.forEach((value, index) => {
		p[attrs[index]] = value;
	})

	p.key = p.code;

	return p;
}
