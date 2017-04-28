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
import { getType, createAction } from './../common/helper.js';
import { getJson, postJson, showError, getContent, removeError, createAction as createAction2, generateGetThunk, generatePostThunk } from './../common/commonAction.js';

export { removeError };

export const queryCategory = (oCondition) => (dispatch) => {
	return getJson({
		url: "/category/searchProductCategory",
		param: {
			...oCondition
		}
	}).then(json => {
		if (json.status === 'success') {
			dispatch(receiveCategory(getContent(json)));
		}
	});
};

export const cleanupCategory = () => {
	return {
		type: CLEANUP_POPUP_CATEGORY
	};
}

export const queryProductBrand = (oCondition) => (dispatch) => {

	return postJson({ url: "/brand/searchProductBrand"}, oCondition).then(json => {
		if (json.status === 'success') {
			dispatch(updateProductBrand(getContent(json)));
		}
	});
};

export const cleanupBrand = () => {
	return {
		type: CLEANUP_PRODUCT_BRAND
	};
};

const updateProductBrand = (json) => {
	return {
		type: UPDATE_PRODUCT_BRAND,
		data: json
	};
}

export const querySupplier = (oCondition) => (dispatch) => {

	return getJson({ url: "/findSupplierList", param: oCondition }).then(json => {
		dispatch(updateSupplier(json))

	});
};
export const cleanupSupplier = () => {
	return {
		type: CLEANUP_SUPPLIER
	};
}

const updateSupplier = (oData) => {
	return {
		type: UPDATE_SUPPLIER,
		oData: oData
	};
}

const receiveCategory = (json) => { return { type: RECEIVE_CATEGORY, data: json }; };


export const searchProductForStock = (currentPage, pageSize, conditions) => (dispatch) => {

	return postJson({
		url: "/fsproduct/findFSProductListForStock",
		param: { currentPage: currentPage, pageSize: pageSize }
	}, conditions).then(json => {
		if (json.status === 'success') {
			dispatch(searchProductForStockAction(getContent(json)));
		} else {

		}
	}).catch(err => console.error(err));

}

const searchProductForStockAction = (data) => {
	return {
		type: SEARCH_PRODUCT_LIST_FOR_STOCK,
		products: data
	}
}

export const cleanupProductForStock = () => {
	return {
		type: CLEANUP_PRODUCT_FOR_STOCK
	}
}

export const getProductDialogMeta = () => (dispatch) => {

	return getJson({
		url: "/fsproduct/commonProductPage/pageMeta"
	}).then(json => {
		dispatch(getProductDialogMetaAction(getContent(json)));
	}).catch(err => console.error(err));

}

const getProductDialogMetaAction = (data) => {
	return {
		type: PRODUCT_DIALOG_META,
		meta: data
	}
}


export const searchProductList = (oCondition, params) => (dispatch) => {

	return postJson({
		url: "/fsproduct/findFSProductListByConditions",
		param: { ...params }
	}, oCondition).then(json => {
		dispatch(searchProductListAction(json));
	}).catch(err => console.error(err));

}

const searchProductListAction = (data) => {
	return {
		type: SEARCH_PRODUCT_LIST,
		products: data
	}
}

export const cleanupProductList = () => {
	return {
		type: CLEANUP_PRODUCT_LIST
	}
}

export const searchWarehouse = (params) => (dispatch) => {
	return postJson({
		url: "/warehouse/searchWarehouses"
	}, params).then(json => {
		if (json.status === "success") {
			dispatch(createAction(SEARCH_WAREHOUSE, getContent(json)));
		}
	}).catch(err => console.error(err));
}

export const cleanupWarehouse = () => {
	return createAction(SEARCH_WAREHOUSE, {});
}

export const searchEmployee = (params) => (dispatch) => {
	return postJson({
		url: "/fsEmployee/searchEmployeeListPage"
	}, params).then(json => {
		if (json.status === "success") {
			dispatch(createAction(SEARCH_EMPLOYEE, getContent(json)));
		}
	}).catch(err => console.error(err));
}

export const cleanupEmployee = () => {
	return createAction(SEARCH_EMPLOYEE, null);
}

export const searchDisplayCategory = (oCondition) => (dispatch) => {
	return getJson({
		url: "/category/searchDisplayCategory",
		param: {
			...oCondition
		}
	}).then(json => {
		if (json.status === 'success') {
			dispatch(createAction(SEARCH_DISPLAY_CATEGORY, getContent(json)));
		}
	});
};

export const cleanupDisplayCategory = () => {
	return createAction(SEARCH_DISPLAY_CATEGORY, null);
}



export const searchPointOfService = (params) => (dispatch) => {
	return postJson({
		url: "/fsPointOfService/searchPointOfServiceListPage"
	}, params).then(json => {
		if (json.status === "success") {
			dispatch(createAction(SEARCH_POINT_OF_SERVICE, getContent(json)));
		}
	}).catch(err => console.error(err));
}

export const cleanupPointOfService = () => {
	return createAction(SEARCH_POINT_OF_SERVICE, null);
}


export const queryCity = generateGetThunk('/region/getCities');
export const queryPOS = generateGetThunk('/region/getPointOfServices');

export const createConditionCoupon = generatePostThunk('/promotionManage/saveAddVoucherOrderFullRule');


export const searchMember = generatePostThunk(createAction2(SEARCH_MEMBER_FOR_DIALOG), '/fsMember/searchValidFsMemberList');
export const cleanupMember = () => {
	return createAction(SEARCH_MEMBER_FOR_DIALOG, null);
}

export const searchProductExList = generatePostThunk(createAction2(SEARCH_EXCLUDE_PRODUCT_LIST),'/fsproduct/findFSProductByCeilingPrice');
export const cleanupProductExList = () => {
	return createAction(SEARCH_EXCLUDE_PRODUCT_LIST, null);
}
export const searchProductForGift = generatePostThunk(createAction2(SEARCH_PRODUCT_LIST_FOR_GIFT), '/fsproduct/findFSProductForGift');
export const cleanupProductForGift = () => {
	return createAction(SEARCH_PRODUCT_LIST_FOR_GIFT, null);
}

export const searchProductForLimitPrice = (oCondition, params) => (dispatch) => {

	return postJson({
		url: "/fsproduct/findFSProductListByConditionsWithPromotionScope",
		param: { ...params }
	}, oCondition).then(json => {
		dispatch(searchProductForLimitPriceAction(getContent(json)));
	}).catch(err => console.error(err));

}

const searchProductForLimitPriceAction = (data) => {
	return {
		type: SEARCH_PRODUCT_LIST_FOR_LIMIT_PRICE,
		data
	}
}

export const cleanupProductForLimitPrice = () => {
	return {
		type: SEARCH_PRODUCT_LIST_FOR_LIMIT_PRICE
	}
}
