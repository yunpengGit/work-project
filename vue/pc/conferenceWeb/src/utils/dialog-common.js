import { Message, MessageBox } from 'element-ui'

export function htmlDialogWithCancel(title, html) {
    return MessageBox.alert(html, title, {
        dangerouslyUseHTMLString: true
    })
}

export function successMessage(message) {
    Message({
        message: message,
        type: 'success'
    })
}

export function warningMessage(message) {
    Message({
        message: message,
        type: 'error'
    })
}

export function infoMessage(message) {
    Message(message)
}

export function errorMessage(message) {
    Message.error(message)
}
