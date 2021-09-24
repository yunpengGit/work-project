/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-19 10:24:10
 */
// import renderProps from '../utils/render-props'
import mergeProps from "../utils/merge-props";

export default function(h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model],
      clearable: true
    },
    on: {
      input: value => {
        if (v.relational) {
          this.form[v.relational] = "";
        }

        this.form[v.model] = value;
      }
    }
  };
  mergeProps(v, defaultProps);

  // if (Array.isArray(v.default)) {
  //   base.props.multiple = true
  // }

  if (typeof defaultProps.props["remote-method"] === "function") {
    const oldRemoteMethod = defaultProps.props["remote-method"];
    defaultProps.props["remote-method"] = function() {
      oldRemoteMethod.apply(v, arguments);
    };
  }

  return h(
    "el-select",
    defaultProps,
    Array.isArray(v.options) &&
      v.options.length !== 0 &&
      v.options.map(v => {
        return h("el-option", {
          props: {
            key: v.value,
            label: v.label,
            value: v.value
          }
        });
      })
  );
}
