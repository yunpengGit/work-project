# eslint 配置说明

#### 添加配置规则，直接在pagejson.json 的eslintConfig属性中添加添加rules

vs code 添加插件 editorConfig for VS code，webstorm默认应该是有，没有添加一下（这个插件配合.editorconfig文件使用）
统一编辑器的风格，用来协同团队开发人员之间的代码的风格及样式规范化的一个工具

#### 忽略eslint检查

``` js
//块忽略

/* eslint-disable */
 //代码逻辑
/* eslint-disable */

//行忽略
()=>{}  //eslint-disable-line
```
