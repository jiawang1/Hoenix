import 'whatwg-fetch';

//export const getJson = (oQuery)=>{}

var rootContext = null;

(()=>{
	if(window &&window.document){
	rootContext = document.getElementById("context-root").getAttribute('value');
	
}})();


const __fetch = (_method)=>(option)=>{

		let ops = Object.assign({},{
			mode:'no-cors', 
			credentials: 'same-origin',
		},option, {method: _method});
		if(rootContext){
			ops.url = rootContext + ( ops.url.charAt(0)==='.'?ops.url.slice(1): ops.url );
		}
		return fetch(ops.url,ops);
	};

export const get = __fetch('GET');

export const post = __fetch('POST');

export const getJson = (option)=>{  
		
	if(option.headers){
		option.headers['Accept'] = 'application/json';
	}else{
		option.headers = {
			'Accept' : 'application/json',
		};
	}
	return get.call(null, option).then(checkStatus).then(parseJson);
};
	
export const batchGet = (aOps)=>Promise.all(aOps.map(get));
export const batchGetJson = (aOps)=>Promise.all(aOps.map(getJson));
export const postJson = (option, data)=>{

		if(option.headers){
			option.headers['Accept'] = 'application/json';
			option.headers['Content-Type'] = 'application/json';

		}else{
			option.headers = {
				'Accept' : 'application/json',
				'Content-Type':'application/json'
			};
		}
		option.body = typeof data ==='string'?data:JSON.stringify(data);
		return post.call(null, option).then(checkStatus).then(parseJson);
};

export const batchPostJson = (aOps)=> Promise.all(aOps.map((ops)=> postJson(ops.option, ops.data)));

export const postForm = (option, form)=>{

	var formEle = typeof form ==='string'?document.querySelector(form): form;
	return post.call(null, Object.assign({},option,{body:formEle })).then(checkStatus).then(parseJson);

};


	const checkStatus = (response)=>{
	
		if(Math.floor(response.status/100) === 2){
			return response;
		}else{
		 var error = new Error(response.statusText);
			error.response = response;
			 throw error;
		}
	};

	const parseJson = (res)=>res.json();

	console.log(`try to check context root :  ${rootContext}`);
