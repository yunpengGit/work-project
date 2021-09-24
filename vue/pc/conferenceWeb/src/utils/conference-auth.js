import Cookies from 'js-cookie'
const ConferenceIdKey = 'Admin-ConferenceId'
const ConferenceTemplateKey = 'Admin-ConferenceTemplate'

export function getConferenceId() {
    return Cookies.get(ConferenceIdKey)
}

export function setConferenceId(conferenceId) {
    return Cookies.set(ConferenceIdKey, conferenceId)
}

export function getConferenceTemplate(type) {
    var conferenceTemplateView = Cookies.get(ConferenceTemplateKey)
    if (conferenceTemplateView === '') {
        return ''
    }

    var conferenceTemplate = JSON.parse(conferenceTemplateView)
    if (type === 1) {
        return conferenceTemplate.lable1
    } else if (type === 2) {
        return conferenceTemplate.lable2
    } else if (type === 3) {
        return conferenceTemplate.lable3
    } else if (type === 4) {
        return conferenceTemplate.lable4
    } else if (type === 5) {
        return conferenceTemplate.lable5
    } else if (type === 0) {
        return conferenceTemplate
    }
    return ''
}

export function setConferenceTemplate(conferenceTemplate) {
    return Cookies.set(ConferenceTemplateKey, conferenceTemplate)
}

export function removeConferenceId() {
    return localStorage.removeItem(ConferenceIdKey)
}
