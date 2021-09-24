<script>
export default {
  props: {
    scope: {
      type: Object,
      default () {
        return {}
      }
    },
    prop: {
      type: String,
      default: ''
    }
  },
  render (h) {
    const scope = this.scope
    let forbiddenList = scope['viewForbiddenFields']
    let prop = this.prop
    let row = scope
    if (!this.prop) {
      prop = scope.column.property
      forbiddenList = scope.row['viewForbiddenFields']
      row = scope.row
    }
    let el = h('span', row[prop] || '--')
    const createElement = this.$createElement
    if (
      forbiddenList &&
        forbiddenList.length &&
        forbiddenList.find((t) => t === prop)
    ) {
      el = createElement('el-tooltip', {
        props: {
          content: '抱歉，您没有查看权限',
          placement: 'bottom-start'
        }
      }, [
        createElement('span', '--')
      ])
    }

    return el
  }
}
</script>

<style lang="scss" scoped>

</style>
