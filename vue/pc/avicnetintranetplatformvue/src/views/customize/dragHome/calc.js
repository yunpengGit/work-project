/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-06-22 14:49:58
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-22 16:27:38
 */
const calc = (itemH, colNum, blockH) => {
  // // 当前展示内容项
  // const itemH = this.itemH
  // // 内容展示区域
  // const blockH = this.blockH

  // 计算
  const rowNum = ~~(blockH / itemH)

  const pageSize = colNum * rowNum
  return pageSize
}
export default calc
