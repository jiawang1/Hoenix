import React, { Component, PropTypes } from 'react';
import { Tree } from 'antd';
import {getType} from './../../common/helper.js';

const TreeNode = Tree.TreeNode;

export  class AttributeTree extends Component{

	constructor(){

		super();

		this.state = {
			selectedKeys:[],
			expandKey:null,
		};

	}
		componentWillMount(){
	
			var {displayInfo } = this.props;
			this.state.selectedKeys[0] = displayInfo.displayCode;
	
		}

	componentWillReceiveProps( nextProps){

		var {displayInfo } = nextProps;

		if(displayInfo){
			this.state.selectedKeys[0] = displayInfo.displayCode;
		}
	
	}

	buildTreeNode(aTreeData){	

		const renderLeaf = (attributes, groupKey)=>{

			return attributes.length > 0? attributes.map(attribute=>{
				return	<TreeNode title={attribute.name} key={attribute.code} isLeaf={true} cType={attribute.cType} parentKey={groupKey} ></TreeNode>		
			}):null;

		};

		if(!aTreeData ||aTreeData.length === 0 ){
			return []; 
		}else{
			return aTreeData.map(treeData=>{

				return (
					<TreeNode title={treeData.name} key={treeData.code} cType={treeData.cType}>
						{
							treeData.features?renderLeaf(treeData.features, treeData.code):null	
						}
					</TreeNode>	
				);
			}); 
		}

	}

	onSelect(keys, event){

		const { selectedTrigger, displayInfo } = this.props;

		var key = keys[0];
		var currentKey = this.state.selectedKeys[0];
		if(key === displayInfo.rootCode || key === undefined )return;
		this.setState({selectedKeys : keys });

		if(key === currentKey){
			return;
		}
		if(getType(selectedTrigger) === 'Function'){

			selectedTrigger({
				keys: keys,
				cType: event.node.props.cType,
				parentKey: event.node.props.parentKey			// this key must get from tree node
			});
		}
	}

	render(){

		var {treeData,displayInfo } = this.props;

		var nodes  = this.buildTreeNode(treeData );
		return ( <Tree  defaultExpandedKeys={[displayInfo.rootCode ]}
			selectedKeys={this.state.selectedKeys}
			onSelect={(...args)=>this.onSelect(...args)}
		>
			<TreeNode title={displayInfo.rootName} key={displayInfo.rootCode} >
				{nodes}
			</TreeNode>
		</Tree>);
	}

}



