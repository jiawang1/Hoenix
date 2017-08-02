import {getType} from './helper.js';
//import {getAuthenticationToken} from '../utils/authentication';


var rootContext = null;

(() => {
	if (window && window.document) {
		rootContext = document.getElementById("context-root").getAttribute('value');
	}
})();
/*
 *  generate absolute URL for backend service
 */ 
const correntURL = (ops)=>{

	if(rootContext){
			if(ops.url.charAt(0)==='.'){
				ops.url = ops.url.slice(1);
			}else if(ops.url.charAt(0)!=='/'){
				ops.url = '/' + ops.url;
			}
			ops.url = rootContext + ops.url;
	   }

	if(ops.param){
			var sParam = Object.keys(ops.param).reduce((pre,current)=>{
				 if( getType( ops.param[current]) ==='String' ||getType( ops.param[current]) === 'Number'){
					 return  pre + (pre.length > 0?"&":'') + current + '=' + encodeURIComponent(ops.param[current]);
					}else if(getType(ops.param[current]) === 'Array'){
						return pre + (pre.length > 0?"&":'') + current + '=' +	encodeURIComponent(ops.param[current].join(','));
					} else if(getType(ops.param[current]) === 'Undefined' || getType(ops.param[current]) === 'Null' ){
						return pre ;
					} else if(getType(ops.param[current]) === 'Date'){
						return pre + (pre.length > 0?"&":'') + current + '=' +	ops.param[current].getTime();
					}else{
						throw new Error(`param type ${getType(ops.param[current]) } for query is not supported`);
					}
			}, '');
			
			if(sParam&&sParam.length > 0){
				ops.url = ops.url + "?" + sParam;
			}
		}
};

/**
 * Rejects a promise after `ms` number of milliseconds, if it is still pending
 */
const timeout = (promise, ms) =>{
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(reject);
  });
};


const correntOption = async (option, method)=>{
	//let token = await getAuthenticationToken();
	return {
			...option,
			headers:{
				...option.headers,
				//	AuthorizationToken:token
			},
			method:method
		};

};

const __fetch =  (_method) => async (option) => {
		
		let ops = await correntOption(option, _method);
		correntURL(ops);
		let response = await fetch(ops.url,ops);
		if (response.status >= 400) {
			var error = new Error(`response status : ${response.status}, Error is ${response.statusText}`);
			error.response = response;
			throw error;
		}
		if(response.headers.get('__authentication__') === 'failed'){
			//TODO handle auth failed
		}
		return response;

	};
/*
 *	 handle http GET request
 */
export const get = __fetch('GET');
/*
 *	 handle http POST request
 */
export const post = __fetch('POST');
/*
*	handle http GET request in JSON format
*/
export const getJson = async (option)=>{  
	if(option.headers){
		option.headers['Accept'] = 'application/json';
	}else{
		option.headers = {
			'Accept' : 'application/json',
		};
	}
	let response = await get(option);
	return response.json();
};

export const batchGet = (aOps)=>Promise.all(aOps.map(get));
export const batchGetJson = (aOps)=>Promise.all(aOps.map(getJson));

/*
*	handle http GET request in JSON format
*/
export const postJson = async (option, data)=>{
		if(option.headers){
			option.headers['Accept'] = 'application/json';
			option.headers['Content-Type'] = 'application/json';
		}else{
			option.headers = {
				'Content-Type':'application/json',
				'Accept' : 'application/json',
			};
		}
		option.body = typeof data ==='string'?data:JSON.stringify(data);
		let response = await post(option);
		return response.json();
};

export const batchPostJson = (aOps)=> Promise.all(aOps.map((ops)=> postJson(ops.option, ops.data)));

export const getContent = json=>json.map.__content__;

export const createAction = (type)=>(data)=>({type: type, data: data});

const __generateService = (method)=>(url)=> async (option)=>{
	try {
		let json = await method.call(null,url, option);
		if(json.status === 'success'){
			var __content = getContent(json);
			return  __content === 'String'?JSON.parse(__content):__content;
		}else{
			//TODO  made a global error handler
		}
	} catch (error) {
		console.error(error.stack || error);
		throw error;
	}
};

/**
 *  used to generate thunk function for post reqeust, note the function will only supprot JSON format
 *  @param actionCreator: reducx action creator
 *  @param url: request url
 */
export const generatePostService = __generateService((url, option)=>{
	return postJson({url: url}, option);
});

/**
 *  used to generate thunk function for get reqeust, note the function will only supprot JSON format
 *  @param actionCreator: reducx action creator
 *  @param url: request url
 */
export const generateGetService = __generateService((url, option)=>{
	return getJson({param: option,url:url });
});
