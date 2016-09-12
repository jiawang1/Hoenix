import { Menu, Icon } from 'antd';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default React.createClass({

	propTypes:{
		oNavLinks: PropTypes.object.isRequired,
		initPath:  PropTypes.string,
	},
	getInitialState:function() {
    return {
		current: this.props.initPath?this.props.initPath: '/sample/default-page' ,
    };
  },
  handleClick: function(e) {
    this.setState({
      current: e.key,
    });
  },

  renderLinks: function(aConfigs, basePath, isSub){


	  const depTitle = (isSub, config)=>{ 
	  
		if(isSub){
			return <span>{config.text}</span>;
		}else{
		
			return <span><Icon type="setting" />{config.text}</span>;
		}
	  };


	  return aConfigs.reduce((prev, config)=>{

		  let _path = '';

		  if(config.path !== "*"){
			  if(config.path && config.path.length > 0   ){
				  if(/^\//.test(config.path)){
					  _path = config.path;
				  } else if (basePath === '/' || typeof basePath === 'undefined' ) {
					  _path = `/${config.path}`;
				  } else {
					  _path = `${basePath}/${config.path}`;
				  }
			  }
			  if(config.childRoutes){
				  prev.push(<SubMenu key={_path.length > 0?_path:config.name} title={depTitle(isSub, config)}>
							{this.renderLinks(config.childRoutes, _path, true)} 
							</SubMenu>
						   );	

			  }else if (config.component){
				  prev.push( <Menu.Item key={ _path }> <Link to={_path}>{config.text}</Link> </Menu.Item> );
			  }
			  else{
				  console.error("error with router config");	
			  }	
		  }	
		  return prev;

	  },[]);

  },
  render:function() {
    return (
      <Menu onClick={this.handleClick}
        style={{ width: 224 }}
        defaultOpenKeys={['/sample']}
        selectedKeys={[this.state.current]}
        mode="inline"
		theme ='dark'
		className="largePaddingRight"
      >
	  {this.renderLinks(this.props.oNavLinks.childRoutes)}
        <SubMenu key="sub1" title={<span><Icon type="setting" />商品管理<span></span></span>}>
          <MenuItemGroup title="商品管理－1">
            <Menu.Item key="1">商品1</Menu.Item>
            <Menu.Item key="2">商品2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="商品管理－2">
            <Menu.Item key="3">商品3</Menu.Item>
            <Menu.Item key="4">商品4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="setting" /><span>促销管理</span></span>}>
          <Menu.Item key="5">促销1</Menu.Item>
          <Menu.Item key="6">促销2</Menu.Item>
          <SubMenu key="sub3" title="三级导航-库存">
            <Menu.Item key="7">选项7</Menu.Item>
            <Menu.Item key="8">选项8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>库存管理</span></span>}>
          <Menu.Item key="9">库存1</Menu.Item>
          <Menu.Item key="10">库存2</Menu.Item>
          <Menu.Item key="11">库存3</Menu.Item>
          <Menu.Item key="12">库存4</Menu.Item>
        </SubMenu>
      </Menu>
    );
  },
});


