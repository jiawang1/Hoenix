import {
	QUERY_ATTRIBUTE,
	ATTRIBUTE_PAGEMETA,
	GET_CLASSIFICATION,
	UPDATE_CURRENT_CLASSIFICATION,
	UNLINK_CLASSIFICATION,
	UNLINK_ATTEIBUTE,
	REFRESH_CLASSIFICATION,
	CLEANUP_CLASSIFICATION,
	CLEANUP_CLASSIFICATION_RESULT,
	BIND_CLASSIFICATION,
	CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION,
	RECEIEVE_ATTRIBUTE,
	RECEIVE_CATEGORY_ATTRIBUTE,
	CLEANUP_CATEGORY_ATTRIBUTE,
	BIND_CATEGORY_ATTRIBUTE,
	DELETE_ATTEIBUTE,
	UPDATE_CATEGORY
} from './constants';

import { formatDate } from '../../common/helper.js';
import { formatDateTime } from '../../common/helper.js';

const initialState = {
	count: 0,
	record: {},
	title: '',
	visible: false,
	aData: [],
	pagedAData: {},
	pagedCategoryAttrData: {}

};

export default function reducer(state = initialState, action) {

	switch (action.type) {
		case QUERY_ATTRIBUTE:
			return {
				...state,
				aData: action.aData,

			};
		case RECEIEVE_ATTRIBUTE:
			if (action.data && action.data.results) {
				var aData = action.data.results.map(transformAttribute);
				return {
					...state,
					aData: aData,
					pagedAData: { pagination: action.data.pagination, aData: aData }
				};
			} else {
				return state;
			}
		case ATTRIBUTE_PAGEMETA:
			return {
				...state,
				attributePageMeta: action.meta

			};

		case CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION:
			return {
				...state,
			};

		case GET_CLASSIFICATION:

			var aTreeData = action.data.data.slice();
			aTreeData.map(treeData => {

				treeData.cType = "C";
				treeData.features ? treeData.features.map(attr => {
					attr.cType = "A";
					attr.parentKey = treeData.code;
				}) : (treeData.features = []);
			});

			return {
				...state,
				treeData: aTreeData,
				current: action.current
			};

		case UPDATE_CURRENT_CLASSIFICATION:

			var aTreeData = state.treeData;
			var current = {};

			aTreeData.some(treeData => {

				if (action.target.cType === "C") {
					if (treeData.code === action.target.keys[0]) {
						current = treeData;
						return true;
					}
				} else {
					return treeData.features.some(attr => {
						if (attr.code === action.target.keys[0] && attr.parentKey === action.target.parentKey) {
							current = attr;
							return true;
						}
					});
				}
			});
			return {
				...state,
				current: current
			};

		case UNLINK_CLASSIFICATION:

			var aTreeData = state.treeData.slice();
			aTreeData.splice(aTreeData.findIndex(data => { return data.code === action.target.code }), 1);

			return {
				...state,
				treeData: aTreeData,
				current: aTreeData[0]
			};

		case UNLINK_ATTEIBUTE:
			var aTreeData = state.treeData.slice();
			var oCurrent = {};

			aTreeData.some(treeData => {

				if (treeData.code === action.data.parentKey) {
					let inx = treeData.features.findIndex(attr => { return attr.code === action.data.code });
					if (inx >= 0) {
						treeData.features.splice(inx, 1);
						oCurrent = treeData;
						return true;
					}
				}
			});

			return {
				...state,
				treeData: aTreeData,
				current: oCurrent
			};
		case CLEANUP_CLASSIFICATION:

			var nState = Object.assign({}, state);
			nState.treeData = null;
			nState.current = null;
			return nState;

		case REFRESH_CLASSIFICATION:

			var oClass = Object.assign({}, action.data.map.__content__);

			oClass.results.map(transformClaz);

			return {
				...state,
				classificationResult: oClass

			};

		case CLEANUP_CLASSIFICATION_RESULT:

			let oState = {
				...state
			};

			oState.classificationResult = null;

			return oState;


		case BIND_CLASSIFICATION:

			var aClaz = action.oClaz.data.slice();
			aClaz.map(oClassify => {

				oClassify.creationTime = formatDate(oClassify.creationTime);
				oClassify.key = oClassify.code;
				oClassify.cType = "C";
				oClassify.features && oClassify.features.map(attr => {
					attr.cType = "A";
					attr.parentKey = oClassify.code;
				});
			});

			var aTreeData = state.treeData.slice();
			aTreeData = [...aTreeData, ...aClaz];

			return {
				...state,
				treeData: aTreeData
			};

		case RECEIVE_CATEGORY_ATTRIBUTE:
			if (action.data) {

				var aData = action.data.results.map(transformAttribute);

				return {
					...state,
					categoryAttrData: aData,
					pagedCategoryAttrData: { pagination: action.data.pagination, aData: aData }
				};

			} else {
				return state;
			}

		case CLEANUP_CATEGORY_ATTRIBUTE:
			let newState = {
				...state,
				categoryAttrData: null
			};
			return newState;

		case BIND_CATEGORY_ATTRIBUTE:
			var newTreeData = action.data.data.slice();

			newTreeData.map(treeData => {

				treeData.cType = "C";
				treeData.features.map(attr => {
					attr.cType = "A";
					attr.parentKey = treeData.code;
				});
			});

			return {
				...state,
				treeData: newTreeData
			};

		case DELETE_ATTEIBUTE:

			let attributeCode = action.data;
			let { pagedAData } = state;
			let attributeList = pagedAData.aData.filter(attr => attr.code != attributeCode);
			let newPageAData = { ...pagedAData, aData: attributeList };

			return {
				...state,
				pagedAData: newPageAData
			};

		case UPDATE_CATEGORY:

			var oCategory = {}, oCurrent = {};

			var aCatagroryData = JSON.parse(action.json.map.__content__);

			if (aCatagroryData.length === 0) {

				return state;
			}

			if (state.category) {
				oCurrent = oCategory = Object.assign({}, state.category);
				var _item = aCatagroryData[0];
				var _aPath = _item.categoryPath.split('/').slice(0, -1);
				_aPath.forEach(code => oCurrent = oCurrent[code]);
				aCatagroryData.forEach(category => {
					oCurrent[category.code] = category;

				});

			} else {

				/*  init root category*/
				oCategory = {
					code: 'root',
					name: '工业分类',
					isLeafCategory: false,
					categoryPath: 'root'
				};

				aCatagroryData.forEach(_cat => { oCategory[_cat.code] = _cat; });
			}

			return {
				...state,
				category: oCategory
			};



		default:
			return state;
	}
}

const transformClaz = (oCLaz) => {
	oCLaz.creationTime = oCLaz.creationTime ? formatDate(oCLaz.creationTime) : "";
	oCLaz.key = oCLaz.code;
	oCLaz.channel = oCLaz.channel ? oCLaz.channel.name : "";
	oCLaz.cType = "C";
};

const transformAttribute = (data) => {

	var attributeGroup = data.classification ? Object.keys(data.classification).map(key => data.classification[key]).join(",") : '';

	return {
		channel: data.channel ? data.channel.name : '',
		attributeGroup: attributeGroup,
		code: data.code,
		key: data.code,
		salesFlag: data.salesFlag ? '是' : '否',
		name: data.name,
		type: data.type,
		isScsFlag: data.isScsFlag,
		emptyAllowed: data.emptyAllowed ? '是' : '否',
		creationTime: formatDateTime(data.creationTime),
		status: data.status.code
	};
}
