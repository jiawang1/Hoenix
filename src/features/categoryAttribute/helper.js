import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;

export const renderDropDown = (pageMeta, id) =>{
			if(pageMeta&& pageMeta[id]){
				return Object.keys(pageMeta[id]).map(key=>(<Option key={key } value={ key } >{pageMeta[id][key]}</Option>));
			}else{
				return false;
			}
		};
