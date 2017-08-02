import { generatePostThunk, generateGetThunk, createAction,getJson, getContent, postJson } from '../../common/commonAction';
import { formatDateTime,formatDate,getType } from '../../common/helper.js';


const QUERY_ATTRIBUTE = 'categoryAttribute/QUERY_ATTRIBUTE',
	GET_TABLE_META='categoryAttribute/GET_TABLE_META',
	ATTRIBUTE_PAGEMETA='categoryAttribute/ATTRIBUTE_PAGEMETA',
	CATEGORY_LOADED='categoryAttribute/CATEGORY_LOADED',
	CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION='categoryAttribute/CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION',
	RECEIEVE_ATTRIBUTE='categoryAttribute/RECEIEVE_ATTRIBUTE',
	RECEIVE_CATEGORY_ATTRIBUTE='categoryAttribute/RECEIVE_CATEGORY_ATTRIBUTE',
	UPDATE_CATEGORY='categoryAttribute/UPDATE_CATEGORY',
	GET_CLASSIFICATION='categoryAttribute/GET_CLASSIFICATION',
	UPDATE_CURRENT_CLASSIFICATION='categoryAttribute/UPDATE_CURRENT_CLASSIFICATION',
	UNLINK_CLASSIFICATION='categoryAttribute/UNLINK_CLASSIFICATION',
	UNLINK_ATTEIBUTE='categoryAttribute/UNLINK_ATTEIBUTE',
	REFRESH_CLASSIFICATION='categoryAttribute/REFRESH_CLASSIFICATION',
	CLEANUP_CLASSIFICATION='categoryAttribute/CLEANUP_CLASSIFICATION',
	CLEANUP_CLASSIFICATION_RESULT='categoryAttribute/CLEANUP_CLASSIFICATION_RESULT',	
	BIND_CLASSIFICATION='categoryAttribute/BIND_CLASSIFICATION',
	CLEANUP_CATEGORY_ATTRIBUTE='categoryAttribute/CLEANUP_CATEGORY_ATTRIBUTE',
	BIND_CATEGORY_ATTRIBUTE='categoryAttribute/BIND_CATEGORY_ATTRIBUTE',
	DELETE_ATTEIBUTE='categoryAttribute/DELETE_ATTEIBUTE';
	// actions
 const receivePageMeta = meta => {
	return {
		type: ATTRIBUTE_PAGEMETA,
		meta: meta
	};
};
const getPagemeta = content => content.pageMeta;
const queryAttribute = generateGetThunk(createAction(RECEIEVE_ATTRIBUTE), '/category/categoryAttribute');
const queryCatetoryAttribute = generateGetThunk(createAction(RECEIVE_CATEGORY_ATTRIBUTE), '/category/categoryAttribute');
const retrievePageMeta = () => (dispatch, getState) => {
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

const retrieveCategory = (ops) => (dispatch, getState) => {
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

const updateClassification = (data, current)=>{
	return {
		type: GET_CLASSIFICATION,
		data: data,
		current: current
	};
};
const getCategoryClassification = (categoryCode, currentAttribute)=>(dispatch, getState)=>{
	
	var {home} = getState();
	return getJson({url: '/category/categoryClassification', param:{"categoryCode":categoryCode}}).then(json=>{
		var current = {};
		json.data.some(clas=>{
			return clas.features?clas.features.some(attr=>{
				if(attr.code ===currentAttribute ){
					current = attr;
					return true;
				}
			}):false;
		});
		dispatch(updateClassification(json, current));
	})
};

 const updateCurrentClassification = (oTarget)=>{
	return {
		type: UPDATE_CURRENT_CLASSIFICATION,
		target: oTarget
	};
};

const unlinkClassAction = (oCurrent)=>{
	return {
		type:UNLINK_CLASSIFICATION,
		target: oCurrent
	};

};

const unlinkClassification = (oCurrent, cCode)=>(dispatch)=>{
	if(oCurrent.cType==="C"){
		return postJson({url:"/category/unlinkClassification" ,param:{classificationCode:oCurrent.code,categoryCode:cCode}})
		.then(data=>{
			if(data.status === "success"){
				dispatch(unlinkClassAction(oCurrent));	
			}		
		}).catch(err=>{});

	}else{
		return postJson({url:"/category/unlinkAttribute", param:{"classificationCode":oCurrent.parentKey,"attributeCode":oCurrent.code}})
		.then(data=>{
			if(data.status === "success"){
				dispatch(unlinkAttributeAction(oCurrent));	
			}
		}).catch(err=>{});
	}
};

 const cleanupClassification = ()=>{
	return {
		type : CLEANUP_CLASSIFICATION
	};
};

const refreshClassification = (data)=>{

	return {
		type:REFRESH_CLASSIFICATION,
		data: data
	};
};

const queryClassification = (oCondition) =>(dispatch)=>{

	return getJson({url:"/category/queryClassification",param:oCondition}).then(json=>{
		dispatch(refreshClassification(json));	
	});
};

const bindClazAction = (categoryCode, oClaz)=>{
	return {
		type: BIND_CLASSIFICATION,
		categoryCode: categoryCode,
		oClaz: oClaz
	};
};
const bindClassification = (categoryCode, aClaz)=>(dispatch)=>{	

	return postJson({url:"/category/mapC2C"},{categoryCode:categoryCode,classificationCodes:aClaz.map(oClaz=>oClaz.code).join(',') }).then(json=>{
			dispatch(bindClazAction(categoryCode, json ));
	});
	
};

const cleanUpCategoryAtributes = ()=>{
	return {
		type: CLEANUP_CATEGORY_ATTRIBUTE
	};
};

 const bindCategoryAtributes = (categoryCode, classifications, attributes, data)=>{
	return {
		type: BIND_CATEGORY_ATTRIBUTE,
		categoryCode: categoryCode,
		classifications: classifications,
		attributes: attributes,
		data: data
	};
 };
  const bindCategoryAttribute = (categoryCode, classifications, attributes) => (dispatch) => {

	return postJson({ url: "/category/mapC2A" }, {
		categoryCode: categoryCode,
		classificationCodes: classifications.join(','),
		attributesCodes: attributes.map(attr => attr.code).join(',')
	}).then(json => {
		dispatch(bindCategoryAtributes(categoryCode, classifications, attributes, json));
	});

};

 const deleteAttributeAction = (code) => {
	return {
		type: DELETE_ATTEIBUTE,
		data: code 
	}
}
const deleteAttribute = (aCode)=>(dispatch)=>{
	
	return postJson({url:"/category/deleteAttribute", param:{ 'code': aCode }})
	.then(data=>{
		if(data.status === "success"){
			dispatch(deleteAttributeAction(aCode));	
		}else{
			messageBox.error({message: `删除属性 $aCode 失败`});
		}
	}).catch(err=>{});

};



export const  actions={
	queryAttribute,
	queryCatetoryAttribute,
	retrievePageMeta,
	retrieveCategory,
	getCategoryClassification,
	updateCurrentClassification,
	unlinkClassification,
	cleanupClassification,
	queryClassification,
	bindClassification,
	cleanUpCategoryAtributes,
	bindCategoryAtributes,
	bindCategoryAttribute,
	deleteAttribute
};

/**
 *  construct initial state. this should be immutable object
*/
const initialState = {
	count: 0,
	record: {},
	title: '',
	visible: false,
	aData: [],
	pagedAData: {},
	pagedCategoryAttrData: {}

};

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

/**
 * redux reducers
 */

export default function reducer(state = initialState, action){
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
