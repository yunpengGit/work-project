import Vue from 'vue'
import store from '../store'

Vue.directive('permission', {
    inserted(el, binding, vnode) {
        // alert('sddsd')
        // console.log(binding)
        // console.log(vnode.context.$route.meta.buttons)
        const { value } = binding
        const buttons = store.state.menu.buttons
        // alert(JSON.stringify(vnode.context.$route.meta.buttons))
        if (value && buttons && buttons.length > 0) {
            if (buttons.indexOf(value) < 0) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
})
