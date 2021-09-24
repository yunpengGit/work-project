<!--
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-26 10:23:06
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-26 14:41:11
-->
## 页面缩放处理

### 新建页面，组件 使用自定义模板

### 添加代码段模板  ww

> 不使用 vue 模板中 style 标签的 scoped 属性

````vue
{
	"Print to console": {
		"prefix": "ww",
		"body": [
			"<template>",
			"  <div class='$0${TM_FILENAME_BASE}'>\n",
			"  </div>",
			"</template>\n",
			"<script>",
			"export default {",
			"  name: '${TM_FILENAME_BASE}',",
			"  components: {\n",
			"  },",
			"  data () {",
			"    return {\n",
			"    }",
			"  },",
			"  methods: {\n",
			"  },",
			"}",
			"</script>\n",
			"<style lang=\"scss\">",
			"@import '@/ui/mixin.scss';",
			"@mixin del(\\$sc: 1, \\$fs: 14px){",
			"  .$1${TM_FILENAME_BASE}{\n",
			"  }",
			"}",
			"@import '@/ui/size/scale.scss'",
			"</style>\n",
	],
	"description": "Create vue template"
	}
}
````

### 为新 新页面 、新组建添加 class

class格式：

公共组件： components-组件名称

公共组件内部组件：components-组件名称-内部组件名称



模块：模块名称

模块下的页面：模块名称-模块下的页面名称

页面内部组件：页面名称-页面内部组件名称