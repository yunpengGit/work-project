const showLimit = 3
/**
 * 检测内容是否超出指定行数高度限制
 * @param {HTMLElement} element
 * @returns {*}
 */
function getIsOverLimitHeight (element) {
  const lineHeight = parseFloat(window.getComputedStyle(element, null).getPropertyValue('line-height'))
  if (element.offsetHeight <= lineHeight * showLimit) {
    return false
  } else {
    return `${lineHeight * showLimit - 1}px`
  }
}
/**
 * 查看更多
 * @param {HTMLElement} element
 */
function handleShowMore (element) {
  const maxShowHeight = getIsOverLimitHeight(element)
  if (!maxShowHeight) {
    element.classList.remove('limit')
  } else {
    element.classList.add('limit')
    element.style.height = maxShowHeight
  }
}
export default {
  methods: {
    /**
         * 初始化三行显示
         * @param refs
         */
    initShowMore (refs) {
      if (!Array.isArray(refs)) {
        throw new Error('argument must be an array')
      } else {
        const that = this
        that.$nextTick(() => {
          refs.forEach(ref => {
            that.$refs[ref] && handleShowMore(that.$refs[ref][0])
          })
        })
      }
    },
    /**
         * 点击箭头展开收起
         * @param e
         * @param ref
         */
    showMoreClick (e, ref) {
      this.$nextTick(() => {
        const element = this.$refs[ref][0]
        if (!element.classList.contains('collapse')) {
          element.classList.remove('limit')
          element.classList.add('collapse')
        } else {
          element.classList.remove('collapse')
          element.classList.add('limit')
        }
      })
      // e.target.remove()
    }
  }
}
