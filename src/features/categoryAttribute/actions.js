import 'whatwg-fetch';
import { getType } from './../../common/helper.js';
import { getJson, getContent, showError, getResponseThunk } from './../../common/commonAction.js';
import {
	DEMO_COUNT,
	RESET_COUNT,
	QUERY_ATTRIBUTE,
	GET_TABLE_META,
	ATTRIBUTE_PAGEMETA,
	CATEGORY_LOADED,
	CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION,
	RECEIEVE_ATTRIBUTE,
	RECEIVE_CATEGORY_ATTRIBUTE,
	UPDATE_CATEGORY
} from './constants';


export const queryAttribute = () => getResponseThunk(receiveAtributes, '/category/categoryAttribute');

export const queryCatetoryAttribute = () => getResponseThunk(receiveCategoryAtributes, '/category/categoryAttribute');

/*   thunk used to get attribute page meta, dispatch error message to global error if any exception  */
export const retrievePageMeta = () => (dispatch, getState) => {

	var { home } = getState();

	if (home.attributePageMeta) {

		dispatch(receivePageMeta(home.attributePageMeta));
	} else {
		return getJson({ url: '/category/categoryAttribute/pageMeta' }).then(json => {

			if (json.status === 'success') {
				dispatch(receivePageMeta(getPagemeta(getContent(json))));
			} else {
				dispatch(showError(json.map.__message__));
			}
		});
	}
};

export const receiveAtributes = (data) => {
	return {
		type: RECEIEVE_ATTRIBUTE,
		data: data
	};
};

export const receiveCategoryAtributes = (data) => {
	return {
		type: RECEIVE_CATEGORY_ATTRIBUTE,
		data: data
	};
};


/*  action creator for attribute page meta   */

export const receivePageMeta = meta => {
	return {
		type: ATTRIBUTE_PAGEMETA,
		meta: meta
	};
};

const getPagemeta = content => content.pageMeta;

const updateCategory = (json) => {
	return {
		type: UPDATE_CATEGORY,
		json: json
	};
};
const __fetchCategory = (id = null, dispatch, path) => getJson({ url: '/category/retrieveCategory', param: { 'code': id, 'path': path } }).then(json => {

	if (json.status === 'success') {
		dispatch(updateCategory(json));
	} else {
		dispatch(showError(json.map.__message__));
	}
	return json;
}).catch(error => console.error(error));

const __findCategory = (path, category) => {

	var aCodes = path.split('/');
	var isLoaded = true;

	aCodes.forEach((code) => {

		if (category[code]) {
			category = category[code];
		}
	});
	return Object.keys(category).some(key => { return getType(category[key]) === 'Object' });

};

export const retrieveCategory = (ops) => (dispatch, getState) => {

	var { home } = getState();

	if (home.category && ops) {
		var __category = Object.assign({}, home.category);

		if (!ops.path || !__findCategory(ops.path, __category)) {
			return __fetchCategory(ops.code, dispatch, ops.path);
		} else {
			return Promise.resolve({});
		}
	} else {
		let _id = ops === undefined ? null : ops.code;
		return __fetchCategory(_id, dispatch);
	}
};









