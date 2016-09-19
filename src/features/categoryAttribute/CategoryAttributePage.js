import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { ProductGrid } from './ProductGrid';
import { ModalDialog} from './ModalDialog';
import { Row, Col, Tree,Input,Select, Cascader, Button,Table, Popconfirm, message, Radio,DatePicker, Form } from 'antd';
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group,
FormItem = Form.Item,
Option = Select.Option;
const options = [{
	value: 'zhejiang',
	label: '浙江',
	children: [{
		value: 'hangzhou',
		label: '杭州',
		children: [{
			value: 'xihu',
			label: '西湖',
		}],
	}],
}, {
	value: 'jiangsu',
	label: '江苏',
	children: [{
		value: 'nanjing',
		label: '南京',
		children: [{
			value: 'zhonghuamen',
			label: '中华门',
		}],
	}],
}];

const columns = [
	{
		title: '渠道',
		dataIndex: 'channel',
	},

	{
		title: '属性组名称',
		dataIndex: 'attributeGroup',
	}, 

	{
		title: '属性编码',
		dataIndex: 'attrbuteCode',
	},

	{
		title: '属性名称',
		dataIndex: 'attributeName',
	},

	{
		title: '属性类型',
		dataIndex: 'attributeType',
	} ,

	{
		title: '可否为空',
		dataIndex: 'empty',
	}, 

	{
		title: '创建时间',
		dataIndex: 'createTime',
	}, 

	{
		title: '生效状态',
		dataIndex: 'effect',
	}, 

	{
		title: '操作',
		dataIndex: 'action',
		render:(text, record)=>{

			function confirm(){
				message.success(`确认删除 ${record.attrbuteCode}`);	
			}

			function cancel(){
				message.error(`取消了删除 ${record.attrbuteCode}`);				
			}

			return	(
				<span>
				<Popconfirm title={`确定要删除 吗？`} onConfirm={confirm} onCancel={cancel}>
				<a href="#" style={{'marginRight': '5px'}}>删除</a>
				</Popconfirm>
				<Button type="primary" onClick={ ()=>{ CategoryAttributePage.modal.setState({
					title : '审计',
					visible: true,
					confirm: ()=>{ console.log("yes")}		

				}); } } >审核</Button>
				</span>
			);	
		}
	}
];

class CategoryAttributePage extends Component {
	static propTypes = {
		home: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,

	};

	handleChange(e){
		console.table(e);  
	}

	onCascadeChange(e){

		console.log(e);

	}

	query(){
		const {queryAttribute} = this.props.actions;
		queryAttribute();
	}


	render() {
		return (
			<div  className= "main-area category-attr">
				<div className="attr-tree-l">
		          <Tree>
		            <TreeNode title="空调" key="0-0">
		              <TreeNode title="分体空调" key="0-0-0" >
		                <TreeNode title="挂机" key="0-0-0-0" />
		                <TreeNode title="柜机" key="0-0-0-1" />
		                <TreeNode title="吸顶机" key="0-0-0-2" />
		              </TreeNode>
		              <TreeNode title="中央空调" key="0-0-1">
		                <TreeNode title="家用中央空调" key="0-0-1-0" />
		                <TreeNode title="商用中央空调" key="0-0-1-1" />
		                <TreeNode title="辅材" key="0-0-1-2" />
		                <TreeNode title="新风系统" key="0-0-1-3" />
		              </TreeNode>
		              <TreeNode title="风幕机" key="0-0-2" >
		              </TreeNode>
		            </TreeNode>
		          </Tree>
		        </div>
		        <div className="search-field-r">
					<Form horizontal className="ant-advanced-search-form">				
						<Row>
							<Col span={8}>
								<FormItem
								label="渠道"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<Select size="default" labelInValue optionFilterProp="children" notFoundContent="无法找到"
									onChange={this.handleChange}>
									<Option value="all">所有渠道</Option>
									<Option value="five">五星享货</Option>
									<Option value="offline">线下</Option>
									<Option value="gh">工行</Option>
									<Option value="jh">建行</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
								label="地区"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<Cascader size="default" options={options} onChange={this.onCascadeChange} placeholder=""/>
								</FormItem>	
							</Col>
							<Col span={8}>
								<FormItem
								label="是否销售属性"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<Select size="default" labelInValue optionFilterProp="children" notFoundContent="无法找到"
									onChange={this.handleChange}>
									<Option value="y">是</Option>
									<Option value="n">否</Option>
									</Select>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem
								label="属性类型"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<Select size="default" labelInValue optionFilterProp="children" notFoundContent="无法找到"
									onChange={this.handleChange}>
									<Option value="st">短文本</Option>
									<Option value="dd">下拉框</Option>
									</Select>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
								label="可否为空"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<RadioGroup size="default" onChange={this.handleChange} >
									<Radio key="a" value={1}>是</Radio>
									<Radio key="b" value={2}>否</Radio>
									</RadioGroup>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
								label="日期"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<DatePicker size="default" onChange={this.handleChange} />
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem
								label="属性组名称"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
								<Input size="default"/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
									label="属性名称"
									labelCol={{ span: 9 }}
									wrapperCol={{ span: 15 }}>
									<Input size="default"/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
								label="属性编码"
								labelCol={{ span: 9 }}
								wrapperCol={{ span: 15 }}>
									<Input size="default"/>
								</FormItem>
							</Col>
						</Row>
						<Row className="m-b-m">
							<Col span={2} offset={20}>
								<Button type="primary" onClick={()=>{this.query()}}>查询</Button>
							</Col>
							<Col span={2}>
								<Button type="ghost">重置</Button>
							</Col>
						</Row>
					</Form>
					<Row>					
						<ProductGrid aDataSource={ this.props.home.aData} aColumn={columns}></ProductGrid>
					</Row>
					<ModalDialog ref={(ref) => CategoryAttributePage.modal= ref}/>
					
				</div>
				<div className="clr"></div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		home: state.home,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...actions }, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryAttributePage);

