import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, Select, Button, Modal, Form, Table } from 'antd';


const FormItem = Form.Item,
	Option = Select.Option;

const columns = [{
	title: '渠道',
	dataIndex: 'channel',
}, {
	title: '属性组名称',
	dataIndex: 'name',
}, {
	title: '属性组编码',
	dataIndex: 'id',
}, {
	title: '创建时间',
	dataIndex: 'date'
}];
const data = [{
	key: '1',
	channel: '五星享购',
	name: '规格',
	id: '00000001',
	date: 'Wed Sep 21 2016 18:06:30',
}, {
	key: '2',
	channel: '五星享购',
	name: '功能',
	id: '00000002',
	date: 'Wed Sep 20 2016 09:08:36',
}, {
	key: '3',
	channel: '线下',
	name: '产品特色',
	id: '00000003',
	date: 'Wed Sep 20 2016 10:10:17',
}];


const rowSelection = {
	onChange(selectedRowKeys, selectedRows) {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	onSelect(record, selected, selectedRows) {
		console.log(record, selected, selectedRows);
	},
	onSelectAll(selected, selectedRows, changeRows) {
		console.log(selected, selectedRows, changeRows);
	},
};

export class CategoryAttributeDialog extends Component {

	constructor() {
		super();
		this.state = {
			visible: false,
			confirmLoading: false,
			title: '',
			confirm: null
		};
	}
	handleCancel() {
		this.setState({ visible: false });
	}
	render() {
		const { title, visible } = this.props;
		return (
			<Modal maskClosable={false} title={this.state.title}
				width="1000px"
				visible={this.state.visible}
				onOk={this.state.confirm}
				confirmLoading={this.state.confirmLoading}
				onCancel={() => { this.handleCancel() }}>
				<Form>
					<Row className="m-t-m m-r-l">
						<Col span={8}>
							<FormItem
								label="渠道"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
								<Select allowClear size="default" className="select-width">
									<Option value="five">五星享购</Option>
									<Option value="offline">线下</Option>
									<Option value="gh">工行</Option>
									<Option value="jh">建行</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem
								label="属性组名称"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
								<Input size="default" />
							</FormItem>
						</Col>
						<Col span={8} className="search-price">
							<FormItem
								label="属性组编码"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
								<Input size="default" />
							</FormItem>
						</Col>
					</Row>
					<Row className="m-b-m">
						<Col span={12} offset={12} className="p-r-l multi-buttons">
							<Button type="primary">查询</Button>
							<Button className="m-l-m" type="ghost">重置</Button>
						</Col>
					</Row>
				</Form>
				<Table className="table-size-dialog" size="small" scroll={{ y: 153 }} rowSelection={rowSelection} columns={columns} dataSource={data} />
			</Modal>
		);
	}
}


