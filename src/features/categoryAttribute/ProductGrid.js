import React, { Component, PropTypes } from 'react';
import { Button,Table, Popconfirm, message,Select,Cascader,Modal,Row,Col } from 'antd';

export class ProductGrid extends Component{

	constructor(props){
		super(props);
		this.rowSelection = {
			onSelect:function(record, selected, selectedRows){
				console.log(record);
			},

			handleChange:function(data){
				console.log(data);
			}
		};
	}

	render(){
		let {aColumn,aDataSource } =  this.props;
		return (
			<div>
			<Table rowSelection={this.rowSelection} columns={aColumn} dataSource={aDataSource} />
			</div>
		);
	}
}

ProductGrid.propTypes = {
	aDataSource:PropTypes.array.isRequired,
	aColumn: PropTypes.array.isRequired

};
