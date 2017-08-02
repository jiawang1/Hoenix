import React, { Component, PropTypes } from 'react';
import { Row, Col, Input, Select, Button, Modal, Form, Table, Tag } from 'antd';


const FormItem = Form.Item,
	Option = Select.Option;

class QueryForm extends Component {
	static propTypes ={
		renderFormContent :  PropTypes.func.isRequired,
		handleQuery: PropTypes.func.isRequired,
	};
	constructor() {
		super();
	}
	componentWillReceiveProps(next) {
		if (next.shouldClear) {
			this.handleReset();
		}
	}
	handleReset() {
		this.props.form.resetFields();
	}
	handleSubmit() {
		var props = this.props.form.getFieldsValue();
		const handleQuery = this.props.handleQuery;
		handleQuery(props);
	}
	render() {
		const { getFieldProps } = this.props.form;
		return (
			<Form>
				{this.props.renderFormContent(getFieldProps, this.props.form)}
				<Row className="m-b-m">
					<Col span={12} offset={12} className="p-r-l multi-buttons">
						<Button type="primary" onClick={() => this.handleSubmit()}>查询</Button>
						<Button className="m-l-m" type="ghost" onClick={() => this.handleReset()}>重置</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}

QueryForm = Form.create()(QueryForm);

export class PopupDialog extends Component {

	constructor(oState) {
		super();
		this.state={
			...oState,
			selected: [],
			gridType: 'multiple'
		};
		this.rowSelection = {
			onSelect: (...args) => { this.handleSelect(...args); },
			onSelectAll: (...args) => { this.handleSelectAll(...args); },
			type:  this.state.gridType=== 'multiple' ? 'checkbox' : 'radio'
		}
	}
	handleCancel() {
		this.setState({ visible: false, clearForm: true, selected: [] });
		const {cleanupCategory} = this.props.actions;
		cleanupCategory();
	}

	handleQuery(oCondition) {
		const queryCategory = this.props.actions.queryCategory;
		// this.state.oCondition = oCondition;
		// this.state.pagination.current = 1;
		this.setState({
			oCondition,
			pagination: {
				...this.state.pagination,
				current: 1
			}
		});

		queryCategory({
			...oCondition,
			pageSize: this.state.pagination.pageSize,
			currentPage: 0  
		});
	}

	handleGridChange(pagin){
	
		const queryCategory = this.props.actions.queryCategory;
		queryCategory({
			...this.state.oCondition,
			pageSize: pagin.pageSize,
			currentPage: pagin.current - 1
		});

		// this.state.pagination = pagin;
		this.setState({pagination:pagin});
	}
	
	handleSelect(record, selected, selectedRows){

		let _modeKey = this.state.gridType;
		if (_modeKey === 'multiple') {
			if (selected) {
				var aSe = this.state.selected;
				aSe.push(record);
				this.setState({
					selected: aSe
				});
			} else {
				var aSe = this.state.selected;
				aSe.splice(aSe.findIndex(item => item.key === record.key), 1);
				this.setState({
					selected: aSe
				});
			}
		} else {
			if (selected) {
				this.setState({
					selected: [record]
				});
			}
		}
	}

	handleSelectAll(selected, selectedRows, changeRows){

		if (selected) {
			var aSe = [...this.state.selected, ...changeRows];
			this.setState({
				selected: aSe
			});
		} else {
			var aSe = this.state.selected;
			var aSelected = aSe.filter(item => changeRows.findIndex(row => row.key === item.key) < 0);
			this.setState({
				selected: aSelected
			});
		}
	}
	handleCloseTag(key){

		var aSe = this.state.selected;
		aSe.splice(aSe.findIndex(item => item.key === key), 1);
		this.setState({
			selected: aSe
		});
	}

	renderTag(){

		if (this.state.selected && this.state.selected.length > 0) {
			return this.state.selected.map(claz => {
				return (
					<Tag closable color="blue" key={claz.key} onClose={() => { this.handleCloseTag(claz.key) } }>{claz.name&&claz.name.length>0?claz.name:claz.key}</Tag>
				);
			});
		} else {
			return false;
		}
	}
	handleClearTags(){
		this.setState({
			selected: []
		});
	}

	handleSubmit(){
		this.state.confirm.call(null, this.state.selected);
		this.handleCancel();
	}

	renderDialogContent(){

        // prepare data when state is changed
		if (this.state.gridType === "multiple") {
			this.multiSelect = "block";
			this.rowSelection.type = 'checkbox';
		} else if (this.state.gridType === 'single') {
			this.multiSelect = "none";
			this.rowSelection.type =   'radio';
		}

		return (
			<div>
				<QueryForm handleQuery={(...args) => { this.handleQuery(...args)}} shouldClear={this.state.clearForm} 
					renderFormContent={(...args)=>{return this.renderFormContent(...args)}}/>
				<div style={{ display: this.multiSelect }} className="multi-select-dialog field-blue p-xs m-b-s">
					<Row>
						<Col span={23}>
							{this.renderTag()}
						</Col>
						<Col span={1}>
							<a onClick={() => { this.handleClearTags() } }>清空</a>
						</Col>
					</Row>
				</div>
			</div>
		);
	}

}