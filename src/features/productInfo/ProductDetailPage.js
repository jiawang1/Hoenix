import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Link, withRouter } from 'react-router';
import { groupAttributes } from '../../common/helper.js';
import { Button, Card, Col, Row, Table, Tabs, Form, Popover, Collapse } from 'antd';
import {PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA,UPDATE_PRODUCT_DETAIL_PRICE_SAGA,
PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH_SAGA,PRODUCT_STOCK_DETAIL_INFO_SAGA} from './productinfoState.js';

const FormItem = Form.Item,
	TabPane = Tabs.TabPane,
	Panel = Collapse.Panel;
const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const columnsPrice = [
	{
		title: '商品编码',
		dataIndex: 'code',
	},

	{
		title: '商品名称',
		dataIndex: 'name',
	},

	{
		title: '供应商编码',
		dataIndex: 'supplierCode',
	},

	{
		title: '供应商名称',
		dataIndex: 'supplierName',
	},

	{
		title: '渠道',
		dataIndex: 'channel',
	},

	{
		title: '区域',
		dataIndex: 'region',
	},

	{
		title: '门店',
		dataIndex: 'pointOfService',
	},

	{
		title: '品牌',
		dataIndex: 'brand',
	},

	{
		title: '特殊机型',
		dataIndex: 'productAttribute',
	},

	{
		title: '采购计划成本价',
		dataIndex: 'costPrice',
	},

	{
		title: '渠道供价',
		dataIndex: 'channelCostPrice',
	},

	{
		title: '挂牌价',
		dataIndex: 'listPrice',
	},

	{
		title: '限价',
		dataIndex: 'salesPrice',
	},

	{
		title: '审核状态',
		dataIndex: 'auditStatus',
	}
];
const columnsPublish = [
	{
		title: '商品编码',
		dataIndex: 'productCode',
	},

	{
		title: '商品名称',
		dataIndex: 'productName',
	},

	{
		title: '渠道',
		dataIndex: 'channel',
	},

	{
		title: '区域',
		dataIndex: 'area',
	},

	{
		title: '门店',
		dataIndex: 'pointOfService',
	},

	{
		title: '品牌',
		dataIndex: 'brand',
	},

	{
		title: '供应商',
		dataIndex: 'supplier',
	},

	{
		title: '特殊机型',
		dataIndex: 'productAttribute',
	},

	{
		title: '组货状态',
		dataIndex: 'isSaleable',
	}
];

const columnsStock = [{
	title: '仓库',
	dataIndex: 'warehouseName',
}, {
	title: '特殊机型',
	dataIndex: 'productAttributeName',
}, {
	title: '供应商',
	dataIndex: 'supplierName',
}, {
	title: '保留量',
	dataIndex: 'holdAmount',
	width: '80px',
}, {
	title: '可售库存',
	dataIndex: 'salesStockAmount',
}, {
	title: '冻结总量',
	dataIndex: 'freezeAmount',
}, {
	title: '共享可售量',
	dataIndex: 'shareAmount',
	width: '80px',
}, {
	title: '渠道',
	dataIndex: 'channelName',
}, {
	title: '门店',
	dataIndex: 'pointOfService',
}, {
	title: '独享可售量',
	width: '80px',
	dataIndex: 'solelyAmount',
}, {
	title: '渠道近4周均销',
	dataIndex: 'averageSalesAmount',
	width: '60px',
}, {
	title: '操作',
  dataIndex: 'oper'
}];

class ProductDetailPage extends Component {

	constructor() {

		super();

		this.state = {

			priceListPagination: {
				pageSize: 10,
				current: 1,
				total: 0
			},
			publishListPagination: {
				pageSize: 10,
				current: 1,
				total: 0
			},
			priceLoading: false,
			publishLoading: false,
			stockLoading: false,
			currentKey: 1
		};
	}

	_renderGroupedAttr(aGrouped, inx) {
		return (
			<Row key={inx}>
				{
					aGrouped.map(attr => {
						return (<Col span={6} key={attr.code}>
							<FormItem {...formItemLayout} label={attr.attributeName}>
								<p className="ant-form-text">{attr.value}</p>
							</FormItem>
						</Col>);
					})
				}
			</Row>
		);
	}

	groupAttributes(attrs) {
		return groupAttributes(4)(attrs).map(this._renderGroupedAttr);

	}

	renderAttrGroup(oGroup) {

		return (<div key={oGroup.classificationCode}>
			<p className="m-l-s p-classification">{oGroup.classificationName}</p>
			{this.groupAttributes(oGroup.features || [])}
		</div>
		);

	}
	renderClassificationAttr(attr) {

		return attr && attr.map(group => {
			return this.renderAttrGroup(group);
		});
	}

	componentWillMount() {

		var { code } = this.props.location.query;
		const {dispatch} = this.props;
		dispatch({type:PRODUCT_INFO_QUERY_POINTOFSERVICE_SAGA , data:{code}});
	}

	renderImages(images) {

		const groupImages = (images) => {
			return groupAttributes(5)(images);
		};
		const __renderIamge = (urls, inx) => {
			return (
				<Row key={inx}>
					{urls.map((url, indx) => {
						return (
							<Col span={3} key={indx}>
								<img className="product-img-s" src={url} />
							</Col>
						);
					})}
				</Row>
			);
		}

		return groupImages(images).map(__renderIamge);
	}

	renderChannelPanel(channels) {
		return (
			channels.map(channel => {
				return (
					<Panel header={channel.name} key={channel.code}>
						{this.renderClassificationAttr(channel.channelClassifications || [])}
					</Panel>
				);
			})
		);
	}

	renderChannels(channels) {
		return (
			<Collapse>
				{this.renderChannelPanel(channels.filter(channel => channel.channelClassifications && channel.channelClassifications.length > 0))}
			</Collapse>
		);
	}

	onTabClick(key) {

		if (key == 2) {
			this.setState({
				currentKey: key,
				priceLoading: true
			});
			this.__queryPriceList({ pageSize: this.state.priceListPagination.pageSize, current: this.state.priceListPagination.current });
		}

		if (key == 3) {
			this.setState({
				currentKey: key,
				publishLoading: true
			});
			this.__queryPublishList({ pageSize: this.state.publishListPagination.pageSize, current: this.state.publishListPagination.current });
		}

		if (key == 4) {
			this.setState({
				currentKey: key,
				stockLoading: true
			});
			this.__queryStockList();
		}
	}

	componentWillReceiveProps(next) {

		if (next.productDetail.priceData && next.productDetail.priceData.pagination) {
			this.state.priceListPagination.total = next.productDetail.priceData.pagination.totalNumberOfResults;
		}
		if (next.productDetail.publishData && next.productDetail.publishData.pagination) {
			this.state.publishListPagination.total = next.productDetail.publishData.totalNumberOfResults;
		}
	}

	__queryPriceList(pagination) {
		const {dispatch} = this.props;
		var { code } = this.props.location.query;

		dispatch({type:UPDATE_PRODUCT_DETAIL_PRICE_SAGA, data:{ productCodes: [code], pageSize: pagination.pageSize, currentPage: pagination.current - 1},
				 cb: (err, data)=>{
					 if(!err){
						this.setState({
							priceLoading: false,
						});
					 }
				 }  });
	}

	__queryPublishList(pagination) {
		const {dispatch} = this.props;
		var { code } = this.props.location.query;

		dispatch({type:PRODUCT_INFO_SEARCH_PRODUCT_PUBLISH_SAGA, 
				 data:{ productList: [code], pageSize: pagination.pageSize, currentPage: pagination.current - 1 },
				cb:(err)=>{
					 if(!err){
						this.setState({
							publishLoading: false,
						});
					 }
				}});
	}

	__queryStockList() {
		const {dispatch} = this.props;
		var {code} = this.props.location.query;

		dispatch({ type: PRODUCT_STOCK_DETAIL_INFO_SAGA, data:{code},
				 cb:(err)=>{
					 if(!err){
						 this.setState({
							 stockLoading: false,
						 });
					 }
				 }});
	}

	changePriceList(pagination) {
		var { code } = this.props.location.query;
		this.setState({
			priceLoading: true,
			priceListPagination: {
				pageSize: pagination.pageSize,
				current: pagination.current
			}
		});
		this.__queryPriceList(pagination);
	}

	changePublishList(pagination) {
		var { code } = this.props.location.query;
		this.setState({
			publishLoading: true,
			publishListPagination: {
				pageSize: pagination.pageSize,
				current: pagination.current
			}
		});
		this.__queryPublishList(pagination);
	}

	goBack() {
		this.props.router.goBack();
	}

	generateStockTableData(stockData) {
		console.log(stockData)
		let data = [];
		stockData.forEach((sd, i) => {
			let productSpan = 0;
			if (sd.logicStockLevelDatas && sd.logicStockLevelDatas.length > 0) {
				productSpan = sd.logicStockLevelDatas.length;
				sd.logicStockLevelDatas.forEach((lsd, index) => {
					let row = Object.assign({}, sd, lsd);
					//row.key = row.supplierCode.concat("-").concat(row.channelCode).concat("-").concat(index);
					row.key = `${row.productCode}-${row.supplierCode}-${row.productAttributeCode}-${row.channelCode}-i${i}-index-${index}`;
					row.isFirstLogicStockLevel = (index === 0);
					row.productSpan = productSpan;
					data.push(row);
				});
			} else {
				let row = Object.assign({}, sd);
				row.key = `${row.productCode}-${row.supplierCode}-${row.productAttributeCode}-i${i}`;
				row.isFirstLogicStockLevel = true;
				row.productSpan = 1;
				data.push(row);
			}
		});
		return data;
	}

	generateStockColumns(cols) {
		cols.forEach((col, colIdx) => {
			col.render = (...args) => this.customizeStcokColRender(colIdx, ...args);
		})
		return cols;
	}

	customizeStcokColRender(colIdx, value, record, idx) {
		let obj = {
			children: value,
			props: {}
		};

		if (colIdx >= 7) {

			if (colIdx === columnsStock.length - 1) {
				let provinceCode = record.provinceCode ? record.provinceCode : "";
				let cityCode = record.cityCode ? record.cityCode : "";
				let channelCode = record.channelCode ? record.channelCode : "";
				let productCode = record.productCode ? record.productCode : "";
				let productName = record.productName ? record.productName : "";
				let supplierCode = record.supplierCode ? record.supplierCode : "";
				let supplierName = record.supplierName ? record.supplierName : "";
				
				return (
					<Link to={`/productPrice?productCode=${productCode}&productName=${productName}&supplierCode=${supplierCode}&supplierName=${supplierName}&channelCode=${channelCode}&provinceCode=${provinceCode}&cityCode=${cityCode}`}>查看商品价格</Link>
				);
			}

			return <span>{value}</span>;
		} else {
			if (record.isFirstLogicStockLevel) {
				obj.props.rowSpan = record.productSpan;
			} else {
				obj.props.rowSpan = 0;
			}
			return obj;
		}
	}

	renderSales(attrs){
		return groupAttributes(4)(attrs).map(this._renderGroupedAttr);	
	}

	render() {
		const {priceData, detail, publishData, stockData} = this.props.productDetail;
		let stockTabledata = stockData ? this.generateStockTableData(stockData) : [];
		this.generateStockColumns(columnsStock);
		return (
			<div className="main-area dense-form">
				<Button className="return-btn" icon="left" size="small" type="ghost" onClick={(...args) => this.goBack(...args)}>返回</Button>
				<div className="field-c">
					<Tabs type="card"
						onTabClick={(...args) => this.onTabClick(...args)}
					>
						<TabPane tab="商品属性" key="1">
							<Row>
								<Col span={6}>
									<FormItem {...formItemLayout} label="商品编码">
										<p className="ant-form-text">{detail ? detail.code : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="商品名称">
										<p className="ant-form-text">{detail ? detail.name : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="型号">
										<p className="ant-form-text">{detail ? detail.manufacturerAID : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="品牌">
										<p className="ant-form-text">{detail ? detail.brandName : ''}</p>
									</FormItem>
								</Col>
							</Row>
							<h6 className="m-b-xs m-t-xs p-t-xs">销售属性</h6>
								{this.renderSales(detail ? detail.salesAttributes : [])}
							<h6 className="m-b-xs m-t-xs p-t-xs">基本属性</h6>
							<Row>
								<Col span={6}>
									<FormItem {...formItemLayout} label="所属分类">
										<p className="ant-form-text">{detail ? detail.categoryName : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="商品描述">
										<p className="ant-form-text">{detail ? detail.description : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="条形码">
										<p className="ant-form-text">{detail ? detail.barcodes : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="商品类型">
										<p className="ant-form-text">{detail ? detail.commodityType : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="产地">
										<p className="ant-form-text">{detail ? detail.originalRegion : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="是否检查库存">
										<p className="ant-form-text">{detail ? detail.isCheckStockLevel ? '是' : '否' : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="毛重">
										<p className="ant-form-text">{detail ? detail.weight : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="是否单独销售">
										<p className="ant-form-text">{detail ? detail.isAloneSale ? '是' : '否' : ''}</p>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span={6}>
									<FormItem {...formItemLayout} label="是否可用状态">
										<p className="ant-form-text">{detail ? detail.auditStatus : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="是否需要安装">
										<p className="ant-form-text">{detail ? detail.isNeededInstall ? '是' : '否' : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="商品生命周期">
										<p className="ant-form-text">{detail ? detail.lifecycle : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="是否可维修">
										<p className="ant-form-text">{detail ? detail.isRepairable ? '是' : '否' : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="退货上门取件">
										<p className="ant-form-text">{detail ? detail.isNeededToDoorReturn ? '是' : '否' : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="是否可退货">
										<p className="ant-form-text">{detail ? detail.isReturnable ? '是' : '否' : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="是否大家电">
										<p className="ant-form-text">{detail ? detail.isWhiteGoods ? '是' : '否' : ''}</p>
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="是否快递送货">
										<p className="ant-form-text">{detail ? detail.isNeededDeliver ? '是' : '否' : ''}</p>
									</FormItem>
									<FormItem {...formItemLayout} label="是否自有品牌">
										<p className="ant-form-text">{detail ? detail.isSelfBrand ? '是' : '否' : ''}</p>
									</FormItem>
								</Col>
							</Row>
							<h6 className="m-b-xs m-t-xs  p-t-xs">分类属性</h6>
							{this.renderClassificationAttr(detail ? detail.productClassifications : [])}
							<h6 className="m-b-xs m-t-xs p-t-xs">商品图片</h6>
							{this.renderImages(detail && detail.productImages ? detail.productImages : [])}

							<h6 className="m-b-xs m-t-xs p-t-xs">渠道属性</h6>
							{this.renderChannels(detail && detail.channelsClassifications ? detail.channelsClassifications : [])}
						</TabPane>
						<TabPane tab="价格列表" key="2">
							<Table columns={columnsPrice} dataSource={priceData ? priceData.results : []} 
								loading={this.state.priceLoading} 
								onChange={(...args) => { this.changePriceList(...args) }} 
								pagination={this.state.priceListPagination} size="default" />
						</TabPane>
						<TabPane tab="组货列表" key="3">
							<Table columns={columnsPublish}
								dataSource={publishData ? publishData.productList : []} 
								loading={this.state.publishLoading} 
								onChange={(...args) => { this.changePublishList(...args) }} 
								pagination={this.state.publishListPagination} size="default" />
						</TabPane>
						<TabPane tab="库存列表" key="4">
							<Table className="table-no-background" 
								pagination={false} columns={columnsStock} 
								dataSource={stockTabledata} 
								loading={this.state.stockLoading} size="middle" bordered />
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		productDetail: state.productInfo || {},
	};
}

export default withRouter(connect(
	mapStateToProps
)(ProductDetailPage));
