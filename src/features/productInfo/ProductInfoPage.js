import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ProductGrid } from './ProductGrid';
import  CategoryDialog  from './../../components/CategoryDialog';
import  BrandDialog  from './../../components/BrandDialog';
import SupplierDialog from './../../components/SupplierDialog';
import { ProductDialog } from './../../components/ProductDialog';
import { QueryForm } from './QueryForm';
import { Form, Select, Input, Row, Col, Button, Radio, Collapse, Cascader,Icon } from 'antd';
import { getType } from './../../common/helper.js';

import {RETRIEVE_PAGE_META,SEARCH_PRODUCT_INFO_SAGA,GET_CATEGORY_ATTRIBUTE_SAGA,
	PRODUCT_INFO_QUERY_CITY_SAGA,DYNAMIC_FORM_PREFIX	} from './productinfoState.js';

const formItemLayout = {
		labelCol: { span: 9 },
		wrapperCol: { span: 15 },
	};


class ProductInfoPage extends Component {
	static propTypes = {
		productInfo: PropTypes.object.isRequired,
	};
	
	constructor(){
		super();
		this.state = {
			metaData: {},
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0
			},
			loading: false
		}
	}

	componentDidMount(){
		const {dispatch} = this.props;

		if(dispatch){
			dispatch({type:RETRIEVE_PAGE_META});
		}

			//针对跳转过来的情况特殊处理
			let {productCategoryCode, productCategoryName} = this.props.location.query;
			if (productCategoryCode) {
				this.query({categoryCodes: [productCategoryCode]} );
				return;
			}
	
			if(this.props.formInfo || (this.props.productInfo && this.props.productInfo.aData) ){
				this.query(this.props.formInfo?this.props.formInfo.formValue:{} );
			}
	}

	query(formValue){

		var attributeList = [],
				oCondition={};
		Object.keys(formValue).forEach(key=>{
			if(key.indexOf(DYNAMIC_FORM_PREFIX) >= 0 ){
				attributeList.push({
					code: key.slice(DYNAMIC_FORM_PREFIX.length),
					value: formValue[key]
				});
			}else if(getType(formValue[key]) === 'Object'&&formValue[key]['key']){
				oCondition[key] = formValue[key]['key'];
			}else{
				if(key === 'minPrice' || key === 'maxPrice'){
					oCondition[key] = formValue[key]?Number(formValue[key]):formValue[key];
				}else{
					oCondition[key] = formValue[key];
				}

			}
		});

		if (oCondition.supplierCode && oCondition.supplierCode.length == 1) {
			oCondition.supplierCode = oCondition.supplierCode[0];
		}
		
		attributeList.length>0 && (oCondition['attributeList'] = attributeList);
		this.__query(null, oCondition).then(()=>{
			this.setState({
				loading: false,
			});
		});
	}

	__query(pagin, oCondition){
		const {dispatch} = this.props;
		const {pagination} = this.state;
		const page = pagin ? pagin : pagination;
		this.setState({
			loading: true,
			oCondition
		});

		return new Promise((res,rej)=>{
			dispatch({ type: SEARCH_PRODUCT_INFO_SAGA, data:{...oCondition, pageSize:page.pageSize, currentPage:page.current-1}, cb:(err,data)=>{
				if(err){
					rej(err);
				}else{
					res(data);
				}
			}})
		});
	}
	
	handleGridChange(pagination){
		let {oCondition} = this.state;
		this.__query(pagination, oCondition).then(()=>{
			this.setState({
				loading: false,
				pagination: pagination
			});
		});
	}
	
	queryCategoryAttribute(args){
		const {dispatch} = this.props;
		dispatch({type:GET_CATEGORY_ATTRIBUTE_SAGA, data:args });
	}

	queryCity(province){
		const {dispatch} = this.props;
		dispatch({type:PRODUCT_INFO_QUERY_CITY_SAGA, data: {province}});
	}
	
	queryPointOfService(city){
		const {dispatch} = this.props;
		dispatch({type:PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA, data: {city}});
	}
	
	componentWillReceiveProps(next){
	
		if(next.productInfo && next.productInfo.aData){
			this.setState({
				pagination:{
					...this.state.pagination,
					total: next.productInfo.aData.pagination?next.productInfo.aData.pagination.totalNumberOfResults:0
				}
			});
		}
	}

	handleReset() {

		this.setState({
			pagination: {
				...this.state.pagination,
				current: 1,
				total: 0
			},
			oCondition: null

		});
	}

	render() {

		var {productInfoMeta,categoryAttribute, aData, cities, pointOfServices} = this.props.productInfo;
		var metaData = productInfoMeta ? productInfoMeta : {};
		var aDataSource = aData ? aData.results : [];
		cities = cities ? cities : [];
		pointOfServices = pointOfServices ? pointOfServices : [];

		// prepare for jumping to this page
		let extraData = null;
		let {productCategoryCode, productCategoryName} = this.props.location.query;
		if (productCategoryCode) {
			extraData = {productCategoryCode, productCategoryName: productCategoryName?productCategoryName: productCategoryCode}
		}
		
		return (
			<div className="main-area product-info">
				<div className="field-c search-field-collapsed">
					<QueryForm submitHandler={(...args)=>{this.query(...args);}} 
						resetHandler={(...args)=>{this.handleReset(...args);}}
						queryCategoryAttribute={(...args)=>{this.queryCategoryAttribute(...args);}} 
						queryCity={(...args)=>{this.queryCity(...args);}} 
						queryPointOfService={(...args)=>{this.queryPointOfService(...args);}} 
						attribute={categoryAttribute} 
						pageMeta={metaData} 
						cities={cities} 
						reducerName={'productInfo'}
						formInfo={this.props.formInfo}
						pointOfServices={pointOfServices}
						extraData={extraData} />
					<Button type="ghost" className="m-b-s">
						<Icon type="file-excel" />导出查询结果
					</Button>
					<Row>
						<ProductGrid aDataSource={aDataSource} loading={this.state.loading} 
							onChange={(...args)=>{this.handleGridChange(...args)}} 
							pagination={this.state.pagination} />
					</Row>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		productInfo: state.productInfo,
		formInfo: state.components.productInfo
	};
}

export default connect(
	mapStateToProps
	
)(ProductInfoPage);
