import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Button, Collapse, Row, Col} from 'antd';
const Panel = Collapse.Panel;

function callback(key) {
  console.log(key);
}

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleAddOne = ::this.handleAddOne;
    this.handleReset = ::this.handleReset;
  }

  handleAddOne() {
    this.props.actions.demoCount();
  }

  handleReset() {
    this.props.actions.resetCount();
  }

  render() {
    return (
      <div className="main-area home-default-page">
        <h5>Welcome to Hoenix project!</h5>
        <p>该项目应用了<a href="http://ant.design/" target="blank">Ant Design</a>的前端框架。Ant Design 采用 
        <a href="https://facebook.github.io/react/" target="blank">React</a> 封装了一套丰富、灵活、实用的基础组件，可以为业务产品提供强有力的设计支持。</p>
        <p>想了解Ant Design的组件请在<a href="http://ant.design/docs/react/introduce" target="blank">Ant Design</a>页面上方搜索。</p>
        <p>以下是项目前端的开发指南和规范：</p>
        <Row gutter={20}>
          <Col span={12}>
            <h5 className="m-tb-s">js 规范：</h5>
            <Collapse defaultActiveKey={['1']} onChange={callback}>
              <Panel header="js文件结构" key="1">
                <p>每个页面对应src/features下面的一个单独的文件夹。该初始文件夹中包涵：</p>
                <ul>
                  <li>actions.js：</li>
                  <li>constants.js：</li>
                  <li>index.js：</li>
                  <li>reducer.js：</li>
                  <li>route.js：</li>
                  <li>selectors.js：</li>
                  <li>XxxPage.js：页面主体</li>
                  <li>XxxPage.less：页面上独有的css</li>
                  <li>style.less：定义该页面所有引用的less文件</li>
                </ul>
              </Panel>
              <Panel header="js命名规则" key="2">
                <p>页面文件夹以小驼峰法命名，例如：分类属性管理 categoryAttribute   商品信息查询  productInfo。</p>
                <p>页面主体的js文件以大驼峰法命名，以“Page”结尾，例如：分类属性管理 CategoryAttributePage   商品信息查询  ProductInfoPage。</p>
                <p>页面组件的js文件以大驼峰法命名，gird以“Grid”结尾，例如：ProductGrid.js；dialog以“Dialog”结尾，例如：AttributeDialog。</p>
              </Panel>
              <Panel header="js" key="3">
                <p>第三行</p>
              </Panel>
            </Collapse>
          </Col>
          <Col span={12}>
            <h5 className="m-tb-s">css 规范：</h5>
            <Collapse defaultActiveKey={['1']} onChange={callback}>
              <Panel header="css文件结构" key="1">
                <p>项目上css文件是层层引入的结构，可以修改的部分在features/和styles/下面。Ant Design中的所有css文件在node_modules/antd/lib/style下面，请勿修改这些文件，以免产品升级时样式覆盖的麻烦。如需修改组件自带的样式，请另写css覆盖。</p>
                <p>与features文件夹同级有styles文件夹，该文件夹中包含：</p>
                <ul>
                  <li>index.less：项目中所有引用的less文件，可以通过调整文件引入顺序实现覆盖。</li>
                  <li>base.less：所有要覆盖原组件样式的css写在这里</li>
                  <li>common.less</li>
                  <li>lesshat.less</li>
                  <li>reset.css</li>
                  <li>mixins.less：项目中UI通用规范</li>
                </ul>
                <p>在每个页面独有的文件夹中包含了style.less文件，定义了该页面所有引用的less文件，需用“@import './XxxPage.less';”语句将其引入。</p>
                <p>页面中的图片统一放在src/image下面。（ 需使用 &lt; img src={'{'}require("url"){'}'}&gt; 或css .class{'{'}background: url('url'){'{'}的方式将图片引入。</p>
              </Panel>
              <Panel header="css命名规则" key="2">
                <p>每个页面独有的less文件与页面主结构js文件命名相同，即XxxPage.less。</p>
                <p>less文件中类的命名方式以中划线分割单词，一些单词可以简写，例如“hn-prod-desc”即“hoenix-product-description”。</p>
                <p>全局变量的命名方式与类的命名相同，例如“@link-hover-decoration”。</p>
              </Panel>
              <Panel header="css全局变量" key="3">
                <p>css全局变量主要在mixins.less中定义，需注释变量含义。</p>
              </Panel>
              <Panel header="css页面布局" key="3">
                <p>1 典型查询条件＋结果页面</p>
                <ul>
                  <li>页面无纵向分隔情况：查询条件为四列显示Col span=6; 页面有纵向分隔情况（如工业分类树）：查询条件为三列显示Col span=8</li>
                  <li>每一个查询条件中labelCol span=9 wrapperCol span=15</li>
                  <li>查询和重置按钮Col span=2 查询按钮Col offset＝20</li>
                </ul>
              </Panel>
            </Collapse>
          </Col>
        </Row>
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
)(DefaultPage);

