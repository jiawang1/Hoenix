import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input,Select, Button,Modal,Form,Table, Tag} from 'antd';
import { bindActionCreators } from 'redux';
import {querySupplier, cleanupSupplier} from './actions';
import { PopupDialog } from './PopupDialog';

const FormItem = Form.Item;

const columns = [{
  title: '供应商编码',
  dataIndex: 'key',
}, {
  title: '供应商名称',
  dataIndex: 'name',
}];

class SupplierDialog extends PopupDialog{

	constructor(){
		super({
				visible: false,
				confirmLoading: false,
				title: '供应商',
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
	handleCancel(){
		this.setState({ visible: false, clearForm: true, selected: [] });
		const {cleanupSupplier} = this.props.actions;
		cleanupSupplier();
	}

	handleSubmit(){
			this.state.confirm.call(null, this.state.selected);
			this.handleCancel();
		}

		/*   this method is called when click on query button of query form 
	param oCondition is the field from query form*/
	handleQuery(oCondition) {
		const {querySupplier} = this.props.actions;
		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;

		querySupplier({
			...oCondition,
			pageSize: this.state.pagination.pageSize,
			currentPage: 1 - 1  
		});
	}

/*   this method is called when paging of the grid */
handleGridChange(pagin){
		const {querySupplier} = this.props.actions;
		querySupplier({
					...this.state.oCondition,
					pageSize: pagin.pageSize,
					currentPage: pagin.current - 1
				});

		this.state.pagination = pagin;
	}

renderFormContent(getFieldProps){

	   return (<Row className="m-t-m m-r-l">
		              <Col span={8}> 
		                <FormItem
		                  label="供应商编码"
		                  labelCol={{ span: 9 }}
		                  wrapperCol={{ span: 15 }}>
		                  <Input size="default" {...getFieldProps("code")}/>
		                </FormItem>
		              </Col>
		              <Col span={8}>
		                <FormItem
		                  label="供应商名称"
		                  labelCol={{ span: 9 }}
		                  wrapperCol={{ span: 15 }}>
		                  <Input size="default" {...getFieldProps("name")}/>
		                </FormItem>
		              </Col>		              
		        	</Row> );
	}
	render(){
				const {oSupplier} = this.props.oComponent;
				var aDataSource = oSupplier ? oSupplier.data : [];
				this.state.pagination.total = oSupplier ? oSupplier.recordsTotal : 0;
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
		oComponent: state.components,
	};
}
function mapDispatchToProps(dispatch) {
	return {
			actions: bindActionCreators({cleanupSupplier, querySupplier}, dispatch)
		};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps, null, {
		withRef: true
	}
)(SupplierDialog);
