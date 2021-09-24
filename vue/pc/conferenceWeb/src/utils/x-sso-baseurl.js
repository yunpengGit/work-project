import Cookies from 'js-cookie'

const OssKey = 'x-sso-baseurl'

export function getOssBaseUrl() {
    return Cookies.get(OssKey)
}

export function setOssBaseUrl(ossKey) {
    return Cookies.set(OssKey, ossKey)
}

export function removeOssBaseUrl() {
    return Cookies.remove(OssKey)
}

