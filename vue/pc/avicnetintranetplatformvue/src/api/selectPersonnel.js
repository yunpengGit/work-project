/*
 * @Author: your name
 * @Date: 2021-06-02 09:58:10
 * @LastEditTime: 2021-06-11 14:22:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\api\selectPersonnel.js
 */

/**
 * 获取组织架构
 * @param onlyCurrentCompany 是否组织树只展示当前用户所在企业
 * @param onlyDept 是否仅展示部门, 否则展示部门和用户
 * @param deptId 当前选中的节点id (获取根节点不传或传0)
 */
export const orgList = {
  url: '/system/dept/treeSelectNew',
  method: 'GET'
}

// 地址簿搜索
export const searchOrg = {
  url: '/system/dept/searchTreeByName',
  method: 'GET'
}

// 获取常用部门 接口默认num=30
export const oftenDept = {
  url: '/system/often/dept',
  method: 'GET'
}

// 获取常用人员 接口默认num=30
export const oftenUser = {
  url: '/system/often/user',
  method: 'GET'
}

// 设置常用
export const setOften = {
  url: '/system/often/useranddept',
  method: 'POST'
}

// 删除常用
export const delOften = {
  url: '/system/often/delete',
  method: 'POST'
}

// 查询详情
export const getNodeInfo = {
  url: '/system/dept/treeselect/userOrDept',
  method: 'POST'
}
