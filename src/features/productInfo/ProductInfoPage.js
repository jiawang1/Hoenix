import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { ProductGrid } from './ProductGrid';
import { Form, Select, Input, Row, Col, Button, Radio, Collapse, Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

const options = [{
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
    }],
  }, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
      value: 'nanjing',
      label: '南京',
    }],
  }];

function handleChange(value) {
  console.log(`selected ${value}`);
}

function callback(key) {
  console.log(key);
}


const columns = [
    {
      title: '商家',
      dataIndex: '1',
    },

    {
      title: '编码',
      dataIndex: '2',
    }, 

    {
      title: '名称',
      dataIndex: '3',
    },

    {
      title: '品牌',
      dataIndex: '4',
    },

    {
      title: '商品阶段',
      dataIndex: '5',
    } ,

    {
      title: '所属分类',
      dataIndex: '6',
    }, 

    {
      title: '渠道',
      dataIndex: '7',
    }, 

    {
      title: '区域',
      dataIndex: '8',
    }, 

    {
      title: '门店',
      dataIndex: '9',
    }, 

    {
      title: '特殊机型',
      dataIndex: '10',
    }, 

    {
      title: '成本价',
      dataIndex: '11',
    }, 

    {
      title: '供价',
      dataIndex: '12',
    }, 

    {
      title: '挂牌价',
      dataIndex: '13',
    }, 

    {
      title: '组货状态',
      dataIndex: '14',
    }, 

    {
      title: '供应商编码',
      dataIndex: '15',
    }, 

    {
      title: '供应商名称',
      dataIndex: '16',
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

        return  (
          <span>
          <Popconfirm title={`确定要删除 吗？`} onConfirm={confirm} onCancel={cancel}>
          <a href="#" >查看</a>
          </Popconfirm>
          </span>
        );  
      }
    }
  ];

export class ProductInfoPage extends Component {
  static propTypes = {
    productInfo: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  onCascadeChange(e){
    console.log(e);
  }

  render() {
    return (
      <div className="main-area product-info">
        <Form horizontal className="ant-advanced-search-form">
          <Row>
            <Col span={6}>
              <FormItem
                label="商品编码"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
              <FormItem
                label="品牌"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
              <FormItem
                label="商品阶段"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Select size="default" onChange={handleChange}>
                  <Option value="o1">新品</Option>
                  <Option value="o2">成长</Option>
                  <Option value="o3">成熟</Option>
                  <Option value="o4">衰退</Option>
                  <Option value="o5">淘汰</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商品名称"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
              <FormItem
                label="商家"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Select showSearch size="default" optionFilterProp="children" notFoundContent="无法找到" onChange={handleChange}>
                  <Option value="dynamic">动态获取</Option>
                  <Option value="other">其他</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="供应商"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
              <FormItem
                label="型号"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="工业分类"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              </FormItem>
              <FormItem
                label="虚拟商品"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <RadioGroup>
                  <Radio key="a" value={1}>是</Radio>
                  <Radio key="b" value={2}>否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <h6>价格</h6>    
          <Row>
            <Col span={6}> 
              <FormItem
                label="工业分类"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Select size="default" onChange={handleChange}>
                  <Option value="five">五星享货</Option>
                  <Option value="offline">线下</Option>
                  <Option value="gh">工行</Option>
                  <Option value="jh">建行</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="区域"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Cascader options={options} onChange={this.onCascadeChange} placeholder=""/>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="门店"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Select size="default" onChange={handleChange}>
                  <Option value="o1">中央路店</Option>
                  <Option value="o2">山西路店</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={6} className="search-price">              
              <FormItem
                label="价格"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}>
                <Input size="default" />
              <label className="label">－</label>
              <Input size="default" />
              </FormItem>
          </Col>
          </Row> 
          <Collapse onChange={callback} accordion>
            <Panel header={'分类属性'} key="1">               
              <Row>
                <Col span={6}>
                  <FormItem
                    label="属性一"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <Input size="default" />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="属性二"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <Input size="default" />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="属性三"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <Input size="default" />
                  </FormItem>
                </Col>
                <Col span={6}>
                </Col>
              </Row>                
            </Panel>
          </Collapse>         
          <Row className="m-b-m">
            <Col span={2} offset={19}> 
              <Button type="primary">查询</Button>
            </Col>
            <Col span={3}>
              <Button type="ghost">重置</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <ProductGrid aColumn={columns}></ProductGrid>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    productInfo: state.productInfo,
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
)(ProductInfoPage);
