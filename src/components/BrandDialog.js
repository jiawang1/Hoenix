import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input,Select, Button,Modal,Form,Table, Tag} from 'antd';
import { PopupDialog } from './PopupDialog';
import { bindActionCreators } from 'redux';
import {queryProductBrand, cleanupBrand} from './actions';

const FormItem = Form.Item;

/** there MUST BE a key field in data*/
const columns = [{
  title: '品牌编码',
  dataIndex: 'key',
}, {
  title: '品牌名称',
  dataIndex: 'name',
}];

 class BrandDialog extends PopupDialog{

	constructor(){
		super({
			visible: false,
			confirmLoading: false,
			title: '品牌',
			key: '',
			confirm: null,
			clearForm: false,
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0
			}
		});
		this.state.selectedCategories = [];

	}
	handleCancel(){
		this.setState({ visible: false, clearForm: true, selected: [] });
		const {cleanupBrand} = this.props.actions;
		cleanupBrand();
		
	}

	handleSubmit(){
		this.state.confirm.call(null, this.state.selected);
		this.handleCancel();
	}

	/*   this method is called when click on query button of query form 
		param oCondition is the field from query form */
	handleQuery(oCondition) {
		const {queryProductBrand} = this.props.actions;
		if(this.state.selectedCategories.length > 0)
		//oCondition.categoryCodes = this.state.selectedCategories.map(c=>c.code).join(",");
		oCondition.categoryCodes = this.state.selectedCategories.map(c=>c.code);
		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;

		queryProductBrand({
			...oCondition,
			pageSize: this.state.pagination.pageSize,
			currentPage: 1 - 1  
		});
	}

	/*   this method is called when paging of the grid */
	handleGridChange(pagin){
		const {queryProductBrand} = this.props.actions;
		queryProductBrand({
			...this.state.oCondition,
			pageSize: pagin.pageSize,
			currentPage: pagin.current - 1
		});

		this.state.pagination = pagin;
	}

	renderCategoryContent(){
		if(this.state.selectedCategories.length > 0)
		return (
			<Row className="m-t-m m-r-l">
				<Col span={24}>
					<FormItem
						label="工业分类"
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 20 }}>
						<span>{this.state.selectedCategories.map(c=>c.name).join(",")}</span>
					</FormItem>
				</Col>
			</Row>
		);
	}

	renderFormContent(getFieldProps){
		return (	
			<div>
				{this.renderCategoryContent()}
				<Row className="m-t-m m-r-l">
					<Col span={12}> 
						<FormItem
							label="品牌编码"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}>
							<Input size="default" {...getFieldProps('code') }/>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem
							label="品牌名称"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}>
							<Input size="default" {...getFieldProps('name') }/>
						</FormItem>
					</Col>		              
				</Row> 
			</div>
		);
	}

	render(){
		const {oBrand} = this.props.oComponent;
		var aDataSource = oBrand ? oBrand.results : [];
		this.state.pagination.total = oBrand ? oBrand.pagination.totalNumberOfResults : 0;
		return (
			<Modal maskClosable={false} title={this.state.title}
				width="800px"
				visible={this.state.visible }
				onOk={() => { this.handleSubmit() }}
				className="category-dialog"
				confirmLoading={this.state.confirmLoading}
				onCancel={()=>{this.handleCancel()}}>

				{this.renderDialogContent()}
				<Table className="table-size-dialog" size="small" scroll={{ y: 153 }}
					rowSelection={{...this.rowSelection, selectedRowKeys:this.state.selected.map(item => item.key) }}
					onChange={(...args) => { this.handleGridChange(...args) } }
					columns={columns} dataSource={aDataSource} pagination={this.state.pagination} />
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		oComponent: state.components
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({cleanupBrand, queryProductBrand}, dispatch)
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps, null, {
		withRef: true
	}
)(BrandDialog);


