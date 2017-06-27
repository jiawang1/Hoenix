import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, Select, Button, Modal, Form, Table, Radio, Tag } from 'antd';
import { renderDropDown } from './helper.js';
import { getType } from './../../common/helper.js';
import { messageBox } from './../../components/messageBox';

const FormItem = Form.Item,
	RadioGroup = Radio.Group,
	Option = Select.Option;

const columnsAttr = [{
	title: '渠道',
	dataIndex: 'channel',
	width: '150px',
}, {
	title: '属性名称',
	dataIndex: 'name',
	width: '150px',
}, {
	title: '属性编码',
	dataIndex: 'code',
	width: '120px',
}, {
	title: '属性类型',
	dataIndex: 'type',
	width: '100px',
}, {
	title: '是否销售属性',
	dataIndex: 'salesFlag',
	width: '100px',
}, {
	title: '可否为空',
	dataIndex: 'emptyAllowed',
}, {
	title: '创建时间',
	dataIndex: 'creationTime',
}];

const formItemLayout = {
	labelCol: { span: 9 },
	wrapperCol: { span: 15 },
};

class QueryForm extends Component {

	handleReset() {
		this.props.form.resetFields();
	}

	componentWillReceiveProps(next) {
		if (next.shouldClear) {
			this.handleReset();
		}
	}

	handleSubmit() {
		var props = this.props.form.getFieldsValue();
		console.log(props);

		Object.keys(props).map((key) => {
			if (getType(props[key]) === 'Object') {
				if (props[key]['key'] !== null && props[key]['key'] !== undefined) {
					props[key] = props[key]['key'];
				}
			}
		});
		const handleQuery = this.props.handleQuery;
		handleQuery(props);
	}

	render() {
		const { getFieldProps } = this.props.form;

		return (
			<Form>
				<Row className="m-r-l">
					<Col span={8}>
						<FormItem label="渠道" {...formItemLayout}>
							<Select allowClear size="default" className="select-width"
								optionFilterProp="children"
								notFoundContent="暂无数据" {...getFieldProps('channel') } >
								{renderDropDown(this.props.pageMeta, 'channel')}
							</Select>
						</FormItem>
						<FormItem label="属性名称" {...formItemLayout}>
							<Input size="default" {...getFieldProps('attributeName') } />
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem label="属性编码" {...formItemLayout}>
							<Input size="default" {...getFieldProps('attributeCode') } />
						</FormItem>
						<FormItem label="属性类型" {...formItemLayout}>
							<Select allowClear size="default" className="select-width"
								optionFilterProp="children"
								notFoundContent="暂无数据" {...getFieldProps('type') }>
								{renderDropDown(this.props.pageMeta, 'type')}
							</Select>
						</FormItem>
					</Col>
					<Col span={8} className="search-price">
						<FormItem label="是否销售属性	" {...formItemLayout}>
							<RadioGroup {...getFieldProps('isSalesAttribute') }>
								<Radio key="a" value={true}>是</Radio>
								<Radio key="b" value={false}>否</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="可否为空" {...formItemLayout}>
							<RadioGroup {...getFieldProps('isEmpty') }>
								<Radio key="a" value={true}>是</Radio>
								<Radio key="b" value={false}>否</Radio>
							</RadioGroup>
						</FormItem>
					</Col>
				</Row>
				<Row className="m-b-s">
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

export class CategoryAttributeEditDialog extends Component {

	constructor() {
		super();
		this.state = {
			visible: false,
			confirmLoading: false,
			title: '',
			key: '',
			categoryCode: '',
			selectedAttributes: [],
			selectedClassifications: [],
			clearForm: false,
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0
			}
		};
	}

	handleBind() {
		const { bindCategoryAttribute } = this.props;
		let categoryCode = this.props.categoryCode;
		let selectedClassifications = this.state.selectedClassifications.filter(c => c.auditStatusCode === "VALID");
		let selectedAttributes = this.state.selectedAttributes.filter(a => a.auditStatusCode === "VALID");
		if (!selectedClassifications || selectedClassifications.length == 0) {
			messageBox.error({ message: "未选择审核通过的关联属性组" });
			return;
		}

		if (!selectedAttributes || selectedAttributes.length == 0) {
			messageBox.error({ message: "未选择审核通过的关联属性" });
			return;
		}

		bindCategoryAttribute(categoryCode, selectedClassifications, selectedAttributes).then(data => {
			this.handleCancel();
		});
	}

	handleCancel() {

		this.setState({ visible: false, clearForm: true, selectedAttributes: [], selectedClassifications: [] });
		const cleanUpCategoryAtributes = this.props.cleanUpCategoryAtributes;

		cleanUpCategoryAtributes();
	}

	handleQuery(oCondition) {

		const { queryAttribute } = this.props;

		this.state.oCondition = oCondition;
		this.state.pagination.current = 1;

		let param = {
			...oCondition,
			//categoryCode: this.props.categoryCode,
			pageSize: this.state.pagination.pageSize,
			currentPage: 0
		};

		queryAttribute()(param);
	}


	handleSelect(record, selected, selectedRows) {

		if (selected) {
			var selAttributes = this.state.selectedAttributes;
			selAttributes.push(record);
			this.setState({
				selectedAttributes: selAttributes
			});
		} else {
			var selAttributes = this.state.selectedAttributes;
			selAttributes.splice(selAttributes.findIndex(item => item.code === record.code), 1);
			this.setState({
				selectedAttributes: selAttributes
			});
		}
	}

	handleSelectAll(selected, selectedRows, changeRows) {

		if (selected) {
			var selAttributes = [...this.state.selectedAttributes, ...changeRows];
			this.setState({
				selectedAttributes: selAttributes
			});
		} else {
			var selAttributes = this.state.selectedAttributes;

			var aSelected = selAttributes.filter(item => changeRows.findIndex(row => row.code === item.code) < 0);
			this.setState({
				selectedAttributes: aSelected
			});
		}
	}

	handleGridChange(pagin) {

		const queryAttribute = this.props.queryAttribute;

		let param = {
			...this.state.oCondition,
			categoryCode: this.props.categoryCode,
			pageSize: this.state.pagination.pageSize,
			currentPage: pagin.current - 1
		};
		queryAttribute()(param);

		this.state.pagination = pagin;
	}

	handClassificationChange(value) {
		this.setState({
			selectedClassifications: value
		});
	}


	handleCloseTag(code) {

		var selAttributes = this.state.selectedAttributes;
		selAttributes.splice(selAttributes.findIndex(item => item.code === code), 1);
		this.setState({
			selectedAttributes: selAttributes
		});
	}

	renderTag() {

		if (this.state.selectedAttributes && this.state.selectedAttributes.length > 0) {
			return this.state.selectedAttributes.map(claz => {
				return (
					<Tag closable color="blue" key={claz.code} onClose={() => { this.handleCloseTag(claz.code) }}>{claz.name}</Tag>
				);
			});
		} else {
			return false;
		}
	}

	handleClearTags() {
		this.setState({
			selectedAttributes: []
		});

	}


	render() {
		const { title, visible } = this.props;

		const { pageMeta } = this.props;
		const { treeData, pagedAttributeData } = this.props;
		var attributeData = pagedAttributeData.aData;

		if (attributeData && attributeData.length > 0) {
			this.state.pagination.total = pagedAttributeData.pagination.totalNumberOfResults;
		} else {
			attributeData = [];
		}

		const rowSelection = {

			onSelect: (...args) => { this.handleSelect(...args); },
			selectedRowKeys: this.state.selectedAttributes.map(item => item.code),
			onSelectAll: (...args) => { this.handleSelectAll(...args); }

		};

		let classifications = [];
		if (treeData) {
			treeData.forEach(classification => classifications.push(<Option key={classification.code}>{classification.name}</Option>));
		}


		return (
			<Modal maskClosable={false} title={this.state.title}
				width="1000px"
				className="modal-l"
				visible={this.state.visible}
				onOk={() => this.handleBind()}
				confirmLoading={this.state.confirmLoading}
				onCancel={() => { this.handleCancel() }}>


				<QueryForm pageMeta={pageMeta}
					handleQuery={(...args) => { this.handleQuery(...args) }}
					shouldClear={this.state.clearForm} />

				<Form>
					<Row className="m-r-l">
						<Col span={8}>
							<FormItem label="关联属性组" {...formItemLayout}>
								<Select allowClear multiple size="default"
									placeholder="请选择要关联的属性组"
									optionFilterProp="children"
									notFoundContent="暂无数据"
									value={this.state.selectedClassifications}
									onChange={(...args) => { this.handClassificationChange(...args) }}>
									{classifications}
								</Select>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<div className="multi-select-dialog field-blue p-xs m-b-s">
					<Row>
						<Col span={23}>
							{this.renderTag()}
						</Col>
						<Col span={1}>
							<a onClick={() => { this.handleClearTags() }}>清空</a>
						</Col>
					</Row>
				</div>
				<Table className="table-size-dialog" size="small" scroll={{ y: 153 }}
					rowSelection={rowSelection}
					columns={columnsAttr}
					dataSource={attributeData}
					onChange={(...args) => { this.handleGridChange(...args) }}
					pagination={this.state.pagination} />
			</Modal>
		);

	}
}


