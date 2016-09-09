import 'whatwg-fetch';
import {
  DEMO_COUNT,
  RESET_COUNT,
  QUERY_ATTRIBUTE,
  GET_TABLE_META,
  RECEIEVE_ATTRIBUTE
} from './constants';

export const demoCount = ()=>{
  return {
    type: DEMO_COUNT,
  };
};

export const resetCount = ()=> {
  return {
    type: RESET_COUNT,
  };
};

export const queryAttribute = () => (dispatch)=>fetch(`http://localhost:6076/api/test.json`,{mode:'no-cors', headers: {'Accept': 'application/json'}})
      .then(response => response.json()).then(json => dispatch(receiveAtributes(json))).catch((error)=>{console.log(error)});

    //  .then(json => dispatch(receiveAtributes(json))).catch((error)=>{console.log(error)});


export const receiveAtributes = (data) => {
	return {
		type:RECEIEVE_ATTRIBUTE,
		data: data
	};
};



//  return {
//    type: QUERY_ATTRIBUTE,
//	aData: (()=>{
//			const data = [];
//			for(let i = 0; i < 100 ; i++){
//			
//				data.push({
//					channel: `srore ${i}`,
//					attributeGroup: `group ${Math.ceil(i/10)}`,
//					attrbuteCode: `code ${i}`,
//					attributeName: `attribute${i}`,
//					attributeType: `type${i}`,
//					empty: i%2===0?'Yes':'No',
//					createTime: new Date().toString(),
//					effect:i%2===0?'Yes':'No',
//				});
//			}
//			return data;
//		})()
//	
//  };



