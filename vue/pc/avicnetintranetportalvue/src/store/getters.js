/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-19 11:02:14
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-28 18:38:13
 */
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  userId: state => state.user.id,
  userName: state => state.user.name,
  userInfo: state => state.user.userInfo,
  secret: state => state.secret.secretLevel,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  canaryFlag: state => state.canary.canaryFlag,
  deptPaths: state => state.deptPaths.deptPaths,
  isLink: state => state.mqtt.isLink,
  permissions: state => state.user.permissions,
  website: state => state.user.website
}

export default getters
