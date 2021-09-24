import Cookies from 'js-cookie'

const OssKey = 'x-sso-publicbaseurl'

export function getOssPublicBaseUrl() {
    return Cookies.get(OssKey)
}

export function setOssPublicBaseUrl(ossKey) {
    return Cookies.set(OssKey, ossKey)
}

export function removeOssPublicBaseUrl() {
    return Cookies.remove(OssKey)
}

