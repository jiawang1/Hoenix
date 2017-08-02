import React,{Component, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from  'react-redux';
import {Form} from 'antd';
import {CACHE_FORM_INFO} from './constants.js';



const getDisplayName = (WrappedComponent)=>{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};
 const wrapState = (WrappedComponent)=>{

    class StatefuleForm extends Component{

        static propTypes={
            reducerName : PropTypes.string.isRequired
        };

        wrappeSubmit(handler){
            return (...args)=>{
                const {getFieldsValue} = this.props.form;
                const {dispatch} = this.props;
                var formValue = getFieldsValue(),
                    formMeta = args?args[args.length -1]:null;

              dispatch({
                  type: CACHE_FORM_INFO,
                  name:this.props.reducerName,
                  info:{
                      formValue: formValue,
                      formMeta: formMeta
                  }
              });
              handler&&handler.call(null, ...args);
            } ;
        }

        wrappeReset(handler){
            return (...args)=>{
                 const {dispatch} = this.props;
                dispatch({
                  type: CACHE_FORM_INFO,
                  name:this.props.reducerName,
                  info:null
              });
                handler&&handler.call(null, ...args);
            };

        }

        componentWillMount(){
            var props = {...this.props};
            this.submitHandler =this.wrappeSubmit(props.submitHandler); 
            this.resetHandler = this.wrappeReset(props.resetHandler);
        }
        /** 
         *  inject two function via props
         *     1 submitHandler: used to cache form info
         *     2 resetHandler: used to clean up cache
        */
        render(){
            var props = {...this.props,
                    submitHandler: this.submitHandler,
                    resetHandler: this.resetHandler
                };
           
            return (
                <WrappedComponent {...props}/>
            );
        }
    }

    StatefuleForm.displayName = `Stateful(${getDisplayName(WrappedComponent)})`;
    StatefuleForm.WrappedComponent = WrappedComponent;
    return connect()(hoistStatics(StatefuleForm, WrappedComponent));
};

export default wrapState;