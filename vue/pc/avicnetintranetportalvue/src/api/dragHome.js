/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 15:01:21
 * @LastEditors: peng
 * @LastEditTime: 2021-09-08 15:14:20
 */

// 查询组件列表
export const componentList = {
  url: '/portal/component/list/category',
  method: 'GET'
}
// 首页查询模板配置数据
export const userTemplate = {
  url: '/portal/template/user/list',
  method: 'GET'
}
// 查询模板配置数据
export const detailTemplate = {
  url: '/portal/template/:templateId/detail',
  method: 'GET'
}

// 保存模板配置数据
export const addTemplate = {
  url: '/portal/template/add',
  method: 'POST'
}

// 更新模板配置数据
export const updateTemplate = {
  url: `/portal/template/:templateId/update`,
  method: 'POST'
}
// 更新模板配置数据
export const screenshotUpload = {
  // baseURL: '/mock',
  url: `/file/publicPic/upload`,
  Headers: {
    'Content-Type': 'multipart/form-data'
  },
  method: 'POST'
}

/**
 * @name: templateList
 * @msg: 查询模板列表
 * @param {templateName}
 * @param {templateType}  模板类型 1定制化模板 2拖曳模板
 * @param {pageNum}
 * @param {pageSize}
 * @return {*}
 */
export const templateList = {
  url: `/portal/template/list`,
  method: 'GET'
}

/**
 * @name: deleteTemplate
 * @msg: 删除模板
 * @param {templateId}
 * @return {*}
 */
export const deleteTemplate = {
  url: `/portal/template/:templateId/delete`,
  method: 'POST'
}

/**
 * @name: changeTemplateState
 * @msg: 停启用模板
 * @param {templateId}
 * @param {state}  停启用状态 1启用 0停用
 * @return {*}
 */
export const changeTemplateState = {
  url: `/portal/template/:templateId/changeState/:state`,
  method: 'POST'
}

/**
 * @name: authorizeTemplate
 * @msg: 删除模板
 * @param {templateId}
 * @param {[{deptUserId:'',deptUserName:'',type:''}]}
 * @return {*}
 */
export const authorizeTemplate = {
  isString: true,
  url: `/portal/template/:templateId/authorize`,
  method: 'POST'
}

/**
 * @msg: 文件上传
 * @param {*}
 * @return {*}
 */
export const fileUpload = {
  url: `/file/publicPic/upload`,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

/**
 * @msg: 新增页面
 * @param {*}
 * @return {*}
 */
export const pageAdd = {
  url: `/portal/page/add`,
  method: 'POST'
}
/**
 * @msg: 页面更新
 * @param {*}
 * @return {*}
 */
export const pageUpdate = {
  url: `/portal/page/update`,
  method: 'POST'
}
/**
 * @msg: 自定义栏目组件查询栏目下的内容
 * @param {*}
 * @return {*}
 */
export const contents = {
  url: `/portal/cms/user/viewable/contents`,
  method: 'GET'
}
