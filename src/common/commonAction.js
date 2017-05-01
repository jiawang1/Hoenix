import 'whatwg-fetch';
import { getType } from './helper.js';
import { ADD_GLOBAL_ERROR, REMOVE_GLOBAL_ERROR } from './constants';
import { browserHistory } from 'react-router';
import { NO_AUTH_PATH } from './constants.js';
var rootContext = null;

(() => {
	if (window && window.document) {
		rootContext = document.getElementById("context-root").getAttribute('value');
	}
})();

const parseJson = (res) => {
	return res.json().catch(e => {
		return { status: "error", map: { __message__: "数据格式错误, 返回不是json格式数据" } };
	});
}

const __fetch = (_method) => async (option) => {

	let ops = Object.assign({}, {
		credentials: 'same-origin',
	}, option, { method: _method });

	if (rootContext) {
		if (ops.url.charAt(0) === '.') {
			ops.url = ops.url.slice(1);
		} else if (ops.url.charAt(0) !== '/') {
			ops.url = '/' + ops.url;
		}
		ops.url = rootContext + ops.url;
	}

	if (ops.param) {
		var sParam = Object.keys(ops.param).reduce((pre, current) => {
			if (getType(ops.param[current]) === 'String' || getType(ops.param[current]) === 'Number'
				|| getType(ops.param[current]) === 'Boolean') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + encodeURIComponent(ops.param[current]);
			} else if (getType(ops.param[current]) === 'Array') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + encodeURIComponent(ops.param[current].join(','));
			} else if (getType(ops.param[current]) === 'Undefined' || getType(ops.param[current]) === 'Null') {
				return pre;
			} else if (getType(ops.param[current]) === 'Date') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + ops.param[current].getTime();
			} else {
				throw new Error(`param type ${getType(ops.param[current])} for query is not supported`);
			}
		}, '');

		if (sParam && sParam.length > 0) {
			ops.url = ops.url + "?" + sParam
		}
	}

	try{
		let response = await fetch(ops.url, ops);
		if(response.headers.get('__authentication__') === 'failed'){
			let json = await response.json();
			if(window){
				window.location.href = json.map.__message__.trim();
			}else{
				//TODO
			}
		}else if(response.headers.get('__authorization__') === 'failed'){
			if (window) {
				window.location.href = window.location.href.replace(/^(.*\/#\/)(.*)/, "$1" + NO_AUTH_PATH);
			}
		}else{
			return response;
		}
	}catch(err){
		console.error(err.stack || err);
		throw err;
	}
};



const __fetch1 = (_method) => (option) => {

	let ops = Object.assign({}, {
		credentials: 'same-origin',
	}, option, { method: _method });

	if (rootContext) {
		if (ops.url.charAt(0) === '.') {
			ops.url = ops.url.slice(1);
		} else if (ops.url.charAt(0) !== '/') {
			ops.url = '/' + ops.url;
		}
		ops.url = rootContext + ops.url;
	}

	if (ops.param) {
		var sParam = Object.keys(ops.param).reduce((pre, current) => {
			if (getType(ops.param[current]) === 'String' || getType(ops.param[current]) === 'Number'
				|| getType(ops.param[current]) === 'Boolean') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + encodeURIComponent(ops.param[current]);
			} else if (getType(ops.param[current]) === 'Array') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + encodeURIComponent(ops.param[current].join(','));
			} else if (getType(ops.param[current]) === 'Undefined' || getType(ops.param[current]) === 'Null') {
				return pre;
			} else if (getType(ops.param[current]) === 'Date') {
				return pre + (pre.length > 0 ? "&" : '') + current + '=' + ops.param[current].getTime();
			} else {
				throw new Error(`param type ${getType(ops.param[current])} for query is not supported`);
			}
		}, '');

		if (sParam && sParam.length > 0) {
			ops.url = ops.url + "?" + sParam
		}
	}

	return new Promise((resolve, reject) => {
		fetch(ops.url, ops).then(response => {
			if (response.headers.get('__authentication__') === 'failed') {
				if (window) {
					response.json().then(json => {
						window.location.href = json.map.__message__.trim();
					}).catch(err => {
						reject(err);
					});
				} else {
					reject('not in browser environment, can not redirect');
				}
			} else if (response.headers.get('__authorization__') === 'failed') {
				if (window) {
					window.location.href = window.location.href.replace(/^(.*\/#\/)(.*)/, "$1" + NO_AUTH_PATH);
				}
				reject("");

			} else {
				resolve(response);
			}
		});
	});

};

export const get = __fetch('GET');
export const post = __fetch('POST');
export const getJson = (option) => {
	if (option.headers) {
		option.headers['Accept'] = 'application/json';
	} else {
		option.headers = {
			'Accept': 'application/json',
		};
	}
	return get.call(null, option).then(checkStatus).then(parseJson);
};

export const batchGet = (aOps) => Promise.all(aOps.map(get));
export const batchGetJson = (aOps) => Promise.all(aOps.map(getJson));

const postJsonWithoutParser = (parser) => (option, data) => {

	if (option.headers) {
		option.headers['Accept'] = 'application/json';
		option.headers['Content-Type'] = 'application/json';

	} else {
		option.headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};
	}
	option.body = typeof data === 'string' ? data : JSON.stringify(data);
	return post.call(null, option).then(checkStatus).then(parser);
};

export const postJson = postJsonWithoutParser(parseJson);

export const batchPostJson = (aOps) => Promise.all(aOps.map((ops) => postJson(ops.option, ops.data)));

export const postForm = (option, form) => {

	var formEle = typeof form === 'string' ? document.querySelector(form) : form;
	return post.call(null, Object.assign({}, option, { body: formEle })).then(checkStatus).then(parseJson);

};

export const showError = error => {
	return {
		type: ADD_GLOBAL_ERROR,
		error: error
	};
};

export const removeError = key => {
	return {
		type: REMOVE_GLOBAL_ERROR,
		key: key
	};
};
/*
 *	deprecated!	help to handle response which wrapped by ResponseMessage.
 *  */
export const getResponseThunk = (actionCreator, url) => (dispatch) => (option) => {

	return getJson({ param: option, url: url }).then(json => {

		if (json.status === 'success') {
			var __content = (getType(json.map.__content__) === 'String' && json.map.__content__ !== '') ? JSON.parse(json.map.__content__) : json.map.__content__;
			dispatch(actionCreator(__content));
			return __content;
		} else {
			dispatch(showError(json.map.__message__));
			return null;
		}
	});
};

const __generateThunk = (method) => (actionCreator, url) => (option) => (dispatch) => {

	if (getType(actionCreator) === 'String') {
		url = actionCreator;
		actionCreator = undefined;
	}

	return method.call(null, url, option).then(json => {

		if (json.status === 'success') {
			var __content = (getType(json.map.__content__) === 'String' && json.map.__content__ !== '') ? JSON.parse(json.map.__content__) : json.map.__content__;
			actionCreator && dispatch(actionCreator(__content));
			//return __content;
		} else {
			dispatch(showError(json.map.__message__));
			//return {status: 'error'};
		}
		return json;
	}).catch(err => {
		console.error(err.stack || err);
		dispatch(showError(`未知的异常，请联系技术人员`));
		return Promise.reject(err);
	});
};

export const generatePostThunk = __generateThunk((url, option) => {
	return postJson({ url: url }, option);
});

export const generateGetThunk = __generateThunk((url, option) => {
	return getJson({ param: option, url: url });
});

export const createAction = (type) => (data) => {
	return { type, data }
}


const checkStatus = (response) => {

	if (Math.floor(response.status / 100) === 2) {
		return response;
	} else {
		var error = new Error(`response status : ${response.status}, Error is ${response.statusText}`);
		error.response = response;
		return Promise.reject(error);
	}
};



export const getContent = json => json.map.__content__;
export const isSuccess = json => json.status === 'success';
export const getErrorMsg = json => ((json && json.map && json.map.__message__) ? json.map.__message__ : "未给出错误信息");
export const errorAction = json => {
	return {
		type: ADD_GLOBAL_ERROR,
		error: getErrorMsg(json)
	};
};

const parseBlob = (res) => {
	return res.blob().then(blob => {
		let contentType = res.headers.get('Content-Type');
		let contentDisposition = res.headers.get('Content-Disposition');
		contentDisposition = decodeURIComponent(escape(contentDisposition));
		let path = contentDisposition.replace(/attachment;filename=(.*)$/, "$1");

		downloadFile(path, blob);
	}).catch(e => {
		return res.json().catch(e2 => {
			return { status: "error", map: { __message__: "数据格式错误, 返回不是json格式数据" } };
		})
	});
}

export const postJsonToDownload = postJsonWithoutParser(parseBlob);

export const downloadFile = (path, blob) => {
	let filename = 'export.xls';
	if (path) {
		filename = path.replace(/\/?(.*\..*$)/, "$1");
	}
	let a = document.createElement('a');
	document.body.appendChild(a);
	//let URL = window.URL || window.webkitURL;
	let url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
	document.body.removeChild(a);
}

