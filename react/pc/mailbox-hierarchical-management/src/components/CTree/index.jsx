import React, { useEffect, useState, useContext } from 'react';
import { Tree } from 'antd';
import TreeContext from './context';
import { localStorageGet } from './../../utils/localStorageFn'
// const initTreeDate = [
//   {
//     title: 'Expand to load',
//     key: '0',
//   },
//   {
//     title: 'Expand to load',
//     key: '1',
//   },
//   {
//     title: 'Tree Node',
//     key: '2',
//     isLeaf: true,
//   },
// ];
function updateTreeData(list, key, children) {
	return list.map((node) => {
		if (node.key === key) {
			return { ...node, children };
		} else if (node.children) {
			return { ...node, children: updateTreeData(node.children, key, children) };
		}

		return node;
	});
}

const CTree = (props) => {
	const { treeData } = useContext(TreeContext)
	// const initTreeDate = props.initTreeDate
	const { parentFn, showIcon } = props
	// const expandedKeys = []
	const { getOrgChildrenList, selectDataTree } = parentFn
	const [data, setData] = useState([]);
	useEffect(() => {
		// console.log(treeData)
		setData(treeData)
	}, [treeData])
	function onLoadData({ key, children }) {
		return new Promise(async (resolve) => {
			if (children) {
				resolve();
				return;
			}
			const OrgListParams = {
				id: key
			}
			const childData = await getOrgChildrenList(OrgListParams)
			// 添加图标
			// console.log(childData)
			setData((origin) =>
				updateTreeData(origin, key, childData),
			);
			resolve();
		});
	}
	const onSelect = (selectedKeys, e) => {
		if (selectedKeys.length === 0) {
			return false
		} else {
			selectDataTree(e.selectedNodes[0])
		}
	}
	return <Tree
		showIcon={showIcon}
		loadData={onLoadData}
		treeData={data}
		onSelect={onSelect}
	// blockNode={true}
	// autoExpandParent={true}
	// defaultExpandAll={true}
	// expandedKeys={[companyId]} // 展开节点
	/>;
};
export default CTree
