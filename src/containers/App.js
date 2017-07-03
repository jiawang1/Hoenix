import React, { Component, PropTypes } from 'react';
import { routeConfig } from '../common/routeConfig';
import { Menu, Icon } from 'antd';
import Sider from './../components/sider.js';
import Header from '../components/Header.js';
import { Message } from "../components/messageBox";
import { actions } from './contextState.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class App extends Component {

	constructor() {

		super();
		this.state = {
			height: 700,
			hideMenu: '',
			iconType: 'menu-fold'
		};
	}
	handleClick() {
		if (this.state.hideMenu.length === 0) {
			this.setState({
				hideMenu: 'hide-menu',
				iconType: 'menu-unfold'
			});
		} else {
			this.setState({
				hideMenu: '',
				iconType: 'menu-fold'
			});
		}
	}
	render() {
		let heightStyle = {
			minHeight: this.state.height + 'px'
		};
		let { currentUser, auth } = this.props.authContext;
		const { location } = this.props;

		currentUser = currentUser || {};
		auth = auth || [];
		return (
			<div className={`app ant-layout-aside ${this.state.hideMenu}`}>
				<Header clickHandler={() => { this.handleClick() }} {...currentUser} iconType={this.state.iconType} ></Header>
				<Message />
				<aside className="ant-layout-sider fixed-menu">
					<Sider oNavLinks={routeConfig()[0]} initPath={this.props.location.pathname} auth={auth} pathname={location.pathname}></Sider>
				</aside>
				<div className="ant-layout-main" >
					{this.props.children}
				</div>
			</div>
		);
	}

	componentWillMount() {
		if (window && window.document) {
			this.setState({
				height: window.document.documentElement.clientHeight - 66
			});
		}
		const { getCurrentUser } = this.props.actions;
		getCurrentUser();
	}
}
App.propTypes = {
	children: PropTypes.node,
};

const mapStateToProps = ({ authContext = { currentUser: {}, auth: [] } }) => {
	return {
		authContext
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);



