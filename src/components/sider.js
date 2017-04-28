import { Menu, Icon } from 'antd';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import routeMap from '../common/routeMap.js';
import {hasAccessAuth} from '../common/helper.js';
import { withRouter } from 'react-router';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const EXCEPTIONAL_PATH = ['*','noauth'];

export default React.createClass({

	propTypes:{
		oNavLinks: PropTypes.object.isRequired,
		initPath:  PropTypes.string,
	},
	getInitialState:function() {

		let {initPath,oNavLinks } = this.props;
		function findKeys(path){

			var aKeys = path.slice(1).split('/'),
				aRoutes = oNavLinks.childRoutes,
				target = aKeys[0];
			function recursiveFind( target, aRoutes, parentKeys ){

				var _parentKey = parentKeys.slice();
				return aRoutes.some(oRoute=>{
					var _keys = [];
					if((!oRoute.path ||oRoute.path.length === 0) &&oRoute.name ){
						_keys.push(oRoute.name);
						if(oRoute.childRoutes){
							return recursiveFind(target,oRoute.childRoutes, [...parentKeys, ..._keys]);
						}else{
							return false;
						}
					}else{
						if(oRoute.path === target){
							aKeys = [...parentKeys, ...aKeys];
							return true;
						}else{
							return false;
						}
					}
				});
			}
			recursiveFind(target, aRoutes, []);	
			return aKeys;
		}
		if(initPath){
			var _initPath = this.props.initPath.indexOf('/',1)>0? this.props.initPath.slice(0,this.props.initPath.lastIndexOf('/')) : this.props.initPath;
			return {
				current: _initPath,
				openKey: findKeys(initPath)
			};
		}else{
			return {
				current: '/samplePage',
				openKey: ['sample', '/samplePage']
			};
		}
	},
	handleClick: function(e) {
		this.setState({
			current: e.key,
		});
	},

	renderLinks: function(aConfigs, aAuth, basePath, isSub){

		const depTitle = (isSub, config)=>{ 
			if(isSub){
				return <span>{config.text}</span>;
			}else{
				return <span><Icon type={config.icon?config.icon:'setting'} />{config.text}</span>;
			}
		};

		const filterAuthorizedRoutes = (routes, aAuth)=>{
				
			//	return routes;
			const hasValidateChild = (childRoutes)=>{
			
				return childRoutes.some((child)=>{
					if(child.childRoutes){
						return hasValidateChild(child.childRoutes);
					}else{
						return hasAccessAuth(routeMap[child.path],aAuth);
					}
				});
			}

			return routes.filter((route)=>{
				if(route.childRoutes){
					return hasValidateChild(route.childRoutes);
				}else{
					return hasAccessAuth(routeMap[route.path],aAuth);
				}
			});
		};

		return aConfigs.reduce((prev, config)=>{

			let _path = '';

			if(EXCEPTIONAL_PATH.indexOf(config.path) < 0){

				if(config.path && config.path.length > 0 ){

					if(config.isSubPage){
						return prev;
					}
					if(/^\//.test(config.path)){
						_path = config.path;
					} else if (basePath === '/' || typeof basePath === 'undefined' ) {
						_path = `/${config.path}`;
					} else {
						_path = `${basePath}/${config.path}`;
					}
				}
				if(config.childRoutes){

					let __aRoutes = filterAuthorizedRoutes(config.childRoutes, aAuth);
					if( __aRoutes.filter((_route)=>{return !_route.isSubPage;}).length > 0 ){
						prev.push(<SubMenu key={_path.length > 0?_path:config.name} title={depTitle(isSub, config)}>
							{this.renderLinks(__aRoutes,aAuth, _path, true)} 
						  </SubMenu>
						 );	
					}
				}else if (config.component){
					prev.push( <Menu.Item key={ _path }> <Link to={_path}>{config.text}</Link> </Menu.Item> );
				}
				else{
					console.error("error with router config ");	
				}	
			}	
			return prev;
		},[]);
	},

	componentWillReceiveProps(next){
			this.setState({
				auth: next.auth,
				current: next.pathname
			});
	},
	render:function() {
		return (
			<Menu onClick={this.handleClick}
				defaultOpenKeys={ this.state.openKey }
				selectedKeys={[this.state.current]}
				mode="inline"
				style={{width:'300px'}}
				theme ='dark'
				className="largePaddingRight"
			>
				{(this.state.auth&&this.state.auth.length > 0 )?this.renderLinks(this.props.oNavLinks.childRoutes,this.state.auth):[]}
			</Menu>
		);
	},
});


