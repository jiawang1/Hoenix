import { Row, Col, Input, Select, Cascader, Button, Radio, DatePicker, Form, Icon, Collapse } from 'antd';
import React, { Component, PropTypes } from 'react';
import { getType, renderNumberProps } from './../../common/helper.js';
import CategoryDialog from './../../components/CategoryDialog';
import BrandDialog from './../../components/BrandDialog';
import SupplierDialog from './../../components/SupplierDialog';
import { renderDropDown } from '../../common/helper.js';
import wrapState from '../../components/StateFulForm';
import {DYNAMIC_FORM_PREFIX} from './constants.js';


const RadioGroup = Radio.Group,
  FormItem = Form.Item,
  Option = Select.Option,
  Panel = Collapse.Panel;


class QueryForm extends Component {
  constructor() {
    super();
    this.state = {
      selSupplier: [],
      selCategory: [],
      selBrand: [],
      categoryAttribute: []
    }
  };

  componentDidMount() {
    const {setFieldsValue} = this.props.form;

    let {extraData} = this.props;
    if (extraData) {
      let {productCategoryCode, productCategoryName} = extraData;
      setFieldsValue({categoryCodes:[productCategoryCode]});
      this.setState({
        selCategory: [{code: productCategoryCode, name: productCategoryName}]
      });
      
      return;
    }
    var formInfo = this.props.formInfo;
    if (formInfo) {
      setFieldsValue(formInfo.formValue);

      const {attribute} = this.props;

      var formMeta = formInfo?formInfo.formMeta:null,
          categoryList = formMeta?formMeta.categoryCodes:null,
          supplierList = formMeta?formMeta.supplierCode:null,
          brandList = formMeta?formMeta.brandCodes:null,
          categoryAttribute = attribute || (formMeta?formMeta.attributes:null);

      this.setState({
        categoryAttribute: categoryAttribute,
        selSupplier: supplierList?supplierList:this.state.selSupplier,
        selCategory: categoryList?categoryList:this.state.selCategory,
        selBrand: brandList?brandList:this.state.selBrand
      });

      
    }
  }

  handleSubmit() {

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
          console.log('Errors in form!!!');
          return;
      }
      var props = this.props.form.getFieldsValue();
        this.props.submitHandler(props,{
        categoryCodes: this.state.selCategory,
        supplierCode: this.state.selSupplier,
        brandCodes:this.state.selBrand,
        attributes: this.props.attribute
      });
    });
  }

  handleReset() {

    this.props.form.resetFields();
    this.props.resetHandler();
    this.setState({
      selSupplier: [],
      selCategory: [],
      selBrand: []
    });
  }

  queryCity(province) {
    this.props.form.resetFields(['city']);
    this.props.form.resetFields(['pointOfService']);
    this.props.queryCity(province);
  }

  queryPointOfService(city) {
    this.props.form.resetFields(['pointOfService']);
    this.props.queryPointOfService(city);
  }

  componentWillReceiveProps(nextProps) {

    // const {attribute} = nextProps;

    // var formInfo = nextProps.formInfo,
    //     formMeta = formInfo?formInfo.formMeta:null,
    //     categoryList = formMeta?formMeta.categoryCodes:null,
    //     supplierList = formMeta?formMeta.supplierCode:null,
    //     brandList = formMeta?formMeta.brandCodes:null,
    //     categoryAttribute = attribute || (formMeta?formMeta.attributes:null);

    // console.log("formMeta==>", formMeta);
    // this.setState({
    //   categoryAttribute: categoryAttribute,
    //   selSupplier: supplierList?supplierList:this.state.selSupplier,
    //   selCategory: categoryList?categoryList:this.state.selCategory,
    //   selBrand: brandList?brandList:this.state.selBrand
    // });
  }

  render() {

    const { getFieldProps, getFieldValue } = this.props.form;
    const {pageMeta, cities, pointOfServices} = this.props;
    const {attribute} = this.props;
    var formInfo = this.props.formInfo;

    const collapseDropDown = (attribute) => {
      if (attribute) {
        const {getFieldProps} = this.props.form;
        let num = 0, sp = 0;
        return attribute.map(key => {
          if (++num % 4 == 1)
            sp = 7;
          else if (num % 4 == 0)
            sp = 5;
          else sp = 6;
          return <Col key={key.code} span={sp}>
            <FormItem
              label={key.name}
              {...formItemLayout} >
              <Input size="default" id={key.code} {...getFieldProps(DYNAMIC_FORM_PREFIX + key.code)} />
            </FormItem>
          </Col>
        });
      }
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const propsWithNumber1 = (floorPrice)=>{
      return getFieldProps(floorPrice, renderNumberProps() ); 
    };

    const propsWithNumber2 = (ceilingPrice)=>{
      return getFieldProps(ceilingPrice, renderNumberProps() ); 
    };

    return (
      <div>
        <Form horizontal>
          <Row className="m-r-l">
            <Col span={7}>
              <FormItem
                {...formItemLayout}
                label="商品编码">
                <Select allowClear notFoundContent="暂无数据" tags size="default" {...getFieldProps('productCodes') } />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商品名称"
                {...formItemLayout} >
                <Input size="default" {...getFieldProps('name') } />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="供应商"
                {...formItemLayout} >
                <Select allowClear notFoundContent="暂无数据" multiple size="default" {...getFieldProps('supplierCode') } >
                  {renderDropDown(this.state.selSupplier)}
                </Select>
                <Icon className="icon-edit" type="edit" onClick={() => {
                  QueryForm.supplier.getWrappedInstance().setState({
                    title: '供应商',
                    gridType: 'single',
                    key: 'single',
                    clearForm: false,
                    visible: true,
                    confirm: (aSelected) => {
                      const {setFieldsValue} = this.props.form;
                      this.setState({
                        selSupplier: aSelected
                      });

                      setFieldsValue({
                        supplierCode: aSelected.map(cat => cat.key)
                      });
                    }
                  });
                } } />
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="工业分类" {...formItemLayout} >
                <Select allowClear size="default"multiple notFoundContent="暂无数据"
                  {...getFieldProps('categoryCodes') } >
                  {renderDropDown(this.state.selCategory)}
                </Select>
                <Icon className="icon-edit" type="edit" onClick={() => {
                  QueryForm.category.getWrappedInstance().setState({
                    gridType: 'single',
                    visible: true,
                    clearForm: false,
                    confirm: (aSelected) => {
                      this.setState({
                        selCategory: aSelected
                      });

                      const {setFieldsValue} = this.props.form;
                      setFieldsValue({
                        categoryCodes: aSelected.map(cat => cat.key)
                      });
                      this.props.queryCategoryAttribute(aSelected.map(cat => cat.key));
                    }
                  });
                } } />
              </FormItem>
            </Col>
          </Row>
          <Row className="m-r-l">
            <Col span={7}>
              <FormItem
                {...formItemLayout}
                label="品牌">
                <Select allowClear size="default"
                  multiple notFoundContent="暂无数据"
                  {...getFieldProps('brandCodes') } >
                  {renderDropDown(this.state.selBrand)}
                </Select>
                <Icon className="icon-edit" type="edit" onClick={() => {
                  QueryForm.brand.getWrappedInstance().setState({
                    gridType: 'single',
                    visible: true,
                    clearForm: false,
                    confirm: (aSelected) => {
                      const {setFieldsValue} = this.props.form;
                      setFieldsValue({
                        brandCodes: aSelected.map(cat => cat.key)
                      });
                      this.setState({
                        selBrand: aSelected
                      });
                    }
                  });
                } } />
              </FormItem>
              <FormItem
                className="m-b-s"
                label="商品阶段"
                {...formItemLayout} >
                <Select allowClear size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('lifeCycle') }>
                  {renderDropDown(pageMeta ? pageMeta.lifecycle : [])}
                </Select>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商家"
                {...formItemLayout} >
                <Select allowClear showSearch size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('fsSellerCode') } >
                  {renderDropDown(pageMeta ? pageMeta.fsSeller : [])}
                </Select>
              </FormItem>
              <FormItem
                label="型号"
                {...formItemLayout} >
                <Input size="default" {...getFieldProps('manufacturerAID') } />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商家商品状态"
                {...formItemLayout} >
                <Select allowClear showSearch size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('auditStatus') } >
                  {renderDropDown(pageMeta ? pageMeta.auditStatus : [])}
                </Select>
              </FormItem>
              <FormItem
                label="特殊机型"
                {...formItemLayout} >
                <Select allowClear showSearch size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('productAttribute') } >
                  {renderDropDown(pageMeta ? pageMeta.productAttribute : [])}
                </Select>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                label="虚拟商品"
                {...formItemLayout} >
                <RadioGroup {...getFieldProps('isVirtual') }>
                  <Radio key="a" value={true}>是</Radio>
                  <Radio key="b" value={false}>否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <h6>价格</h6>
          <Row className="m-r-l">
            <Col span={7}>
              <FormItem
                className="m-b-s"
                label="渠道"
                {...formItemLayout} >
                <Select allowClear size="default" labelInValue optionFilterProp="children" notFoundContent="暂无数据" {...getFieldProps('channel') } >
                  {renderDropDown(pageMeta ? pageMeta.channel : [])}
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                className="m-b-s"
                label="区域 / 门店"
                labelCol={{ span: 4 }}>
                <Col span="6">
                  <FormItem>
                    <Select allowClear size="default" notFoundContent="暂无数据" placeholder="请选择省" {...getFieldProps('province', { onChange: (arg) => { this.queryCity(arg) } }) }>
                      {renderDropDown(pageMeta ? pageMeta.province : [])}
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <Select allowClear size="default"
                      notFoundContent="暂无数据"
                      placeholder="请选择市" {...getFieldProps('city', { onChange: (city) => { this.queryPointOfService(city) } }) }>
                      {renderDropDown(cities)}
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <Select allowClear size="default" notFoundContent="暂无数据" placeholder="请选择门店" {...getFieldProps('pointOfService') }>
                      {renderDropDown(pointOfServices, "name", "displayName")}
                    </Select>
                  </FormItem>
                </Col>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                className="m-b-s"
                label="价格"
                {...formItemLayout} >
                <Col span="11">
                  <FormItem>
                    <Input size="default" {...propsWithNumber1('floorPrice')} />
                  </FormItem>
                </Col>
                <Col span="2">
                  <p className="ant-form-split">-</p>
                </Col>
                <Col span="11">
                  <FormItem>
                    <Input size="default" {...propsWithNumber2('ceilingPrice') } />
                  </FormItem>
                </Col>
              </FormItem>
            </Col>
            <Col span={5}>
            </Col>
          </Row>
          <Collapse  accordion>
            <Panel header={'分类属性'} key="1">
              <Row className="m-r-l">
                {collapseDropDown(this.state.categoryAttribute, getFieldProps)}

              </Row>
            </Panel>
          </Collapse>
          <Row>
            <Col span={12} offset={12} className="p-r-l multi-buttons">
              <Button type="primary" onClick={() => this.handleSubmit()}>查询</Button>
              <Button className="m-l-m" type="ghost" onClick={() => this.handleReset()}>重置</Button>
            </Col>
          </Row>
        </Form>
        <CategoryDialog ref={(ref) => QueryForm.category = ref} />
        <BrandDialog ref={(ref) => QueryForm.brand = ref} />
        <SupplierDialog ref={(ref) => QueryForm.supplier = ref} />
      </div>
    );
  }
}

QueryForm.propTypes = {
  submitHandler: PropTypes.func.isRequired,
};

QueryForm = Form.create()(wrapState(QueryForm));
export { QueryForm };
