/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-19 10:23:40
 */

import mergeProps from "../utils/merge-props";

export default function(h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model]
    },
    on: {
      input: value => {
        this.form[v.model] = value;
      }
    }
  };

  mergeProps(v, defaultProps);

  if (Array.isArray(v.default)) {
    return h(
      "el-checkbox-group",
      defaultProps,
      v.options.map(v => {
        return h("el-checkbox", {
          props: {
            label: v
          }
        });
      })
    );
  } else {
    return h("el-checkbox", defaultProps, v.options[0]);
  }
}
