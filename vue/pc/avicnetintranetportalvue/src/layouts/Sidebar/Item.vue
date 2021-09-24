<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:30
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-01 15:22:02
-->
<script>
import iconSvg from '@/components/icon-svg'
export default {
  name: 'MenuItem',
  functional: true,
  components: {
    iconSvg
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<iconSvg name={icon} class='menu-icon'/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
