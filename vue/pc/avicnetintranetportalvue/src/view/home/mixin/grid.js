/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-14 15:34:05
 * @LastEditors: peng
 * @LastEditTime: 2021-07-19 14:40:41
 */
export default {
  name: 'grid',
  data () {
    return {
      // 需要动态处理h的组件
      nameList: ['Todo', 'Upcoming', 'FocusWork', 'ToBeRead', 'Done'],
      // 标记已有的行组
      HArr: [],
      group: [], // 按照行分组
      groupRemainderX: [] // 记录每行的占已有内容占多少栅格
    }
  },
  computed: {
    // 新增模块到新一行，记录上一行数据对象（各个模块占比，行栅格，高栅格数）
    prevLine () {
      const len = this.group.length
      return this.group[len - 1]
    }
  },
  methods: {
    addItem (item) {
      this.pushLast(item)
    },
    pushLast (item) {
      const arr = this.layout
      // 判断最后一个模块位置处理新模块位置
      let nx = 0
      let ny = 0
      const len = arr.length
      let atom = {}
      if (len > 0) {
        atom = arr[len - 1]
        // 最后一个元素的占位
        const { x, y, w, h } = atom
        // 当前 x 剩余宽度
        const remainderX = 12 - (x + w)
        // 判断新元素占比宽度是否大于剩余宽
        // console.log(remainderX)
        if (item.w > remainderX) {
          // console.log('y', y)
          // console.log('h', h)
          ny = y + h
          nx = 0
        } else {
          ny = y
          nx = x + w
        }
      }
      const obj = {
        x: nx,
        y: ny,
        // x: w % (this.colNum || 12),
        // y: Infinity,
        i: (+new Date()) + '',
        ...item
        // w: item.w,
        // h: item.h,
        // iconUrl: item.iconUrl,
        // componentId: item.componentId,
        // componentName: item.componentName,
        // label: item.label
      }
      // console.log(obj)
      arr.push(obj)
    },
    removeItem (dom) {
      const index = this.layout.map(item => item.i).indexOf(dom.i)
      this.layout.splice(index, 1)
      if (this.dragDOMs) {
        this.dragDOMs.splice(dom.index, 0, dom)
      }
      // this.groupFn()
    },
    pushPosition (item) {
      // console.log(item)
      // 第一个元素直接push
      const len = this.layout.length
      const arr = this.layout
      const idx = 0
      const groupLen = this.group.length
      const group = this.group
      // 当前元素放置的位置
      let nx = 0
      let ny = 0
      if (len > 0) {
        const groupRemainderX = this.groupRemainderX
        let index = 0
        const obj = groupRemainderX.find((e, idx) => {
          index = idx
          return (12 - e) >= item.w
        })
        if (obj) {
          ny = group[index][0].y
          nx = obj
        } else {
          ny = group[groupLen - 1][0].y + group[groupLen - 1][0].h
          nx = 0
        }
      }
      const obj = {
        x: nx,
        y: ny,
        w: item.w,
        h: item.h,
        i: () => (+new Date()) + '',
        name: item.name,
        label: item.label,
        size: item.size
      }
      // console.log(obj)
      arr.push(obj)
      this.groupItem(obj, idx)
    },
    // 按照行 h 数据分组
    groupFn () {
      const arr = this.layout

      // const result = []
      // arr.forEach(e => {
      //   const index = this.HArr.indexOf(e.y)
      //   if (index === -1) {
      //     this.HArr.push(e.y)
      //     result[this.HArr.length - 1] = [e]
      //   } else {
      //     result[index].push(e)
      //   }
      // })
      const result = arr.reduce((prev, next) => {
        const index = this.HArr.indexOf(next.y)
        // console.log(next)
        // 没有记录的行，添加记录
        if (index === -1) {
          // console.log(1)
          this.HArr.push(next.y)
          prev[this.HArr.length - 1] = [next]
        } else {
          // console.log(prev)
          // console.log(index)
          // console.log(prev[index])
          prev[index].push(next)
          // console.log(prev)
        }
        return prev
      }, [])
      this.group = result
      this.groupRemainderXFn()
    },
    groupItem (item, idx) {
      this.HArr.push(item.y)
      this.group[idx] ? this.group[idx].push(item) : this.group.push([item])
      this.groupRemainderX[idx] = this.groupRemainderX[idx] ? this.groupRemainderX[idx] : 0 + item.w
      // const len = this.HArr
      // if (len === 0) {
      //   this.HArr.push(item.y)
      //   this.group.push([item])
      // } else {

      // }
    },
    groupRemainderXFn () {
      this.groupRemainderX = this.group.map(e => {
        return e.reduce((p, n) => {
          return p.w + n.w
        })
      })
    }

  }
}
