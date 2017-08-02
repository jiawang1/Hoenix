import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, Select, Button, Modal, Form, Table, Tag } from 'antd';
import { bindActionCreators } from 'redux';
import { PopupDialog } from './PopupDialog';
import * as actions from './actions';

const FormItem = Form.Item,
	Option = Select.Option;

const levelMap = {
	"1":"一级",
	"2":"二级",
	"3":"三级",
	"4":"四级",
}
const columns = [{
	title: '分类编码',
	dataIndex: 'key',
	width:'170px'
}, {
	title: '分类名称',
	dataIndex: 'name',
	width:'170px'
}, {
	title: '分类级别',
	dataIndex: 'levelCode',
	width:'170px',
	render:(text,record)=>{
		return levelMap[text];
	}
}, {
	title: '上级分类',
	dataIndex: 'categoryPath',
}];

class CategoryDialog extends PopupDialog {

	constructor() {
		/**  init state in super class */
		super({
				visible: false,
				confirmLoading: false,
				title: '工业分类',
				key: '',
				confirm: null,
				clearForm: false,
				pagination: {
					pageSize: 10,
					current: 1,
					total: 0
				}
			  });
	
	}
	/*   this method is for cancel button of modal dialog*/
	handleCancel() {
		this.setState({ visible: false, clearForm: true, selected: [] });
		const {cleanupCategory} = this.props.actions;
		cleanupCategory();
	}

	/*   this method is for OK button of modal dialog*/
	handleSubmit(){
		this.state.confirm.call(null, this.state.selected);
		this.handleCancel();
	}
	/*   this method is called when click on query button of query form 
		param oCondition is the field from query form */
	handleQuery(oCondition) {
		const queryCategory = this.props.actions.queryCategory;
		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;

		queryCategory({
			...oCondition,
			pageSize: this.state.pagination.pageSize,
			currentPage: 1 - 1  
		});
	}

	/*   this method is called when paging of the grid */
	handleGridChange(pagin){
	
		const queryCategory = this.props.actions.queryCategory;
		queryCategory({
			...this.state.oCondition,
			pageSize: pagin.pageSize,
			currentPage: pagin.current - 1
		});

		this.state.pagination = pagin;
	}

	/**  this method use to render form content, input param  getFieldProps is from ANT form*/

	renderFormContent(getFieldProps){
		return (
			<Row className="m-t-m m-r-l">
				<Col span={8}>
					<FormItem
						label="分类编码"
						labelCol={{ span: 9 }}
						wrapperCol={{ span: 15 }}>
						<Input size="default" {...getFieldProps('code') } />
					</FormItem>
				</Col>
				<Col span={8}>
					<FormItem
						label="分类名称"
						labelCol={{ span: 9 }}
						wrapperCol={{ span: 15 }}>
						<Input size="default" {...getFieldProps('name') } />
					</FormItem>
				</Col>
				<Col span={8} className="search-price">
					<FormItem
						label="分类级别"
						labelCol={{ span: 9 }}
						wrapperCol={{ span: 15 }}>
						<Select allowClear size="default" className="select-width" {...getFieldProps('levelCode') }>
							<Option value="1">一级</Option>
							<Option value="2">二级</Option>
							<Option value="3">三级</Option>
							<Option value="4">四级</Option>
						</Select>
					</FormItem>
				</Col>
			</Row>
		);
	}

	render(){

		const {categoryList} = this.props.oComponent;
		var aDataSource = categoryList ? categoryList.results : [];
		this.state.pagination.total = categoryList ? categoryList.pagination.totalNumberOfResults : 0;

		return (
			<Modal maskClosable={false} title={this.state.title}
				width="800px"
				visible={this.state.visible}
				onOk={() => { this.handleSubmit() } }
				className="category-dialog"
				confirmLoading={this.state.confirmLoading}
				onCancel={() => { this.handleCancel() } }>

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
		oComponent: state.components,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({...actions}, dispatch)
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps, null, {
		withRef: true
	}
)(CategoryDialog);



