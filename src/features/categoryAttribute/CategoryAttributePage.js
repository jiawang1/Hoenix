import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { ProductGrid } from './ProductGrid';
import { CategoryTree } from "./../../components/CategoryTree";
import { Row, Col, Input, Select, Cascader, Button, Table, Popconfirm, message, Radio, DatePicker, Form } from 'antd';
import { QueryForm } from './QueryForm.js';
import { messageBox } from './../../components/messageBox';
import { Link } from 'react-router';
import { deleteAttribute } from './editActions';

const CatTree = connect(state => ({
	category: state.home.category
}),
	dispatch => ({ retrieveCategory: bindActionCreators(actions.retrieveCategory, dispatch) })
)(CategoryTree);

class CategoryAttributePage extends Component {
	static propTypes = {
		home: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
	};

	static currentCategory = {};   // table cell can not get category info, so use to way

	constructor() {
		super();
		this.state = {
			metaData: {},
			oCatagory: {},
			pagination: {
				pageSize: 10,
				current: 1

			},
			queryForm: {},
			loading: false
		};
	}

	componentDidMount() {

		const {retrievePageMeta} = this.props.actions;
		retrievePageMeta();
	}

	query(args) {

		this.state.queryForm = args;
		this.__query({
			pageSize: this.state.pagination.pageSize,
			current: 1
		}).then(() => {
			this.setState({
				loading: false,
			});

		});
	}

	__query(pagin) {
		const {queryAttribute} = this.props.actions;
		const code = this.state.oCatagory.keys[0];
		const {pagination, queryForm} = this.state;
		const page = pagin ? pagin : pagination;
		this.setState({
			loading: true,
		});

		return queryAttribute()({ ...queryForm, categoryCode: code, pageSize: page.pageSize, currentPage: page.current - 1 });
	}

	componentWillReceiveProps(nextProps) {
		let {pagedAData} = nextProps.home;
		if (pagedAData) {
			let pagination = pagedAData.pagination;
			let total = pagination ? pagination.totalNumberOfResults : 0;
			let current = pagination ? pagination.currentPage + 1 : 1;
			this.setState({
				pagination: {
					...this.state.pagination,
					current,
					total
				}
			});
		}
	}

	setCurrentCategory(oCategory) {

		CategoryAttributePage.currentCategory = oCategory;
		this.setState({ 'oCatagory': oCategory });
	}

	handleGridChange(pagination) {
		this.__query(pagination).then(() => {
			this.setState({
				loading: false,
				pagination: pagination
			});
		});
	}

	renderCategoryTree() {
		if (CategoryAttributePage.currentCategory) {
			let {keys} = CategoryAttributePage.currentCategory;
			if (keys && keys.length === 1) {
				return <CatTree selectedKeys={keys} selectedTrigger={(...args) => { this.setCurrentCategory(...args) }} />
			}
		}

		return <CatTree selectedTrigger={(...args) => { this.setCurrentCategory(...args) }} />
	}

	renderNavigateButton(){

		if(CategoryAttributePage.currentCategory && CategoryAttributePage.currentCategory.keys){
			return (
				<Link to={`categoryAttributeEdit?code=${CategoryAttributePage.currentCategory.keys[0]}&name=${CategoryAttributePage.currentCategory.title}`} 
					state={{ category: CategoryAttributePage.currentCategory }}>
					<Button type="ghost" className="m-b-s"> 关联属性组和属性</Button>
				</Link>
			);
		}else{
			return (	
				<Button type="ghost" className="m-b-s"> 关联属性组和属性</Button>
			);
		}
	}

	render() {

		const {deleteAttribute} = this.props.actions;

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
				dataIndex: 'code',
			},
			{
				title: '是否销售属性',
				dataIndex: 'salesFlag',
			},
			{
				title: '属性名称',
				dataIndex: 'name',
			},
			{
				title: '属性类型',
				dataIndex: 'type',
				render: (text, record) => (record.type ? getAttributeTypeName(record.type) : ''),
			},
			{
				title: '可否为空',
				dataIndex: 'emptyAllowed',
			},
			{
				title: '创建时间',
				dataIndex: 'creationTime',
			},
			{
				title: '生效状态',
				dataIndex: 'status',
				render:(text, record) => (record.status? (record.status==='VALID'?'生效':'失效'):''),
			},
			{
				title: '操作',
				dataIndex: 'action',
				render: (text, record) => {
					function confirm() {
						messageBox.success(`确认删除 ${record.code}`);
						deleteAttribute(record.code);
					}
					function cancel() {
						messageBox.success(`取消了删除 ${record.code}`);
					}

					return (
						!record.isScsFlag?(<span>
							<Popconfirm title={`确定要删除吗？`} onConfirm={confirm} onCancel={cancel}>
								<a href="#" style={{ 'marginRight': '5px' }}>删除</a>
							</Popconfirm>
						</span>):null
					);
				}
			}
		];

		const getAttributeTypeName = (typeCode) => {
			if (metaData && metaData['type'] && metaData['type'][typeCode]) {
				return metaData['type'][typeCode];
			}
			return typeCode;
		}


		var {attributePageMeta, pagedAData } = this.props.home;
		var metaData = attributePageMeta ? attributePageMeta : {};
		var aData = pagedAData?pagedAData.aData?pagedAData.aData:[]:[];
		return (
			<div className="main-area category-attr">
				<div className="field-c">
					<div className="field-l-tree">
						{ this.renderCategoryTree() }
					</div>
					<div className="field-r-tree">
						<QueryForm query={(...args) => { this.query(...args); }} pageMeta={metaData} />
						<Row>
							{  this.renderNavigateButton() }
							<ProductGrid aDataSource={aData} aColumn={columns} loading={this.state.loading}
									pagination={this.state.pagination} onChange={(...args) => { this.handleGridChange(...args) }}></ProductGrid>
						</Row>
					</div>
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
		actions: bindActionCreators({ ...actions, deleteAttribute: deleteAttribute }, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryAttributePage);

