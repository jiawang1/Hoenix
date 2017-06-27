import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Badge } from 'antd';



class Header extends Component {

	render() {
		return (
			<div className="test">
				<Row type="flex" justify="space-around" align="middle">
					<Col span={4}>
						<img className="logoImage" src={require("../image/logo.png")} />
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
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect()(Header);
