export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    el.style.color = value
  }
}
