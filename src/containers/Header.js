import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Row, Col, Input, Button, Badge} from 'antd';

const InputGroup = Input.Group;


class Header extends Component{


	render(){
		return (
<div className="test">
				<Row type="flex" justify="space-around" align="middle">
					<Col span={4}>
						<img className="logoImage" src="../image/logo.png" />
					</Col>
					<Col span={2}>
					   <a href="#">首页</a>
					</Col>
					<Col span={2}>
					   <a href="#">帐户设置</a>
					</Col>
					<Col span={2}>
						<Badge count={15}>
					   	<a href="#" className="notification">消息</a>
						</Badge>
					</Col>
					<Col span={9}>
					</Col>				
					<Col span={5}>
					<InputGroup >
<Input style={{ width: 263 }} placeholder="搜索"/>
 <div className="ant-input-group-wrap">
 <Button className="search-button" icon="search"/>
 </div>
 </InputGroup>
 </Col>
 </Row></div>
		
		);
	}

}

export default connect()(Header);
