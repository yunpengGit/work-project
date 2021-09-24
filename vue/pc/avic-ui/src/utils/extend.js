import Vue from "vue";
import Element from "element-ui";
import Cookies from "js-cookie";

import Pagination from "./extends/pagination";
import ScreenForm from "./extends/form";
import SimpleTable from "./extends/table/simple";
import SimpleDialog from "./extends/dialog/simple";

Vue.component("zh-pagination", Pagination(Vue, Element));
Vue.component("zh-form", ScreenForm(Vue, Element));
Vue.component("zh-table", SimpleTable(Vue, Element));
Vue.component("zh-dialog", SimpleDialog(Vue, Element));
Vue.use(Element, {
  size: Cookies.get("size") || "small" // set element-ui default size
});
