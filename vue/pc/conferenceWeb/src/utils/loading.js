import { Loading } from 'element-ui'
import store from '../store'

export function showLoading() {
    return Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(255, 255, 255, 0.5)',
        spinner: 'el-icon-loading'
    })
}

export function closeLoading(loadingInstance) {
    if (loadingInstance !== null) {
        loadingInstance.close()
    }
}

export function showTextLoading(text) {
    return Loading.service({
        lock: true,
        text: text,
        background: 'rgba(255, 255, 255, 0.5)',
        spinner: 'el-icon-loading'
    })
}

export function showViewLoading() {
    store.state.user.loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(255, 255, 255, 0.5)',
        spinner: 'el-icon-loading'
    })
}
export function closeViewLoading() {
    const loadingInstance = store.state.user.loading
    if (loadingInstance !== null) {
        loadingInstance.close()
    }
}
