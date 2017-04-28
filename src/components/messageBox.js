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

////////////////////////////////////////////////////////////////////////


//var notificationInstance = null;
//
//function getNotificationInstance(prefixCls) {
//  if (notificationInstance) {
//    return notificationInstance;
//  }
//  notificationInstance = Notification.newInstance({
//    prefixCls: prefixCls,
//    style: {
//      top: 76,
//      right: 0,
//    },
//  });
//  return notificationInstance;
//}
//
//function notice(args) {
//  const outerPrefixCls = args.prefixCls || 'ant-notification';
//  const prefixCls = `${outerPrefixCls}-notice`;
//
//  let duration;
//  if (args.duration === undefined) {
//    duration = defaultDuration;
//  } else {
//    duration = args.duration;
//  }
//
//  let iconType = '';
//  switch (args.type) {
//    case 'success':
//      iconType = 'check-circle-o';
//      break;
//    case 'info':
//      iconType = 'info-circle-o';
//      break;
//    case 'error':
//      iconType = 'cross-circle-o';
//      break;
//    case 'warning':
//      iconType = 'exclamation-circle-o';
//      break;
//    default:
//      iconType = 'info-circle';
//  }
//
//  let iconNode;
//  if (args.icon) {
//    iconNode = (
//      <span className={`${prefixCls}-icon`}>
//        {args.icon}
//      </span>
//    );
//  } else if (args.type) {
//    iconNode = <Icon className={`${prefixCls}-icon ${prefixCls}-icon-${args.type}`} type={iconType} />;
//  }
//
//  getNotificationInstance(outerPrefixCls).notice({
//    content: (
//      <div className={`${prefixCls}-content ${iconNode ? `${prefixCls}-with-icon` : ''}`}>
//        {iconNode}
//        <div className={`${prefixCls}-message`}>{args.message}</div>
//        <div className={`${prefixCls}-description`}>{args.description}</div>
//        {args.btn ? <span className={`${prefixCls}-btn`}>{args.btn}</span> : null}
//      </div>
//    ),
//    duration,
//    closable: true,
//    onClose: args.onClose,
//    key: args.key,
//    style: {},
//  });
//}
//
//const api = {
//  open(args) {
//    notice(args);
//  },
//  close(key) {
//    if (notificationInstance) {
//      notificationInstance.removeNotice(key);
//    }
//  },
//  config(options: ConfigProps) {
//    if ('top' in options) {
//      defaultTop = options.top;
//    }
//    if ('duration' in options) {
//      defaultDuration = options.duration;
//    }
//  },
//  destroy() {
//    if (notificationInstance) {
//      notificationInstance.destroy();
//      notificationInstance = null;
//    }
//  },
//};
//
//['success', 'info', 'warning', 'error'].forEach((type) => {
//  api[type] = (args: ArgsProps) => api.open(assign({}, args, { type }));
//});
////////////////////////////////////////////////////////////////////////

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

