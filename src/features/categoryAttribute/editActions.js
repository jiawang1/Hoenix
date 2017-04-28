import 'whatwg-fetch';
import {getType} from './../../common/helper.js';
import {getJson, postJson, showError, getResponseThunk} from './../../common/commonAction.js';
import {
  GET_CLASSIFICATION,
  UPDATE_CURRENT_CLASSIFICATION,
  UNLINK_CLASSIFICATION,
  UNLINK_ATTEIBUTE,
  SHOW_CURRENT_CLASSIFICATION,
  CLEANUP_CLASSIFICATION,
  QUERY_CLASSIFICATION,
  REFRESH_CLASSIFICATION,
  CLEANUP_CLASSIFICATION_RESULT,
  BIND_CLASSIFICATION,
  CATEGORY_ATTRIBUTE_EDIT_TEST_ACTION,
  RECEIVE_CATEGORY_ATTRIBUTE,
  CLEANUP_CATEGORY_ATTRIBUTE,
  BIND_CATEGORY_ATTRIBUTE,
  DELETE_ATTEIBUTE

} from './constants';



export const getCategoryClassification = (categoryCode, currentAttribute)=>(dispatch, getState)=>{
	
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


export const updateClassification = (data, current)=>{
	return {
		type: GET_CLASSIFICATION,
		data: data,
		current: current
	};
};

export const updateCurrentClassification = (oTarget)=>{
	return {
		type: UPDATE_CURRENT_CLASSIFICATION,
		target: oTarget
	};
};

export const unlinkClassification = (oCurrent, cCode)=>(dispatch)=>{
	if(oCurrent.cType==="C"){
		return postJson({url:"/category/unlinkClassification" ,param:{classificationCode:oCurrent.code,categoryCode:cCode}})
		.then(data=>{
			if(data.status === "success"){
				dispatch(unlinkClassAction(oCurrent));	
			}else{

			}
		}).catch(err=>{});

	}else{
		return postJson({url:"/category/unlinkAttribute", param:{"classificationCode":oCurrent.parentKey,"attributeCode":oCurrent.code}})
		.then(data=>{
			if(data.status === "success"){
				dispatch(unlinkAttributeAction(oCurrent));	
			}else{

			}
		}).catch(err=>{});
	}


};

/*  used to clean up tree data and curent node info in store*/
export const cleanupClassification = ()=>{

	return {
		type : CLEANUP_CLASSIFICATION
	};
};


//export const queryClassification = (oCondition) => getResponseThunk(refreshClassification, '/category/queryClassification');

export const queryClassification = (oCondition) =>(dispatch)=>{

	return getJson({url:"/category/queryClassification",param:oCondition}).then(json=>{
		dispatch(refreshClassification(json));	
	});
};

export const cleanUpClassificationResult = ()=>{

	return {
		type: CLEANUP_CLASSIFICATION_RESULT
	};
}

const refreshClassification = (data)=>{

	return {
		type:REFRESH_CLASSIFICATION,
		data: data
	};
}

export const bindClassification = (categoryCode, aClaz)=>(dispatch)=>{	

	return postJson({url:"/category/mapC2C"},{categoryCode:categoryCode,classificationCodes:aClaz.map(oClaz=>oClaz.code).join(',') }).then(json=>{
			dispatch(bindClazAction(categoryCode, json ));
	});
	
};

const bindClazAction = (categoryCode, oClaz)=>{
	return {
		type: BIND_CLASSIFICATION,
		categoryCode: categoryCode,
		oClaz: oClaz
	};
}

const unlinkAttributeAction = (oCurrent)=>{
	return {
		type: UNLINK_ATTEIBUTE,
		data: oCurrent
		
	};
};

//export const unlinkAttribute = (oCurrent, )=>(dispatch)=>{
//	
//	return postJson({url:"/unlinkAttribute"} ,{classificationCode:oCurrent.code,AttributeCode:cCode})
//	.then(data=>{
//		if(data.status === "success"){
//			dispatch(unlinkClassAction(oCurrent));	
//		}else{
//		
//		}
//	}).catch(err=>{});
//
//	
//
//};

const unlinkClassAction = (oCurrent)=>{
	return {
		type:UNLINK_CLASSIFICATION,
		target: oCurrent
	};

};

export const cleanUpCategoryAtributes = ()=>{
	return {
		type: CLEANUP_CATEGORY_ATTRIBUTE
	};
};


export const bindCategoryAttribute = (categoryCode, classifications, attributes) => (dispatch) => {

	return postJson({ url: "/category/mapC2A" }, {
		categoryCode: categoryCode,
		classificationCodes: classifications.join(','),
		attributesCodes: attributes.map(attr => attr.code).join(',')
	}).then(json => {
		dispatch(bindCategoryAtributes(categoryCode, classifications, attributes, json));
	});

};

export const bindCategoryAtributes = (categoryCode, classifications, attributes, data)=>{
	return {
		type: BIND_CATEGORY_ATTRIBUTE,
		categoryCode: categoryCode,
		classifications: classifications,
		attributes: attributes,
		data: data
	};
};

export const deleteAttribute = (aCode)=>(dispatch)=>{
	
	return postJson({url:"/category/deleteAttribute", param:{ 'code': aCode }})
	.then(data=>{
		if(data.status === "success"){
			dispatch(deleteAttributeAction(aCode));	
		}else{
			messageBox.error({message: `删除属性 $aCode 失败`});
		}
	}).catch(err=>{});

};

export const deleteAttributeAction = (code) => {
	return {
		type: DELETE_ATTEIBUTE,
		data: code 
	}
}


