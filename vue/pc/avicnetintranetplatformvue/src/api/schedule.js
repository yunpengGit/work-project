const schedule = '/portal/schedule'
/**
 * 用户查询指定日期区间内的日程（以日期维度返回）
 * @param data
 * @returns {*}
 */
export const getDateEvents = {
  url: `${schedule}/user/events/get/dateAsDimension`,
  method: 'post'
}

/**
 * 查询用户设置
 * @returns {*}
 */
export const getUserSetting = {
  url: `${schedule}/user/setting`,
  method: 'get'
}

/**
 * 查询共享给我的权限信息
 * @param permsTypesIn 权限范围 NO-无；READONLY-仅查看；READWRITE-创建、编辑、查看
 * @returns {*}
 */
export const getEventAuthAsSubscriber = {
  url: `${schedule}/user/eventSubscribes`,
  method: 'get'
}

/**
 * 用户查询个人共享权限信息
 * @param permsTypesIn 权限范围 NO-无；READONLY-仅查看；READWRITE-创建、编辑、查看
 * @returns {*}
 */
export const getEventAuthAsSharer = {
  url: `${schedule}/user/eventShares`,
  method: 'get'
}

/**
 * 用户查询个人共享权限信息(新)
 * @param permsTypesIn 权限范围 NO-无；READONLY-仅查看；READWRITE-创建、编辑、查看
 * @returns {*}
 */
export const getEventAuthAsSharer2 = {
  url: `${schedule}/user/permsOwners/eventShares`,
  method: 'get'
}

/**
 * 新建日程
 * @param data
 * @returns {*}
 */
export const postEvents = {
  url: `${schedule}/events`,
  method: 'post'
}

/**
 * 修改日程
 * @param eventId
 * @param data
 * @returns {*}
 */
export const putEvent = {
  url: `${schedule}/events/:eventId&rangeTypeIfRecurr=:rangeTypeIfRecurr&targetEventDate=:targetEventDate`,
  method: 'put'
}

/**
 * 查询日程详情
 * @param eventId
 * @param targetEventDate
 * @returns {*}
 */
export const getEvent = {
  url: `${schedule}/events/:eventId`,
  method: 'get'
}

/**
 * 删除日程
 * @param eventId
 * @returns {*}
 */
export const deletEvent = {
  emulateJSON: true,
  url: `${schedule}/events/:eventId`,
  method: 'delete'
}

/**
 * 保存用户设置
 * @param data 未变更的值可以不传
 * @returns {*}
 */
export const putUserSetting = {
  url: `${schedule}/user/setting/selective`,
  method: 'put'
}

/**
 * 添加日程授权（共享/订阅）
 * @param authzType 授权方式 SHARE-共享 SUBSCRIBE-订阅
 * @param data
 * @returns {*}
 */
export const postEventAuth = {
  url: `${schedule}/eventAuthzs&authzType=:authzType`,
  method: 'post'
}

/**
 * 设置日程授权权限
 * @param authzId 用户id
 * @param permsType 权限范围 READONLY-仅查看 READWRITE-创建、编辑、查看
 */
export const putEventAuth = {
  url: `${schedule}/eventAuthzs/:authzId&permsType=:permsType`,
  method: 'put'
}

/**
 * 解除日程授权
 * @param authzId 用户id
 * @returns {*}
 */
export const deleteEventAuth = {
  url: `${schedule}/eventAuthzs/:authzId`,
  method: 'delete'
}

/**
 * 查询日程共享统计信息
 * @param sharerUserNameLike 共享方姓名
 * @returns {*}
 */
export const sharesStatistics = {
  url: `${schedule}/eventShares/statistics`,
  method: 'get'
}

/**
 * 查询日程共享详情
 * @param userId
 * @returns {*}
 */
export const getEventSharesInfo = {
  url: `${schedule}/users/:userId/eventShares`,
  method: 'get'
}

/**
 * 批量操作日程共享（添加、编辑、删除，删除只需要都传空）
 * @param sharerId  共享方ID
 * @param writePermsUserIds  编辑权限用户ID	空会清空已有编辑权限用户
 * @param readPermsUserIds  查看权限用户ID	空会清空已有查看权限用户
 * @returns {*}
 */
export const eventSharesBatch = {
  url: `${schedule}/eventShares/batch`,
  method: 'post'
}

/**
 * 查询原始日程（管理后台用）
 * @returns {*}
 */
export const getOriginalEvents = {
  // isString: true,
  // emulateJSON: true,
  url: `${schedule}/original/events`,
  method: 'get'
}

/**
 * 查询分类
 * @returns {*}
 */
export const getLabels = {
  url: `${schedule}/labels`,
  method: 'get'
}

/**
 * 修改分类
 * @param status 表示要修改的状态，启用-ENABLED；停用-DISABLED
 * @returns {*}
 */
export const putLabelsStatus = {
  emulateJSON: true,
  url: `${schedule}/labels/:labelId/status`,
  method: 'PUT'
}

/**
 * 新增分类
 * @param name 名称
 * @returns {*}
 */
export const addLabels = {
  url: `${schedule}/labels`,
  method: 'post'
}

/**
 * 修改分类
 * @param name 名称
 * @returns {*}
 */
export const putLabels = {
  url: `${schedule}/labels/:labelId`,
  method: 'PUT'
}

/**
 * 根据授权请求ID查询授权请求信息
 */
export const getEventAuthReq = {
  url: `${schedule}/eventAuthzReqs/:authzReqId`,
  method: 'get'
}

/**
 * 审批授权申请审批
 * @param requestId 请求id
 * @param approved 是否统一权限变更 true|false
 * @returns {*}
 */
export const confirmEventAuth = {
  emulateJSON: true,
  url: `${schedule}/eventAuthzReqs/:requestId/review`,
  method: 'put'
}
