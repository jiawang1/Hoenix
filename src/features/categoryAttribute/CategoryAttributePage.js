import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { ProductGrid } from './ProductGrid';
import { ModalDialog} from './ModalDialog';
import { Row, Col, Input,Select, Cascader, Button,Table, Popconfirm, message, Radio,DatePicker } from 'antd';

const RadioGroup = Radio.Group;

	const Option = Select.Option;
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
		<div  className= "largePaddingTop largeMarginLeft largeMarginRight mainField">
			<Row gutter={16} className="largeMarginBottom">
				<Col span={8}>  
					<label className="smallLabel">渠道： </label>
					<Select labelInValue style={{ width: 200 }} optionFilterProp="children" notFoundContent="无法找到"
					onChange={this.handleChange}>
						<Option value="all">所有渠道</Option>
						<Option value="five">五星享货</Option>
						<Option value="offline">线下</Option>
						<Option value="gh">工行</Option>
						<Option value="jh">建行</Option>
					</Select>
				</Col>
				<Col span={8}> 
					<label className="smallLabel">地区： </label>
					<Cascader options={options} onChange={this.onCascadeChange} placeholder="" style={{ width: 200 }}/>
				</Col>
				<Col span={8}>
					<label className="smallLabel">是否销售属性： </label>
						<Select labelInValue style={{ width: 200 }} optionFilterProp="children" notFoundContent="无法找到"
					onChange={this.handleChange}>
						<Option value="y">是</Option>
						<Option value="n">否</Option>
					</Select>
				</Col>
			</Row>

			<Row gutter={16} className="largeMarginBottom">
				<Col span={8}>
					<label className="smallLabel">属性类型： </label>
						<Select labelInValue style={{ width: 200 }} optionFilterProp="children" notFoundContent="无法找到"
					onChange={this.handleChange}>
						<Option value="st">短文本</Option>
						<Option value="dd">下拉框</Option>
					</Select>
				</Col>

				<Col span={8}>
					<label className="smallLabel">可否为空：</label>
					<RadioGroup onChange={this.handleChange} >
						<Radio key="a" value={1}>是</Radio>
						<Radio key="b" value={2}>否</Radio>
					</RadioGroup>
				</Col>
				<Col span={8}>
					<label className="smallLabel">日期： </label>
					<DatePicker onChange={this.handleChange} style={{ width: 200 }}/>
				</Col>
			</Row>

			<Row gutter={16} className="largeMarginBottom">
				<Col span={8}>
					<label className="smallLabel">属性组名称：</label>
					<Input style={{ width: 200 }}/>
				</Col>
				<Col span={8}>
					<label className="smallLabel">属性名称：</label>
					<Input style={{ width: 200 }}/>
				</Col>
				<Col span={8}>
					<label className="smallLabel">属性编码：</label>
					<Input style={{ width: 200 }}/>
				</Col>
			</Row>
			<Row gutter={16} className="largeMarginBottom">

				<Col span={2} offset={19}> 
					<Button type="primary" onClick={()=>{this.query()}}>查询</Button>
				</Col>
				<Col span={3}>
					<Button type="ghost">重置</Button>
				</Col>
			</Row>
			<Row gutter={16}>
				<ProductGrid aDataSource={ this.props.home.aData} aColumn={columns}></ProductGrid>
				
			</Row>
				<ModalDialog ref={(ref) => CategoryAttributePage.modal= ref}/>
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

