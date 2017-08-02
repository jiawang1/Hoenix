import { getJson, postJson, showError, getContent, generateGetThunk, generatePostThunk, createAction } from './../../common/commonAction.js';
import {
	PRODUCT_INFO_META,
	PRODUCT_INFO_QUERY_CITY,
	PRODUCT_INFO_QUERY_POINTOFSERVICE,
	SEARCH_PRODUCT_INFO,
	UPDATE_PRODUCT_DETAIL_PRICE,
	GET_CATEGORY_ATTRIBUTE,
	UPDATE_PRODUCT_DETAIL_INFO,
	PRODUCT_INFO_TEST_ACTION,
	PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH,
	PRODUCT_STOCK_DETAIL_INFO
} from './constants';

export function productInfoTestAction() {
	return {
		type: PRODUCT_INFO_TEST_ACTION,
	};
}

export const retrievePageMeta = () => (dispatch) => {
	return getJson({ url: 'fsproduct/productInfoMeta' }).then(json => {
		if (json.status === 'success') {
			dispatch(receivePageMeta(json.map.__content__));
		} else {
			dispatch(showError(json.map.__message__));
		}
	});
}

export const receivePageMeta = meta => {
	return {
		type: PRODUCT_INFO_META,
		meta: meta
	}
}

export const queryCity = (option) => (dispatch) => {
	return getJson({ param: option, url: 'productShelf/cities' }).then(json => {
		dispatch(receiveCity(getContent(json)));
	});
};
const receiveCity = cities => {
	return {
		type: PRODUCT_INFO_QUERY_CITY,
		cities: cities
	};
};

export const queryPointOfService = (option) => (dispatch) => {
	return getJson({ param: option, url: 'productShelf/pointOfServices' }).then(json => {
		dispatch(receivePointOfService(getContent(json)));
	});
};
const receivePointOfService = data => {
	return {
		type: PRODUCT_INFO_QUERY_POINTOFSERVICE,
		pointOfServices: data
	};
};

export const queryCategoryAttribute = (oCondition) => (dispatch) => {
	console.log(oCondition);
	return getJson({
		url: "/category/getCategoryAttributes",
		param: {
			categoryCode: oCondition
		}
	}).then(json => {
		dispatch(receiveCategoryAttribute(json.map.__content__));
	});
};

const receiveCategoryAttribute = (json) => {
	return {
		type: GET_CATEGORY_ATTRIBUTE,
		attr: json
	};
}

export const searchProductInfo = (option) => (dispatch, getState) => {

	return postJson({ url: 'fsproduct/searchProductInfo' }, option).then(
		json => {
			if (json.status === 'success') {
				dispatch(receiveProductInfo(getContent(json)));
			} else {
				dispatch(showError(json.map.__message__));
			}
		}
	);


};




const updateProductDetailPrice = (data) => { return { type: UPDATE_PRODUCT_DETAIL_PRICE, data: data }; };

export const retrieveProductDetailPriceList = (option) => (dispatch, getState) => {

	var {productInfo} = getState();

	if (productInfo && productInfo.priceData && productInfo.priceData.results) {
		if (option.currentPage === productInfo.priceData.pagination.currentPage &&
			option.pageSize === productInfo.priceData.pagination.pageSize &&
			option.productCodes[0] === productInfo.priceData.results[0].code) {
			return Promise.resolve(dispatch(updateProductDetailPrice(productInfo.priceData)));
		}
	}

	return postJson({ url: 'fsproduct/searchProductInfo' }, option).then(
		json => {
			if (json.status === 'success') {
				var _data = getContent(json);
				_data.pagination.currentPage = option.currentPage;
				_data.pagination.pageSize = option.pageSize;
				dispatch(updateProductDetailPrice(_data));
			} else {
				dispatch(showError(json.map.__message__));
			}
		}
	);
};


export const retrieveProductDetailPublishList = (conditions) => (dispatch, getState) => {
	var {productInfo} = getState();
	if (productInfo && productInfo.publishData && productInfo.publishData.results) {
		if (option.currentPage === productInfo.publishData.pagination.currentPage &&
			option.pageSize === productInfo.publishData.pagination.pageSize &&
			option.productCodes[0] === productInfo.publishData.results[0].code) {
			return Promise.resolve(dispatch(searchProductPublishAction(productInfo.publishData)));
		}
	}

	return postJson({
		url: "/publishinfo/search"
	}, conditions).then(data => {
		if (data.status === "success") {
			return dispatch(searchProductPublishAction(getContent(data)));
		} else {
			messageBox.error({ message: data.map.__message__ });
		}
	}).catch(err => console.error(err));
};




const receiveProductInfo = (data) => {
	return {
		type: SEARCH_PRODUCT_INFO,
		data: data
	};
}

export function searchProductPublishAction(data) {
	return {
		type: PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH,
		data: data
	};
}

export const getProductDetail = generateGetThunk(createAction(UPDATE_PRODUCT_DETAIL_INFO), '/fsproduct/productInfoDetail');

export const getProductStockList = generateGetThunk(createAction(PRODUCT_STOCK_DETAIL_INFO), '/fsproduct/searchProductStockList');
