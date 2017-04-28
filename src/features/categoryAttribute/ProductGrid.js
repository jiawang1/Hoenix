import React, { Component, PropTypes } from 'react';
import { Button,Table, Popconfirm, message,Select,Cascader,Modal,Row,Col } from 'antd';

export class ProductGrid extends Component{

	constructor(props){
		super(props);
		this.rowSelection = {
			onSelect:function(record, selected, selectedRows){
			},

			handleChange:function(data){
			}
		};
	}

	render(){
		let {aColumn,aDataSource,size,pagination,loading,onChange,total} =  this.props;
		return (
			<div>
				<Table size={size?size: "middle"} rowSelection={this.rowSelection}
				columns={aColumn} dataSource={aDataSource} pagination={pagination} loading={loading}
				onChange={onChange} />
			</div>
		);
	}
}

ProductGrid.propTypes = {
	aDataSource:PropTypes.array.isRequired,
	aColumn: PropTypes.array.isRequired,
	pagination:  PropTypes.object.isRequired,
	onChange:PropTypes.func.isRequired,
	loading: PropTypes.bool,
	size: PropTypes.string,

};
