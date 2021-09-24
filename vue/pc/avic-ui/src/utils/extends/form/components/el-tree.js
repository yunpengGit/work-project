/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-19 10:24:13
 */

import mergeProps from "../utils/merge-props";

let depNodes = [];
function findNodeName(data, id) {
  if (Array.isArray(id)) {
    return depNodes.map(ele => ele.name).join();
  }
  let i = data.length;
  let p;
  let c;
  while (i) {
    p = data[--i];
    if (p.children && (c = findNodeName(p.children, id))) {
      return c;
    } else if (p.id === id) {
      return p.name;
    }
  }
}
export default function(h, v) {
  const defaultProps = {
    props: {
      clearable: true,
      value: findNodeName(v.options, this.form[v.model])
    },
    on: {
      input: value => {
        this.form[v.model] = value;
      },
      focus: e => {
        v.isShowTree = true;
      }
    },
    nativeOn: {
      click: function(e) {
        e.stopPropagation();
      }
    }
  };

  const treeProps = {
    props: {
      data: v.options,
      clearable: true,
      accordion: true,
      highlightCurrent: true,
      props: {
        children: "children",
        label: "name"
      },
      nodeKey: "id"
    },
    on: {
      check: (obj, checkedNodes) => {
        if (v.getAllCheckBox) {
          depNodes = checkedNodes.checkedNodes;
          this.form[v.model] = depNodes.map(ele => ele.id);
        } else {
          depNodes = checkedNodes.checkedNodes.filter(
            ele => ele.type == "DEPT"
          );
          this.form[v.model] = depNodes.map(ele => ele.id);
        }
      },
      "node-click": obj => {
        if (obj.children && obj.children.length > 0) {
          return;
        }
        this.form[v.model] = obj.id;
        v.isShowTree = false;
      }
    }
  };

  if (v.showCheckbox) {
    treeProps.props["show-checkbox"] = true;
  }
  mergeProps(v, defaultProps);

  return h(
    "div",
    {
      class: "el-tree-content"
    },
    [
      h("el-input", defaultProps),
      v.isShowTree &&
        h(
          "div",
          {
            class: "el-select-drow-menu"
          },
          [h("el-tree", treeProps)]
        )
    ]
  );
}
