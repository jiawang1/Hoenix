import {Row, Col, Input,Select, Cascader, Button, Radio,DatePicker, Form} from 'antd';
import React, { Component, PropTypes } from 'react';
import {getType} from './../../common/helper.js';
import {renderDropDown} from './helper.js';


const RadioGroup = Radio.Group,
	FormItem = Form.Item,
		Option = Select.Option;

class QueryForm extends Component{

	handleSubmit(){

		var props = this.props.form.getFieldsValue();
		Object.keys(props).map((key)=>{
			if(getType(props[key]) === 'Object'){
				if(props[key]['key'] !== null && props[key]['key'] !== undefined ){
					props[key] = props[key]['key'];
				}
			}
		});

		this.props.query(props);

	}

	handleReset(){
		this.props.form.resetFields();
	}

	render(){

		const { getFieldProps } = this.props.form;
		const {pageMeta} = this.props;
		const formItemLayout = {
			labelCol: { span: 9 },
			wrapperCol: { span: 15 },
		};
	return	(
		<Form horizontal>
			<Row className="m-r-l">
				<Col span={8}>
					<FormItem label="渠道"
						{...formItemLayout} >
						<Select allowClear size="default" labelInValue  optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('channel')}
						>
							{  renderDropDown(pageMeta, 'channel') }
						</Select>
					</FormItem>
				</Col>

				<Col span={8}>
					<FormItem
						label="属性组名称"
						{...formItemLayout}>
						<Input size="default" {...getFieldProps('attributeGroupName')}/>
					</FormItem>
				</Col>

				<Col span={8}>
					<FormItem label="是否销售属性"
						{...formItemLayout}>
						<RadioGroup {...getFieldProps('isSalesAttribute')} >
							<Radio key="a" value={true}>是</Radio>
							<Radio key="b" value={false}>否</Radio>
						</RadioGroup>
					</FormItem>
				</Col>
			</Row>

			<Row  className="m-r-l">
				<Col span={8}>
					<FormItem
						label="属性类型"
						{...formItemLayout}>
						<Select allowClear size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('type')}
						>
							{  renderDropDown(pageMeta, 'type') }
						</Select>
					</FormItem>
				</Col>

				<Col span={8}>
					<FormItem label="属性名称" {...formItemLayout}>
						<Input  size="default" {...getFieldProps('attributeName')}  />
					</FormItem>

				</Col>

				<Col span={8}>
					<FormItem
						label="可否为空"
						{...formItemLayout}>

						<RadioGroup {...getFieldProps('isEmpty')} >
							<Radio key="a" value={true}>是</Radio>
							<Radio key="b" value={false}>否</Radio>
						</RadioGroup>
					</FormItem>

				</Col>
			</Row>

			<Row className="m-r-l">
				<Col span={8}>
					<FormItem label="属性编码" {...formItemLayout}>
						<Input  size="default" {...getFieldProps('attributeCode')}  />
					</FormItem>
				</Col>
			</Row>
			<Row className="m-b-m">
				<Col span={12} offset={12} className="p-r-l multi-buttons">
					<Button type="primary" onClick={()=>this.handleSubmit() } >查询</Button>
					<Button className="m-l-m" type="ghost" onClick={ ()=>this.handleReset() }>重置</Button>
				</Col>
			</Row>
		</Form>);
		}
	}
QueryForm.propTypes ={
	query :  PropTypes.func.isRequired,

};

QueryForm =Form.create()(QueryForm);
export {QueryForm};

