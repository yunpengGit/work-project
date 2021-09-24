const getters = {
  roles: state => state.user.roles,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  info: state => state.user.info,
  addRouters: state => state.permission.addRouters
}
export default getters
