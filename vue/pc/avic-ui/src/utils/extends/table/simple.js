/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-21 09:04:09
 */

import Loading from "../utils/loading";
import { Object } from "core-js";

export default function(Vue, UI) {
  if (!UI || !UI.Table) return;

  const props = {
    ...UI.Table.props,
    ...{
      uid: {
        default: 0
      },
      cols: {
        required: true
      },
      api: {
        required: true
      },
      hasIndex: {
        default: false
      },
      keys: {
        default: ""
      },
      keysMore: {
        default: ""
      },
      count: {
        default: 99
      },
      selection: {
        default: null
      },
      singleRow: {
        default: null
      },
      init: {
        default: true
      },
      layout: {
        default: "total, sizes, prev, pager, next, jumper, ->, slot"
      },
      btnLayout: {
        default: "submit,reset"
      }
    }
  };

  function getColumnProp(colConfig, colProp, rowConfig, h) {
    // 如果是button单独处理
    if (typeof colProp === "object" && typeof colProp.callback === "function") {
      return createButton.call(this, colConfig, colProp, rowConfig, h);
    }
    return colProp;
  }

  function createButton(colConfig, colProp, rowConfig, h) {
    const key = `${rowConfig.$index}-${colConfig.label}-${colProp.label}`;
    return [
      h(
        "el-button",
        {
          props: {
            type: "text",
            size: "small",
            icon: colProp.icon,
            loading: this.loading.is(key)
          },
          directives: colProp.directives,
          on: {
            click: () => {
              const buttonCallback = colProp.callback(rowConfig);
              if (
                typeof buttonCallback === "object" &&
                typeof buttonCallback.then === "function"
              ) {
                this.loading.open(key);
                buttonCallback.finally(() => {
                  this.loading.close(key);
                });
              }
            }
          }
        },
        colProp.label
      )
    ];
  }

  return {
    render(h) {
      const props = {
        border: false,
        data: this.tableData,
        "empty-text": this.statusText
      };

      const on = {};

      if (!Array.isArray(this.selection) && this.selection !== null) {
        props["highlight-current-row"] = true;
        on["current-change"] = rows => this.$emit("update:selection", rows);
      }

      const tableColumn = this.cols.map(v => {
        const o = {
          props: {
            ...v
          }
        };
        if (typeof v.prop !== "string") {
          o.scopedSlots = {
            default: props => {
              let prop = null;

              if (typeof v.prop === "function") {
                prop = v.prop(props, h);
              } else if (Array.isArray(v.prop)) {
                prop = [...v.prop];
              } else if (typeof v.prop === "object") {
                prop = {
                  ...v.prop
                };
              } else {
                prop = v.prop;
              }

              if (Array.isArray(prop)) {
                return prop.map(prop =>
                  getColumnProp.call(this, v, prop, props, h)
                );
              } else {
                return getColumnProp.call(this, v, prop, props, h);
              }
            }
          };
          delete o.props.prop;
        }
        return h("el-table-column", o);
      });

      if (this.$slots.default || this.$scopedSlots.default) {
        tableColumn.unshift(
          h(
            "el-table-column",
            {
              props: {
                type: "expand",
                width: "55"
              },
              scopedSlots: this.$scopedSlots
            },
            this.$slots.default
          )
        );
      }

      if (this.hasIndex && this.cols.length) {
        tableColumn.unshift(
          h("el-table-column", {
            props: {
              label: "序号",
              type: "index",
              width: "55"
            }
          })
        );
      }

      if (Array.isArray(this.selection)) {
        on["selection-change"] = rows => this.$emit("update:selection", rows);
        tableColumn.unshift(
          h("el-table-column", {
            props: {
              type: "selection",
              width: "55"
            }
          })
        );
      }

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop];
      });

      return h(
        "div",
        {
          class: "table-component"
        },
        [
          this.keys &&
            h(
              "zh-form",
              {
                props: {
                  size: "small",
                  keys: this.keys,
                  keysMore: this.keysMore,
                  count: this.count,
                  uid: this.uid,
                  layout: this.btnLayout
                },
                on: {
                  change: this.change
                }
              },
              this.$slots.form
            ),
          this.$slots.top,
          h(
            "el-table",
            {
              props,
              on,
              class: `console-box-body ${this.tableIsHide ? "dn" : ""}`,
              ref: `table-${this.uid}`
            },
            tableColumn
          ),
          this.init &&
            h(
              "zh-pagination",
              {
                props: {
                  total: this.total,
                  init: this.init,
                  uid: this.uid,
                  layout: this.layout,
                  background: true
                },
                on: {
                  change: this.change
                },
                class: "console-box-pagination"
              },
              this.$slots.pagination
            )
        ]
      );
    },
    props,
    data() {
      return {
        loading: new Loading(),
        tableLoading: null,
        tableElement: null,
        tableData: [],
        total: 0,
        statusText: "正在加载配置...",
        tableIsHide: this.init === false
      };
    },
    methods: {
      change(params) {
        if (this.tableIsHide) {
          this.tableIsHide = false;
        }
        this.tableLoading && this.tableLoading.close();
        const getTableData =
          typeof this.api === "string"
            ? this.$api(this.api, params)
            : this.api.call(this, params); // eslint-disable-line
        getTableData.then(
          response => {
            let tableData = response.rows;
            if (Array.isArray(tableData)) {
              this.tableData = tableData;
            } else {
              // 统一表格参数规范前，尝试自动修正参数
              try {
                let count = 0;
                Object.keys(response).forEach(key => {
                  if (Array.isArray(response[key])) {
                    count++;
                    // console.warn(`尝试修正${key}为list`)
                    tableData = response[key];
                  }
                });
                if (count === 1) {
                  // 存在风险,需要添加捕获方法自查
                  this.tableData = tableData;
                } else {
                  throw new Error("尝试自动读取表格数据项出错，请手动修正！");
                }
              } catch (error) {
                console.error(error);
                this.tableData = [];
              }
            }
            if (response.total) {
              this.total = response.total;
            }
            if (this.tableData.length === 0) {
              this.statusText = "数据为空!";
            }
            this.tableLoading && this.tableLoading.close();
          },
          error => {
            console.log(error);
            this.tableData = [];
            this.statusText = "数据加载失败!";
            this.tableLoading && this.tableLoading.close();
          }
        );

        try {
          if (this.tableElement === null) {
            this.tableElement = this.$refs[`table-${this.uid}`].$el;
          } else {
            this.tableLoading = this.$loading({
              target: this.tableElement
            });
          }
        } catch (error) {}
        this.statusText = "正在加载数据...";
      }
    }
  };
}
