import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, Select, Button, Radio, Modal, Form, Table, Tag } from 'antd';
import { bindActionCreators } from 'redux';
import { PopupDialog } from './PopupDialog';
import * as actions from './actions';
import {renderDropDown} from './../common/helper.js';


const FormItem = Form.Item,
	Option = Select.Option;
const RadioGroup = Radio.Group;

const columns = [{
  title: '商品编码',
  dataIndex: 'key',
	width:'120px'
}, {
  title: '商品名称',
  dataIndex: 'name',
	width:'200px'
}, {
  title: '商品阶段',
  dataIndex: 'lifeCycle',
	width:'70px'
}, {
  title: '型号',
  dataIndex: 'manufacturerAID',
	width:'100px'
}, {
  title: '虚拟商品',
  dataIndex: 'isDummy',
	width:'70px'
}, {
  title: '商家',
  dataIndex: 'sellerName',
	width:'50px'
}, {
  title: '准入时间',
  dataIndex: 'createTimeStr',
	width:'70px'
}, {
  title: '特殊机型',
  dataIndex: 'productAttribute',
	width:'70px'
}, {
  title: '品牌',
  dataIndex: 'brandName',
	width:'70px'
}, {
  title: '工业分类',
  dataIndex: 'categoryName',
}];


const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

/** there MUST BE a key field in data*/
// const columns = [{
//   title: '商品编码',
//   dataIndex: 'key',
// }, {
//   title: '商品名称',
//   dataIndex: 'name',
// }];


class ProductDialog extends PopupDialog {
	constructor() {
		/**  init state in super class */
		super({
				visible: false,
				confirmLoading: false,
				title: '商品',
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

	componentWillMount() {
		let {getProductDialogMeta} = this.props.actions;
		getProductDialogMeta();
	}

	handleCancel() {
		this.setState({ visible: false, clearForm: true, selected: [] });
		let {cleanupProductList} = this.props.actions;

		cleanupProductList();
	}

	handleSubmit() {
		this.state.confirm.call(null, this.state.selected);
		this.handleCancel();
	}

	/* this method is called when click on query button of query form 
	param oCondition is the field from query form */
	handleQuery(oCondition) {

		let {searchProductList} = this.props.actions;

		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;

		searchProductList(oCondition, {
			pageSize: this.state.pagination.pageSize,
			currentPage: this.state.pagination.current - 1
		});
	}

	/* this method is called when paging of the grid */
	handleGridChange(pagin){
		let {searchProductList} = this.props.actions;
		let oCondition = this.state.oCondition;
		searchProductList(oCondition, {
			pageSize: this.state.pagination.pageSize,
			currentPage: this.state.pagination.current - 1
		});

		this.state.pagination = pagin;
	}

	renderFormContent(getFieldProps) {
		let {meta} = this.props.oComponent;
		return (
			<div>
				<Row className="m-r-l">
					<Col span={7}> 
						<FormItem
							label="商品编码"
							{...formItemLayout}>
							<Select allowClear tags notFoundContent="暂无数据" size="default" {...getFieldProps('productCodes')}/>
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem
							label="商品名称"
							{...formItemLayout}>
							<Input size="default" {...getFieldProps('productName')}/>
						</FormItem> 
					</Col>
					<Col span={6}> 
						<FormItem
							className="m-b-s"
							label="商品阶段"
							{...formItemLayout} >
							<Select allowClear size="default"
								allowClear={true}
								{...getFieldProps('lifeCycle')}>
								{renderDropDown(meta.lifeCycle)}
							</Select>
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem label="特殊机型" {...formItemLayout}>
							<Select allowClear
								allowClear={true}
								style={{ width: '100%' }}
								size="default" {...getFieldProps('productAttribute')} >
								{renderDropDown(meta.productAttribute)}
							</Select>
						</FormItem> 
					</Col>
				</Row>
				<Row className="m-r-l">
					<Col span={7}> 
						<FormItem
							label="型号"
							{...formItemLayout}>
							<Input size="default" {...getFieldProps('manufacturerAID')}/>
						</FormItem>
						<FormItem
							label="工业分类"
							{...formItemLayout}>
							<Input size="default" {...getFieldProps('categoryName')} />
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem
							label="虚拟商品"
							{...formItemLayout} >
							<RadioGroup {...getFieldProps('isDummy')}>
								<Radio key="a" value={true}>是</Radio>
								<Radio key="b" value={false}>否</Radio>
							</RadioGroup>
						</FormItem>  
						<FormItem
							label="供应商"
							{...formItemLayout}>
							<Input size="default" {...getFieldProps('supplierName')} />
						</FormItem>
					</Col>	
					<Col span={6}>
						<FormItem
							label="商家"
							{...formItemLayout} >
							<Select allowClear showSearch size="default" 
								allowClear={true}
								optionFilterProp="children" {...getFieldProps('seller')} >
								{renderDropDown(meta.sellerList)}
							</Select>
						</FormItem>
					</Col>	 
					<Col span={5}>
						<FormItem
							label="品牌"
							{...formItemLayout}>
							<Input size="default" {...getFieldProps('brandName')}/>
						</FormItem>
					</Col>             
				</Row>
			</div>
		);
	}


	render() {

		let {productResult, meta} = this.props.oComponent;
		let aDataSource = productResult ? productResult.products : [];
		this.state.pagination.total = productResult ? productResult.totalNumberOfResults : 0;
		return (
			<Modal maskClosable={false} title={this.state.title}
				width="1000px"
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
		actions: bindActionCreators({...actions}, dispatch)
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps, null, {
		withRef: true
	}

)(ProductDialog);

