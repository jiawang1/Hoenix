import React, { Component, PropTypes } from 'react';
import { Tree } from 'antd';
import { getType } from './../common/helper.js';

const TreeNode = Tree.TreeNode;

export class CategoryTree extends Component {

	constructor() {

		super();
		this.state = {
			selectedKeys: [],
		};
	}
	onLoad(treeNode) {
		var { retrieveCategory, condition } = this.props;
		var ops = {
			code: treeNode.props.eventKey,
			path: treeNode.props.categoryPath
		};
		if (condition) {
			ops = {
				...ops,
				...condition
			};
		}
		return retrieveCategory(ops);
	}

	componentDidMount() {
		this.__reload();
	}
	__reload(props) {

		var __props = props || this.props;
		const { retrieveCategory, condition } = __props;
		(condition ? retrieveCategory(condition) : retrieveCategory()).then((json) => {
			if (json && json.status === 'success') {
				const { selectedTrigger } = __props;
				var aCatalog = (getType(json.map.__content__) === 'String') ? JSON.parse(json.map.__content__) : json.map.__content__;
				this.setState({ selectedKeys: [aCatalog[0].code] });
				if (getType(selectedTrigger) === 'Function') {
					selectedTrigger({
						keys: [aCatalog[0].code],
						title: aCatalog[0].name,
						categoryPath: aCatalog[0].categoryPath
					});
				}
			}
		});
	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.shouleRefresh) {
			this.__reload(nextProps);
		}
		if (nextProps.selectedKeys && nextProps.selectedKeys.length > 0) {
			this.setState({ selectedKeys: nextProps.selectedKeys });
		}
	}

	buildTreeNode(category) {
		const loop = (aCategory) => {
			if (aCategory.length === 0) {
				return;
			}
			return aCategory.map((oCategory) => {
				if (oCategory.isLeafCategory) {
					return (<TreeNode title={oCategory.name} key={oCategory.code} categoryPath={oCategory.categoryPath} isLeaf={oCategory.isLeafCategory} />);
				} else {
					var subArray = [];
					Object.keys(oCategory).map(key => {
						if (getType(oCategory[key]) === 'Object') {
							subArray.push(oCategory[key]);
						}
					});
					return (<TreeNode title={oCategory.name} key={oCategory.code} categoryPath={oCategory.categoryPath} >{loop(subArray)}</TreeNode>);
				}
			});
		};
		if (!category) {
			return null;
		} else {
			return loop([category]);
		}
	}

	onSelect(keys, event) {

		const { selectedTrigger } = this.props;
		var key = keys[0];
		var currentKey = this.state.selectedKeys[0];
		if (key === 'root' || key === undefined) return;
		this.setState({ selectedKeys: keys });
		if (key === currentKey) {
			return;
		}
		if (getType(selectedTrigger) === 'Function') {
			selectedTrigger({
				keys: keys,
				title: event.node.props.title,
				categoryPath: event.node.props.categoryPath
			});
		}
	}

	render() {
		const { category, expandLoad } = this.props;
		var treeNodes = this.buildTreeNode(category);
		return treeNodes ? (
			<Tree loadData={(...args) => this.onLoad(...args)}
				onSelect={(...args) => this.onSelect(...args)}
				selectedKeys={this.state.selectedKeys}
				defaultExpandedKeys={["root"]}
			>
				{treeNodes}
			</Tree>
		) : null;
	}
}

CategoryTree.propTypes = {
	selectedTrigger: PropTypes.func,
	condition: PropTypes.object,
	expandLoad: PropTypes.func
};

