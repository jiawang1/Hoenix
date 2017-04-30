import React,{Component} from 'react';
import {message, Icon,notification  } from "antd";
import Notification from 'rc-notification';
import assign from 'object-assign';
import { connect } from 'react-redux';
import {removeError} from './actions';

var messageBox = {};

notification.config({top: 76});
message.config({
	top: 76,
	duration: 4
});

messageBox.success = (text)=>{
	message.success(text);
};

messageBox.error = (config)=>{
	var _config = Object.assign({message: '错误'},config, {duration: null});
	notification.error(_config);
};

class MessageBox extends Component{

	shouldComponentUpdate(nextProps, nextState){
		
		var __error = this.props.error;
		var next = nextProps.error;

		if(!next || !next.aGlobalError){
			return false;
		}
		if(!__error ||!__error.aGlobalError){
			return true;
		}
		return next.aGlobalError.some((error)=> ! __error.aGlobalError.some( current=> current.key === error.key));
	
	}	
	render(){
		return (<div></div>);
	}

	componentDidUpdate(){
		var globalError = this.props.error;
		var dispatch = this.props.dispatch;
			if(globalError && globalError.aGlobalError&& globalError.aGlobalError.length > 0){
				globalError.aGlobalError.forEach(oError=>{
					oError.onClose = ((key)=>()=>{
						dispatch(removeError(key));
					})(oError.key);
					messageBox.error(oError)});
			}
	}

}

function mapStateToProps(state) {
	return {
		error: state.globalError
	};
}

export const Message = connect(mapStateToProps, null)(MessageBox);
export {messageBox};

