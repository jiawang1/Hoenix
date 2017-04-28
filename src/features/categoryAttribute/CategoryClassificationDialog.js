import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {queryClassification,cleanUpClassificationResult,bindClassification} from './editActions';
import { Row, Col, Input,Select, Button,Modal,Form,Table,Radio,Tag} from 'antd';
import {renderDropDown} from './helper.js';
import { bindActionCreators } from 'redux';
import {messageBox} from './../../components/messageBox';

const FormItem = Form.Item,
	RadioGroup = Radio.Group,
	Option = Select.Option;

const columnsCls = [{
	title: '渠道',
	dataIndex: 'channel',
}, {
	title: '属性组名称',
	dataIndex: 'name',
}, {
	title: '属性组编码',
	dataIndex: 'code',
}, {
	title:'创建时间',
	dataIndex: 'creationTime'
}];

const formItemLayout = {
	labelCol: { span: 9 },
	wrapperCol: { span: 15 },
};

const pageSize = 10;

class QueryForm extends Component{

	handleReset(){
		this.props.form.resetFields();
	}

	componentWillReceiveProps(next){
		if(next.shouldClear){
			this.handleReset();
		}
	}
	
	handleSubmit(){
		var props = this.props.form.getFieldsValue();
		const handleQuery = this.props.handleQuery;
		handleQuery(props);
	}

	render(){
		const { getFieldProps } = this.props.form;
		return (
				<Form>
					<Row className="m-t-m m-r-l">
									<Col span={8}> 
										<FormItem
											label="渠道"
											{...formItemLayout}>
											<Select allowClear size="default" className="select-width" {...getFieldProps('channel')} >
								{  renderDropDown(this.props.pageMeta, 'channel') }
											</Select>
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem
											label="属性组名称"
											{...formItemLayout}>
											<Input size="default" {...getFieldProps('name')}/>
										</FormItem>
									</Col>
									<Col span={8} className="search-price">              
										<FormItem
											label="属性组编码"
											{...formItemLayout}>
											<Input size="default"  {...getFieldProps('code')}/>
										</FormItem>
								</Col>
							</Row> 
							<Row className="m-b-m">
									<Col span={12} offset={12} className="p-r-l multi-buttons">
										<Button type="primary" onClick={ ()=>this.handleSubmit() }>查询</Button>
										<Button className="m-l-m" type="ghost" onClick={ ()=>this.handleReset() }>重置</Button>
									</Col>
								</Row>
						</Form>
		);
	}
}

QueryForm =Form.create()(QueryForm);

class CategoryClassificationDialog extends Component{

	constructor(){
		super();
		this.state = {
			visible: false,
			title: '',
			categoryCode:'',
			confirm: null,
			selected:[],
			clearForm: false,
			pagination:{
				pageSize: 10,
				current:1,
				total:0
			}
		};
	}
	handleCancel(){
		this.setState({visible: false, clearForm: true, selected:[] });
		const {cleanUpClassificationResult} = this.props.actions;
		cleanUpClassificationResult();
	}

	handleGridChange(pagin){
	
		const queryClassification = this.props.actions.queryClassification;
	
		queryClassification({
			...this.state.oCondition,
			categoryCode: this.props.categoryCode,
			pageSize: pagin.pageSize,
			currentPage: pagin.current - 1
		});

		this.state.pagination = pagin;
	
	}

	handleQuery(oCondition){
		const queryClassification = this.props.actions.queryClassification;

		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;
		
		queryClassification({
			...oCondition,
			categoryCode: this.props.categoryCode,
			pageSize: this.state.pagination.pageSize,
			currentPage:0
		});
	}

	handleSelect(record, selected, selectedRows){

		if(selected){
			var aSe = this.state.selected;
			aSe.push(record);
			this.setState({
				selected: aSe
			});
		}else{
			var aSe = this.state.selected;
			aSe.splice( aSe.findIndex(item=>item.code === record.code),1);
			this.setState({
				selected: aSe
			});
		}
	}
	handleSelectAll(selected, selectedRows, changeRows){
		if(selected){
				var aSe = [...this.state.selected, ...changeRows];
				this.setState({
					selected: aSe	
				});	
		}else{
			var aSe = this.state.selected;
			var aSelected = aSe.filter(item=>changeRows.findIndex(row=>row.code === item.code ) < 0);
				this.setState({
					selected: aSelected	
				});	
		}
	}
	handleCloseTag(code){

		var aSe = this.state.selected;
		aSe.splice( aSe.findIndex(item=>item.code === code),1);
		this.setState({
			selected: aSe
		});
	}

	handleBind(){
		const {bindClassification} = this.props.actions;
		let selectedValid = this.state.selected.filter(c => c.auditStatusCode === "VALID");
		if (!selectedValid || selectedValid.length == 0) {
			messageBox.error({message: "未选择审核通过的关联属性组"});
			return;
		}
		bindClassification(this.props.categoryCode, selectedValid ).then(data=>{
			
			this.handleCancel();
		});
	}
	
	renderTag(){

		if(this.state.selected &&this.state.selected.length >0 ){
			return 	this.state.selected.map(claz=>{
				return (
					<Tag closable color="blue" key={claz.code} onClose={()=>{this.handleCloseTag(claz.code) }}>{claz.name}</Tag>	
				);
			});	
		}else{
			return false;
		}
	}

	handleClearTags(){
		this.setState({
			selected: []
		});
	}
	
	render(){

		const { pageMeta} = this.props;	
		const {classificationResult} = this.props.oCLassification;
		var aDataSource =  classificationResult?classificationResult.results:[];
		this.state.pagination.total = classificationResult?classificationResult.pagination.totalNumberOfResults:0;

		return (
			<div>
				<Button type="ghost" onClick={ ()=>{ 
					this.setState({
							title : '关联属性组',
							visible: true,
							clearForm: false
							});
						}
					}  >关联属性组
				</Button>
				<Modal maskClosable={false} title={this.state.title}
					width="1000px"
					className="modal-l"
					visible={this.state.visible }
					onOk={()=>{this.handleBind()}}
					confirmLoading={this.state.confirmLoading}
					onCancel={()=>{this.handleCancel()}}>
					<QueryForm pageMeta = {pageMeta}  handleQuery={(...args)=>{this.handleQuery(...args)}} shouldClear = {this.state.clearForm}  />
					<div className="multi-select-dialog field-blue p-xs m-b-s">
						<Row>
							<Col span={23}>
								{ this.renderTag() }
							</Col>
							<Col span={1}>
								<a onClick={()=>{this.handleClearTags()}}>清空</a>
							</Col>
						</Row>
					</div>
					<Table scroll={{ y: 185 }} size="small" rowSelection={{
						onSelect: (...args)=>{this.handleSelect(...args);},
							selectedRowKeys:this.state.selected.map(item=>item.code),
						onSelectAll:(...args)=>{this.handleSelectAll(...args);}		
					}} columns={columnsCls} dataSource={aDataSource}
					onChange={(...args)=>{this.handleGridChange(...args)}} pagination={this.state.pagination} />
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		oCLassification: state.home,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({queryClassification:queryClassification,
									cleanUpClassificationResult:cleanUpClassificationResult,
									bindClassification:bindClassification}, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryClassificationDialog);
