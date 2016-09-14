import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Row, Col, Tree, Input, Button, Form} from 'antd';
import classNames from 'classnames';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const InputGroup = Input.Group;


export class DefaultPage extends Component {
  static propTypes = {
    stockLevel: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };


  
    
      
  
  
  render() {

    return (
      <div className="stock-level main-area">
        <Row gutter={20}>
          <Col span={4} className="attr-tree p-lr-m">          
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
          </Col>         
          <Col span={6}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>              
          </Col>
        </Row> 
        <Row gutter={16}>
          <Col offset={4} span={6}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              label="商品编码"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}>
              <Input size="default" />
            </FormItem>              
          </Col>
        </Row>          
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stockLevel: state.stockLevel,
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
)(DefaultPage);
