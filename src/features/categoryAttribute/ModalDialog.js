import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input,Select, Button,Modal } from 'antd';

export class ModalDialog extends Component{

	constructor(){
		super();
		this.state = {
			visible: false,
			confirmLoading: false,
			title: '',
			confirm: null
		};
	}
	handleCancel(){
		this.setState({visible: false});
	}
	render(){
		const {title,visible } = this.props;	
		return (
			<Modal title={this.state.title}
			visible={this.state.visible }
			onOk={this.state.confirm}
			confirmLoading={this.state.confirmLoading}
			onCancel={()=>{this.handleCancel()}}>
			<Row gutter={16}>
			<Col span={8}>  
			<Select labelInValue style={{ width: 200 }} placeholder="选择渠道" optionFilterProp="children" notFoundContent="无法找到"
			onChange={this.handleChange}>
			<Option value="all">所有渠道</Option>
			<Option value="five">五星享货</Option>
			<Option value="offline">线下</Option>
			<Option value="gh">工行</Option>
			<Option value="jh">建行</Option>
			</Select>
			</Col>
			<Col span={8}>
			<Select labelInValue style={{ width: 200 }} placeholder="是否销售属性" optionFilterProp="children" notFoundContent="无法找到"
			onChange={this.handleChange}>
			<Option value="y">是</Option>
			<Option value="n">否</Option>
			</Select>

			</Col>
			</Row>
			</Modal>
		);
	}
}


