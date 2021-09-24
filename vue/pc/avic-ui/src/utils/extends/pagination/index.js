/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-20 09:50:48
 */

import Params, { addRule, parse } from "../utils/router-params";
import { COMPONENT_NAME as SCREEN_FORM_COMPONENT_NAME } from "../form";
import { mapState } from "vuex";

export const COMPONENT_NAME = "P";

addRule(COMPONENT_NAME, {
  parse(params) {
    params = params.split(".");
    return {
      currentPage: +params[0],
      pageSize: +params[1]
    };
  },
  componentization(params) {
    return Object.keys(params)
      .map(v => params[v])
      .join(".");
  }
});

export default function(Vue, UI) {
  if (!UI || !UI.Pagination) return;

  const props = {
    ...UI.Pagination.props,
    ...{
      uid: {
        default: 0
      },
      init: {
        default: true
      }
    }
  };

  return {
    data() {
      const params = new Params(COMPONENT_NAME, this.uid);
      const parsedParams = params.parse(this.$route.query);
      return {
        params,
        timer: null,
        proxy: {
          props: {
            pageNum: parsedParams ? parsedParams.currentPage : this.currentPage,
            pageSize: parsedParams ? parsedParams.pageSize : this.pageSize
          },
          events: {
            currentPage: ["update:currentPage", "current-change"],
            pageSize: ["update:pageSize", "size-change"]
          }
        }
      };
    },
    props,
    computed: mapState({
      updateTime: state => state.table.time,
      updateUID: state => state.table.uid
    }),
    watch: {
      updateTime() {
        if (
          this.updateUID === this.uid ||
          this.updateUID === "UPDATE_ALL_TABLE_DATA"
        ) {
          this.emitChange();
        }
      },
      currentPage(value) {
        this.sync("currentPage", value);
      },
      pageSize(value) {
        this.sync("pageSize", value);
      },
      $route(newValue, oldValue) {
        const newQuery = this.params.parse(newValue.query);
        const oldQuery = this.params.parse(oldValue.query);

        if (!oldQuery && !newQuery) {
          return;
        }
        if (oldQuery && !newQuery) {
          Object.keys(this.proxy.props).forEach(prop =>
            this.sync(prop, this[prop], false, false)
          );
          return;
        }

        if (!oldQuery && newQuery) {
          Object.keys(this.proxy.props).forEach(prop =>
            this.sync(prop, newQuery[prop], false, false)
          );
          return;
        }

        if (oldQuery && newQuery) {
          Object.keys(newQuery).forEach(prop => {
            newQuery[prop] !== oldQuery[prop] &&
              this.sync(prop, newQuery[prop], false, false);
          });
        }
      }
    },
    render(h, context) {
      const props = {
        layout: "total, sizes, prev, next, pager, jumper, ->, slot"
      };

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop];
      });

      props.currentPage = this.proxy.props.currentPage;
      props.pageSize = this.proxy.props.pageSize;

      return h(
        "div",
        {
          class: "zh-pagination clearfix"
        },
        [
          this.$slots.default,
          h("el-pagination", {
            props,
            class: "r",
            on: {
              "size-change": this.sizeChange,
              "current-change": this.currentChange
            }
          })
        ]
      );
    },
    methods: {
      sizeChange(pageSize) {
        this.sync("pageSize", pageSize);
      },
      currentChange(currentPage) {
        this.sync("currentPage", currentPage);
      },
      syncRouterParams(callback) {
        const arg = [].slice.call(arguments, 1);
        this.$router.push(
          {
            query: {
              ...this.$route.query,
              ...this.params.componentization(this.proxy.props)
            }
          },
          function() {
            callback && callback.apply(callback, arg);
          }
        );
      },
      emitChange(prop, value) {
        const parentListeners = this.$options._parentListeners;
        const events = this.proxy.events[prop];

        if (Array.isArray(events)) {
          events.forEach(event => {
            parentListeners.hasOwnProperty(event) && this.$emit(event, value); // eslint-disable-line
          });
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const screenFormParams = parse(
            SCREEN_FORM_COMPONENT_NAME,
            this.uid,
            this.$route.query
          );
          this.$emit(
            "change",
            screenFormParams
              ? {
                  ...this.proxy.props,
                  ...screenFormParams
                }
              : {
                  ...this.proxy.props
                }
          );
        }, 30);
      },
      sync(prop, value, syncRouter = true, emitChange = true) {
        this.proxy.props[prop] = value;
        if (syncRouter && emitChange) {
          this.syncRouterParams(this.emitChange, prop, value);
        }
        if (syncRouter && !emitChange) {
          this.syncRouterParams();
        }
      }
    },
    created() {
      const screenFormParams = parse(
        SCREEN_FORM_COMPONENT_NAME,
        this.uid,
        this.$route.query
      );
      if (this.init || screenFormParams !== null) {
        this.emitChange();
      }
    }
  };
}
