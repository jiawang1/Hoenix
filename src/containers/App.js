import React, { Component, PropTypes } from 'react';
import routeConfig from '../common/routeConfig';
import { Menu, Icon } from 'antd';
import Sider from './../components/sider.js';
import Header from './Header.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class App extends Component{
	
	render(){
		return (
			<div className="app ant-layout-aside">
			    <Header></Header>	
				<aside className="ant-layout-sider fixedMenu">
					<Sider oNavLinks={routeConfig[0]} initPath={this.props.location.pathname} ></Sider>
				</aside>
				<div className="ant-layout-main">
					{this.props.children}
				</div>
			</div>
		);
	}


}

App.propTypes = {
	children: PropTypes.node,
};



