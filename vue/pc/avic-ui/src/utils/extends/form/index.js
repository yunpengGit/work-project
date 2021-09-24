/* eslint-disable */
/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-21 11:02:04
 */

import Params, {
  addRule,
  parse,
  componentization
} from "../utils/router-params";
import { Base64 } from "js-base64";
import { COMPONENT_NAME as PAGINATION_COMPONENT_NAME } from "../pagination";

import * as formItems from "@/form-search";
import { Object } from "core-js";

function removeEmptyParams(params) {
  let o = null;
  let c = null;
  let i = null;
  for (i in params) {
    c = params[i];
    if (c !== "") {
      if (o === null) {
        o = {};
      }
      o[i] = c;
    }
  }
  return o;
}

export const COMPONENT_NAME = "F";
addRule(COMPONENT_NAME, {
  parse(params) {
    return JSON.parse(Base64.decode(params));
  },
  componentization(params) {
    return Base64.encode(JSON.stringify(params));
  }
});

export default function(Vue, UI) {
  if (!UI || !UI.Form) return;

  const props = {
    ...UI.Form.props,
    ...{
      uid: {
        default: 0
      },
      keys: {
        required: true
      },
      count: {
        default: 99
      },
      expand: {
        default: false
      },
      layout: {
        default: "submit,reset"
      }
    }
  };

  return {
    data() {
      const params = new Params(COMPONENT_NAME, this.uid);
      const parsedParams = params.parse(this.$route.query) || {};
      const form = {};
      const initQueue = [];
      const items = [];
      Object.keys(formItems)
        .filter(
          v =>
            ~this.keys
              .split(",")
              .map(v => v.trim())
              .indexOf(v)
        )
        .sort((a, b) => this.keys.indexOf(a) - this.keys.indexOf(b))
        .forEach(v =>
          Array.isArray(formItems[v])
            ? formItems[v].forEach(v => items.push(v))
            : items.push(formItems[v])
        );

      items.forEach(item => {
        form[item.model] = parsedParams[item.model] || item.default || "";
        item.init && initQueue.push(item);
      });

      return {
        initQueue,
        params,
        items,
        form
      };
    },

    watch: {
      $route(newValue, oldValue) {
        const newQuery = this.params.parse(newValue.query);
        const oldQuery = this.params.parse(oldValue.query);
        if (!oldQuery && !newQuery) {
          // this.reset()
          return;
        }
        if (oldQuery && !newQuery) {
          this.reset();
          return;
        }

        if (!oldQuery && newQuery) {
          this.form = {
            ...this.form,
            ...newQuery
          };
          return;
        }

        if (oldQuery && newQuery) {
          Object.keys(newQuery).forEach(prop => {
            if (newQuery[prop] !== oldQuery[prop]) {
              this.form[prop] = newQuery[prop];
            }
          });
        }
      }
    },
    props,
    render(h, context) {
      const props = {
        inline: true,
        model: this.form
      };

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop];
      });
      let isExpand = false;
      return h(
        "div",
        {
          class: "zh-form"
        },
        [
          h(
            "el-form",
            {
              props,
              ref: `zh-form-${this.uid}`
            },
            [
              ...this.items.map((v, i) => {
                let rules = v.rules || [];
                if (typeof rules === "function") {
                  rules = rules.call(v, this);
                }
                if (this.items.length > this.count) {
                  isExpand = true;
                }
                return (
                  (i < this.count || this.expand) &&
                  h(
                    "el-form-item",
                    {
                      props: {
                        label: v.label,
                        prop: v.model,
                        size: "small",
                        rules
                      }
                    },
                    [require(`./components/${v.type}`).default.call(this, h, v)]
                  )
                );
              }),
              ...[
                h("el-form-item", [
                  this.layout.indexOf("submit") !== -1 &&
                    h(
                      "el-button",
                      {
                        class: "filter-select-btn",
                        props: {
                          type: "primary",
                          icon: "el-icon-search"
                        },
                        on: {
                          click: this.submit
                        }
                      },
                      "查询"
                    )
                ]),
                this.layout.indexOf("reset") !== -1 &&
                  h("el-form-item", [
                    h(
                      "el-button",
                      {
                        props: {
                          icon: "el-icon-refresh"
                        },
                        on: {
                          click: this.reset
                        }
                      },
                      "重置"
                    )
                  ]),
                isExpand &&
                  h(
                    "el-form-item",
                    {
                      props: {
                        size: "small"
                      }
                    },
                    [
                      h(
                        "el-button",
                        {
                          props: {
                            size: "small"
                          },
                          on: {
                            click: this.toggle
                          }
                        },
                        this.expand ? "收起" : "更多"
                      )
                    ]
                  ),
                this.$slots.default
              ]
            ]
          )
        ]
      );
    },
    methods: {
      syncRouterParams(callback) {
        const arg = [].slice.call(arguments, 1);
        // 临时对路由数据处理
        const paginationRouterParams = parse(
          PAGINATION_COMPONENT_NAME,
          this.uid,
          this.$route.query
        );

        // 去空参
        let form = removeEmptyParams(arg[0]);

        let query = {
          ...this.$route.query,
          ...this.params.componentization(form)
        };

        if (form === null) {
          delete query[`${COMPONENT_NAME}.${this.uid}`];
        }

        if (paginationRouterParams) {
          paginationRouterParams.pageNum = 1;
          form = {
            ...form,
            ...paginationRouterParams
          };
          query = {
            ...query,
            ...componentization(
              PAGINATION_COMPONENT_NAME,
              this.uid,
              paginationRouterParams
            )
          };
        }

        arg[0] = form || {};

        // 强制change
        if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
          callback && callback.apply(callback, arg);
          return;
        }

        this.$router.push(
          {
            query
          },
          function() {
            callback && callback.apply(callback, arg);
          }
        );
      },
      submit() {
        this.$refs[`zh-form-${this.uid}`].validate(valid => {
          if (valid) {
            this.syncRouterParams(form => {
              this.$emit("change", form);
            }, this.form);
          }
        });
      },
      reset() {
        this.$refs[`zh-form-${this.uid}`].resetFields();
        Object.keys(this.form).forEach(v => {
          try {
            this.form[v] =
              this.items.filter(c => c.model === v)[0].default || "";
          } catch (error) {
            this.form[v] = "";
          }
        });
        this.syncRouterParams(form => {
          this.$emit("reset", form);
        }, this.form);
      },
      toggle() {
        this.expand = !this.expand;
      }
    },
    mounted() {
      this.initQueue.forEach(v => {
        v.init(this);
      });
    }
  };
}
