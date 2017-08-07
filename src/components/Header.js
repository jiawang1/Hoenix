import React, { Component, PropTypes } from 'react';
import {Row, Col, Badge, Icon, Button, Form, Tooltip} from 'antd';

export default function Header ({clickHandler,userName, iconType}){

		const text = <span>logout</span>;
		return (
			<div className="test">
					<div className="logo-image-container">
						<img className="logoImage" src={require("../image/logo.png") } />
						<Icon className="menu-icon" type={iconType} onClick={clickHandler} />
					</div>
					<div className="user-info-container">
						<form action='/fivestaradminstorefront/logout' method='post'>
							<Button className="logout-button" htmlType="submit" type="ghost" shape="circle" icon="logout"></Button>
						</form>
					</div>
					<div className="user-info-container">
						<span className="user">
							Welcome { userName || ''}
						</span>
					</div>
			</div>
		);
}



