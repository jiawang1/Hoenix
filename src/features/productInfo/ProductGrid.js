import React, { Component, PropTypes } from 'react';
import {Table} from 'antd';
import { Link } from 'react-router';

const publishedMap = {
  'true' : '已组货',
  'false' : '未组货',
}
const columns = [
    {
      title: '商家',
      dataIndex: 'fsSellerName',
	  key: 'fsSeller'
    },

    {
      title: '编码',
      dataIndex: 'code',
      render: (text, record) => (
        <div>
          <Link to={`productDetail?code=${record.code}`}>{record.code}</Link>
        </div>
      ),
    }, 

    {
      title: '名称',
      dataIndex: 'name',
    },

    {
      title: '品牌',
      dataIndex: 'brand',
    },

    {
      title: '商品阶段',
      dataIndex: 'lifeCycle',
    } ,

    {
      title: '所属分类',
      dataIndex: 'category',
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
      title: '特殊机型',
      dataIndex: 'productAttribute',
    }, 

    {
      title: '成本价',
      dataIndex: 'costPrice',
    }, 

    {
      title: '供价',
      dataIndex: 'channelCostPrice',
    }, 

    {
      title: '挂牌价',
      dataIndex: 'listPrice',
    }, 

    {
      title: '组货状态',
      dataIndex: 'published',
      render:(text,record)=>{
        return publishedMap[text];
      }
    }, 

    {
      title: '供应商编码',
      dataIndex: 'supplierCode',
    }, 

    {
      title: '供应商名称',
      dataIndex: 'supplierName',
    }, 
  ];

export class ProductGrid extends Component{

	constructor(props){
		super(props);
		
	}

	render(){
		let {aDataSource,pagination,loading,onChange} = this.props;
		return (
			<div>
			<Table size="middle" columns={columns} dataSource={aDataSource} onChange={onChange} pagination={pagination} loading={loading} />
			</div>
		);
	}
}

