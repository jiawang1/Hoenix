import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './editActions';
import { Row, Col, Tree, Input,Select, Cascader, Button,Table, Popconfirm, message, Radio, Form, Card, Modal} from 'antd';
import { Link} from 'react-router';
import {AttributeTree} from './AttributeTree.js';
import { CategoryAttributeEditDialog} from './CategoryAttributeEditDialog';
import CategoryClassificationDialog from './CategoryClassificationDialog.js';
import {retrievePageMeta, queryCatetoryAttribute, bindCategoryAttribute} from './actions';


class CategoryAttributeEditPage extends Component {
  static propTypes = {
	  // CategoryAttributeEdit: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount(){
    
	  var { code, aCode } = this.props.location.query;
	  var {getCategoryClassification,retrievePageMeta } = this.props.actions;
	  var {attributePageMeta} =  this.props.CategoryAttributeEdit;
	  getCategoryClassification(code, aCode); 
	  if(!attributePageMeta){
		  retrievePageMeta();

	  }
  }

  componentWillUnmount(){
  
	//should remove cache data from store
	var { cleanupClassification } =  this.props.actions;
	cleanupClassification();
  }

  selectedTrigger(oTarget){

	  var {updateCurrentClassification} = this.props.actions;
	  
	  updateCurrentClassification(oTarget);
	  
  }
  findExpandKey (treeData, _key){

		 var oTree=	treeData?treeData.find(data=>{
			
				return data.features?data.features.some(att=>{
				
					return att.code === _key;
				}):false;
		 }): null;

		 return oTree?oTree.code:"";

	}

	renderPageContent(){
	
		var {current} = this.props.CategoryAttributeEdit;
		
		if(!current){
			return false;

		}else if(current.cType === "A"){
			return (

        <Card title={`属性：${current.name}`} extra={<Button type="dashed" onClick={(...args)=>{this.handleUnlinkClass(...args)}}>删除</Button>}>
            <Row>
              <Col span={12}>            
                <p>渠道：{current.channel?current.channel.name:""}</p>
                <p>属性名称：{current.name}</p>
                <p>属性编码：{current.code}</p>
                <p>属性顺序：{current.position}</p>
                <p>可否为空：{current.emptyAllowed}</p>
              </Col>
              <Col span={12}>
                <p>是否是销售属性：{current.salesFlag}</p>
                <p>属性类型：{current.type}</p>
                <p>属性默认值：{current.defaultValue}</p>
                <p>属性可选值：{Object.keys(current.featureValues).map(key=>{return current.featureValues[key].value;}).join(",")}</p>
                <p>所属属性组：{
                  Object.keys(current.classification).map(key=>{  return  current.classification[key]}).join(",")
                }</p>
              </Col>
            </Row>
        </Card>
			);
		}else if(current.cType === "C"){
			return (
				<Card title={`属性组：${current.name}`} extra={<Button type="dashed" onClick={(...args)=>{this.handleUnlinkClass(...args)}}>删除</Button>}>
          <p>渠道：{current.channel?current.channel.name:""}</p>
          <p>属性组名称：{current.name}</p>
          <p>属性组编码：{current.code}</p>
          <p>属性组顺序：{current.position}</p>
        </Card>
			);
		}
	}

	handleUnlinkClass(args){

		var {unlinkClassification} = this.props.actions;
		var {current} = this.props.CategoryAttributeEdit;
		var {code} = this.props.location.query;

		unlinkClassification(current, code);
	}

  render() {

	  var {treeData, current, pagedCategoryAttrData} = this.props.CategoryAttributeEdit;
	  var { code, name, aCode } = this.props.location.query;
	  var displayInfo = {
		  rootCode:code, 
		  rootName:name,
		  displayCode: current?current.code:aCode,
		  expendKey:this.findExpandKey(treeData,aCode )

	  };
	  var {attributePageMeta} = this.props.CategoryAttributeEdit;
    var {queryCatetoryAttribute, cleanUpCategoryAtributes, bindCategoryAttribute} = this.props.actions;
    
    return (
      <div className="main-area with-return category-attribute-edit">
        <Link to='categoryAttribute'>
          <Button className="return-btn" icon="left" size="small" type="ghost">返回</Button>
        </Link>
         <div className="field-c">
        <div className="field-l-tree">
          <AttributeTree selectedTrigger={(...args) => this.selectedTrigger(...args)} treeData={treeData}
            displayInfo={displayInfo} />
        </div>
        <div className="field-r-tree">
          <Row className="m-b-m m-t-s">
            <Col span={3}>
              <CategoryClassificationDialog pageMeta={attributePageMeta} categoryCode={code} />
            </Col>
            <Col span={3}>
              <Button type="ghost" onClick={() => {
                CategoryAttributeEditPage.attribute.setState({
                  title: '关联属性',
                  key: { code },
                  visible: true,
                  clearForm: false,
                  confirm: () => { console.log("yes") }

                });
              } } >关联属性</Button>
            </Col>
          </Row>
          <Row className="m-b-s">
            {
              this.renderPageContent()
            }
          </Row>
          <CategoryAttributeEditDialog pageMeta={attributePageMeta} pagedAttributeData={pagedCategoryAttrData} 
            categoryCode={code} treeData={treeData} 
            queryAttribute={queryCatetoryAttribute}
            cleanUpCategoryAtributes={cleanUpCategoryAtributes} 
            bindCategoryAttribute={bindCategoryAttribute} 
            ref={(ref) => CategoryAttributeEditPage.attribute= ref}/>
        </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    CategoryAttributeEdit: state.home,
  };
}

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...actions, retrievePageMeta:retrievePageMeta, queryCatetoryAttribute:queryCatetoryAttribute }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryAttributeEditPage);
