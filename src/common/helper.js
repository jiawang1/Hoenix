import { Select, Radio } from 'antd';
import React from 'react';

const Option = Select.Option;


export const getType = obj => Object.prototype.toString.call(obj).replace(/.*\s(.*)]$/, "$1");
export const formatDate = (ms, split="-") => {
	//let date = new Date(Number(ms));
	let date = null;
	if (getType(ms) === 'Number') {
		date = new Date(ms);
	} else if (getType(ms) === 'String') {
		date = new Date(Number(ms));
	}
	if (date) {
		return `${date.getFullYear()}${split}${date.getMonth() + 1}${split}${date.getDate()}`;
	}

	return '';
};

export const formatDateTime = (ms, split="-") => {
	let date = null;
	if (getType(ms) === 'Number') {
		date = new Date(ms);
	} else if (getType(ms) === 'String') {
		date = new Date(Number(ms));
	}
	let toFixed2 = n => n > 9 ? n : `0${n}`;
	if (date) {
		return `${date.getFullYear()}${split}${toFixed2(date.getMonth() + 1)}${split}${toFixed2(date.getDate())} ${toFixed2(date.getHours())}:${toFixed2(date.getMinutes())}:${toFixed2(date.getSeconds())}`;
	}
	return '';
};

export const formatTime = ms => {
	let date = new Date(Number(ms));
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const renderDropDown = (aList, key = 'code', value = 'name') => {

	return (aList && aList.length > 0) ? aList.map(data => {

		var ops = {};
		if (data.disabled) {
			ops.disabled = true;
		}
		return (<Option key={data[key]} value={data[key]} {...ops} >{data[value]}</Option>);
	}) : [];
};

export const isNumberLike = (target) => Number.parseFloat(target) - target + 1 > 0;
export const parseToNumber = (value)=>{

	if(value !== undefined && value !== null){
		if(value.length === 0){ return 0;}
		else if (isNumberLike(value)){
			return Number(value);
		}
	}
	return value;
};

export const renderRadioGroup = (aList, key = 'code', value = 'name') => {
	return (aList && aList.length > 0) ? aList.map(data => {
		return (<Radio key={data[key]} value={data[key]} >{data[value]}</Radio>);
	}) : [];
};

export const createAction = (type, data) => {
	return { type, data }
}

export const groupAttributes = (count) => (attrs) => {

	var groupedAttr = [];

	return attrs.reduce((pre, curr, inx) => {
		if (inx === attrs.length - 1) {
			if (groupedAttr.length === count) {
				pre.push(groupedAttr.slice());
				pre.push([curr]);
			} else {
				groupedAttr.push(curr);
				pre.push(groupedAttr.slice());
			}
		} else {
			if (groupedAttr.length === count) {
				pre.push(groupedAttr.slice());
				groupedAttr = [curr];
			} else {
				groupedAttr.push(curr);
			}
		}
		return pre;
	}, []);

}

export const addKeyToResults = (data, attr = 'results', srcAttr = 'code') => {
	if (!data) {
		return data
	}

	let cloneData = Object.assign({}, data);
	if (data[attr]) {
		cloneData[attr].map(d => d.key = d[srcAttr]);
	}
	return cloneData;
};

export const wrapToPromise = (fn, context) => (...args) => {

	return new Promise((resolve, reject) => {
		fn.call(context || null, ...args, (err, val) => {
			if (err) {
				reject(err);
			} else {
				resolve(val);
			}
		})
	});
};

export const renderScope = (record, posProp = "pointOfServiceNames") => {

	let formatOneScope = (c, idx) => {
		let region = [];
		if (c[posProp] && c[posProp].length > 0) {
			region = region.concat(c[posProp]);
		}
		if (c.cityNames && c.cityNames.length > 0) {
			region = region.concat(c.cityNames);
		}
		if (c.provinceNames && c.provinceNames.length > 0) {
			region = region.concat(c.provinceNames);
		}
		if (c.isWholeCountry) {
			return <div>{`全国`}</div>
		}
		return <div key={idx}>{`${c.channelName} ${region.join(',')}`}</div>
	};

	return record.scopes.map(formatOneScope);
}

export const renderScope2 = (record) => {
	var result = '';
	record && record.scopes && record.scopes.map(item => {
		if (result.length > 0) {
			result += '，';
		}
		if (item.channelName) {
			result += (`${item.channelName} `);
		}
		if (item.isWholeCountry) {
			result += (`全国`);
		} else if (item.pointOfServiceNames && item.pointOfServiceNames instanceof Array && item.pointOfServiceNames.length > 0) {
			result += item.pointOfServiceNames.join(' ');
		} else if (item.cityNames && item.cityNames instanceof Array && item.cityNames.length > 0) {
			result += item.cityNames.join(' ');
		} else if (item.provinceNames && item.provinceNames instanceof Array && item.provinceNames.length > 0) {
			result += item.provinceNames.join(' ');
		}
	});
	return result;
}

export const renderNumberProps = ()=>{
	return {
		rules: [{type: 'number' ,
			min: 0,
			transform: parseToNumber,
			message: "请输入不小于0的数字"
		}]
	};
}

export const renderNatualNumber = ()=>{
	return {
		rules: [{type: 'integer' ,
			min: 0,
			transform: parseToNumber,
			message: "请输入不小于0的整数"
		}]
	};
}

export const renderPositiveIntegerNumber = ()=>{
	return {
		rules: [{type: 'integer' ,
			min: 1,
			transform: parseToNumber,
			message: "请输入大于0的整数"
		}]
	};
}

export const renderMandatoryProps = ()=>{

	return {
			rules: [{required: true ,
			message: "该字段为必填"
		}]

	};
};

const mergeRule = (...methods)=>()=>{
	
	let _rule = methods.reduce((pre, method)=>{
		let oRule = method();
		return Object.assign(pre, ...oRule.rules);
	}, {});

	return {rules: [_rule]}
}

export const renderMandatoryGroup = ()=>{
		return {
			rules: [{required: true ,
				type:'array',
			message: "该字段为必填"
		}]

	};
};

export const parseToNumberMandatory = (value)=>{

	if(isNumberLike(value)){
		return Number(value);
	}
	return value;
}

export const renderMandatoryNumberProps = mergeRule(renderMandatoryProps,renderNumberProps,()=>({rules:[{transform: parseToNumberMandatory}]}) );
export const renderMandatoryNatualNumber = mergeRule(renderMandatoryProps,renderNatualNumber,()=>({rules:[{transform: parseToNumberMandatory}]}) );

export const renderMandatoryObjectProps = ()=>{
	return {
		rules: [{required: true ,
			type:'object',
			message: "该字段为必填"
		}]

	};

};

export const renderNatualRatio = ()=>{
	return {
		rules:[{
			type: 'integer' ,
			min: 0,
			max:100,
			transform:parseToNumber,
			message: "请输入 0 ～ 100 数字"
		}]
	};
};


export const renderMandatoryNatualRatio = mergeRule(renderMandatoryProps,renderNatualRatio,()=>({rules:[{transform: parseToNumberMandatory}]}) );

export const goAlipay = (formDom) => {
	let newWin=window.open("", "_blank");
	newWin.document.write(`<TITLE>支付</TITLE><BODY>${formDom}</BODY></HTML>`);
}

/*  used to control date picker widget to show enabled/disabled time range */
export	const disabledDate = (target, before=true   )=>(current)=>{
		return current? before? current.getTime() < target : current.getTime() > target: undefined;
	};


const hasAuth = (auth)=>(config, aAuth)=>{
		
	return config&&config.resource && config.resource.length > 0 && aAuth.some(
		oAuth=>{ return config.resource.indexOf(oAuth.resource) >= 0 && config.method.toLowerCase() === oAuth.method.toLowerCase() && oAuth.grant.indexOf(auth) >=0; })
};

export const hasAccessAuth = hasAuth("R");
export const hasUpdateAuth = hasAuth("U");
export const hasAuthorization = (config, aAuth)=>{
	return hasAuth(config.auth)(config, aAuth);
};

export const isEmpty = (val)=>{

	if (val === undefined || val === null) {
		return true;
	}
	if(getType(val) === 'String'){
		return val.length === 0;
	}
	return false;
};
