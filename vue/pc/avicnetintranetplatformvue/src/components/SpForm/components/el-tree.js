/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-16 14:32:36
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-14 10:44:44
 */

import mergeProps from '../utils/merge-props'

let depNodes = []
function findNodeName (data, id) {
  if (Array.isArray(id)) {
    return depNodes.map(ele => ele.name).join()
  }
  let i = data.length
  let p
  let c
  while (i) {
    p = data[--i]
    if (p.children && (c = findNodeName(p.children, id))) {
      return c
    } else if (p.id === id) {
      return p.name
    }
  }
}
export default function (h, v) {
  const defaultProps = {
    props: {
      clearable: true,
      value: findNodeName(v.options, this.form[v.model])
    },
    on: {
      input: value => {
        this.form[v.model] = value
      },
      focus: e => {
        v.isShowTree = true
      }
      // ,
      // change: val => {
      //   this.submit()
      // }
    },
    nativeOn: {
      click: function (e) {
        e.stopPropagation()
      }
    }
  }

  const treeProps = {
    props: {
      data: v.options,
      placeholder: v.props.placeholder,
      clearable: true,
      accordion: true,
      highlightCurrent: true,
      props: {
        children: 'children',
        label: 'name'
      },
      nodeKey: 'id'
    },
    on: {
      check: (obj, checkedNodes) => {
        depNodes = checkedNodes.checkedNodes
        this.form[v.model] = depNodes.map(ele => ele.id)
      },
      'node-click': obj => {
        if (!v.checkStrictly && !v.checkOnClickNode) {
          if (obj.children && obj.children.length > 0) {
            return
          }
        }
        this.form[v.model] = obj.id
        v.isShowTree = false
      }
    }
  }

  if (v.showCheckbox) {
    treeProps.props['show-checkbox'] = true
  }
  if (!v.expandOnClickNode) {
    treeProps.props['expand-on-click-node'] = false
  }
  if (v.checkOnClickNode) {
    treeProps.props['check-on-click-node'] = true
  }
  if (v.checkStrictly) {
    treeProps.props['check-strictly'] = true
  }
  mergeProps(v, defaultProps)
  return <div class='el-tree-content'>
    <el-input {...defaultProps} placeholder={defaultProps.props.placeholder}></el-input>
    {
      v.isShowTree && <div class='el-select-drow-menu'>
        <el-tree {...treeProps}></el-tree>
      </div>
    }
  </div>
}
