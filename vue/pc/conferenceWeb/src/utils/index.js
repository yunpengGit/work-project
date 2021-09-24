import variables from '@/styles/variables.scss'
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export function getTableHeight(offsetHeight) {
    return window.innerHeight - variables.tagBarHeightForTable - variables.headerHeightForTable - variables.footerHeight - offsetHeight
}

export function getOverviewAlarmTable(offsetHeight) {
    return (window.innerHeight - variables.tagBarHeightForTable - variables.headerHeightForTable - variables.footerHeight - 40) / 2 - offsetHeight
}

export function getUrlAndParam(url, param) {
    if (param) {
        let i = 0
        for (const key in param) {
            if (i === 0) {
                url += '?' + key + '=' + param[key]
            } else {
                url += '&' + key + '=' + param[key]
            }
            i++
        }
    }
    return url
}

export function formateFloat(val) {
    if (val) {
        // Number.parseFloat(val).toFixed(1)
        return Math.round(val * 10) / 10
    } else {
        return 0
    }
}

export function formatePercent(val) {
    if (val) {
        // Number.parseFloat(val).toFixed(1)
        return Math.round(val * 1000) / 10
    } else {
        return 0
    }
}

export function getEqpType(type) {
    const types = [16, 37, 38, 18, 19]
    const types1 = [26]
    const types2 = [27]
    if (types.indexOf(type) !== -1) {
        return 1
    }
    if (types1.indexOf(type) !== -1) {
        return 2
    }
    if (types2.indexOf(type) !== -1) {
        return 3
    }
    return null
}

export function getMonth() {
    return [{ 'id': '1', 'name': '一月' }, { 'id': '2', 'name': '二月' }, { 'id': '3', 'name': '三月' }, { 'id': '4', 'name': '四月' }, { 'id': '5', 'name': '五月' }, { 'id': '6', 'name': '六月' }, { 'id': '7', 'name': '七月' }, { 'id': '8', 'name': '八月' }, { 'id': '9', 'name': '九月' }, { 'id': '10', 'name': '十月' }, { 'id': '11', 'name': '十一月' }, { 'id': '12', 'name': '十二月' }]
}

// 格式化时间年月日
export function GMTToStrYYYYMMDD(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = date.getFullYear() + '-'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '-'
    } else {
        str += (date.getMonth() + 1) + '-'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + ''
    } else {
        str += date.getDate() + ''
    }

    return str
}

// 格式化时间月日时
export function GMTToStrMMDDHH(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = ''
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '月'
    } else {
        str += (date.getMonth() + 1) + '月'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + '日'
    } else {
        str += date.getDate() + '日'
    }

    if (date.getHours() < 10) {
        str += '0' + date.getHours() + '时'
    } else {
        str += date.getHours() + '时'
    }

    return str
}

// 格式化时间年月日
export function GMTToStrYYYYMMDDHHmm(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time * 1000)
    var str = date.getFullYear() + '-'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '-'
    } else {
        str += (date.getMonth() + 1) + '-'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + ' '
    } else {
        str += date.getDate() + ' '
    }
    if (date.getHours() < 10) {
        str += '0' + date.getHours() + ':'
    } else {
        str += date.getHours() + ':'
    }
    if (date.getMinutes() < 10) {
        str += '0' + date.getMinutes()
    } else {
        str += date.getMinutes()
    }

    return str
}

// 格式化时间年月日
export function GMTToStrYYYYMMDDHHmmss2(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time * 1000)
    var str = date.getFullYear() + '-'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '-'
    } else {
        str += (date.getMonth() + 1) + '-'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + ' '
    } else {
        str += date.getDate() + ' '
    }
    if (date.getHours() < 10) {
        str += '0' + date.getHours() + ':'
    } else {
        str += date.getHours() + ':'
    }
    if (date.getMinutes() < 10) {
        str += '0' + date.getMinutes() + ':'
    } else {
        str += date.getMinutes() + ':'
    }
    if (date.getSeconds() < 10) {
        str += '0' + date.getSeconds()
    } else {
        str += date.getSeconds()
    }

    return str
}

// 格式化时间年月日
export function GMTToStrYYYYMMDDHHmmss(date) {
    // if (time === null || time === '') {
    //     return ''
    // }
    // var date = new Date(time * 1000)
    var str = date.getFullYear() + '-'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '-'
    } else {
        str += (date.getMonth() + 1) + '-'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + ' '
    } else {
        str += date.getDate() + ' '
    }
    if (date.getHours() < 10) {
        str += '0' + date.getHours() + ':'
    } else {
        str += date.getHours() + ':'
    }
    if (date.getMinutes() < 10) {
        str += '0' + date.getMinutes() + ':'
    } else {
        str += date.getMinutes() + ':'
    }
    if (date.getSeconds() < 10) {
        str += '0' + date.getSeconds()
    } else {
        str += date.getSeconds()
    }

    return str
}

export function confirmEnding(str, target) {
    var start = str.length - target.length
    var arr = str.substr(start, target.length)
    if (arr === target) {
        return true
    }
    return false
}

// 格式化时间时分
export function GMTToStrHHmm(time) {
    var date = new Date(time)
    var str = ''
    if (date.getHours() < 10) {
        str += '0' + date.getHours() + ':'
    } else {
        str += date.getHours() + ':'
    }
    if (date.getMinutes() < 10) {
        str += '0' + date.getMinutes()
    } else {
        str += date.getMinutes()
    }

    return str
}

export function formatXingqi(time) {
    if (time === null || time === '') {
        return ''
    }
    var d = new Date(time)
    var weekday = new Array(7)
    weekday[0] = '星期天'
    weekday[1] = '星期一'
    weekday[2] = '星期二'
    weekday[3] = '星期三'
    weekday[4] = '星期四'
    weekday[5] = '星期五'
    weekday[6] = '星期六'
    return weekday[d.getDay()]
}

// 格式化时间时分
export function GMTToStrHHmmss(time) {
    var date = new Date(time)
    var str = ''
    if (date.getHours() < 10) {
        str += '0' + date.getHours() + ':'
    } else {
        str += date.getHours() + ':'
    }
    if (date.getMinutes() < 10) {
        str += '0' + date.getMinutes() + ':'
    } else {
        str += date.getMinutes() + ':'
    }
    if (date.getSeconds() < 10) {
        str += '0' + date.getSeconds()
    } else {
        str += date.getSeconds()
    }

    return str
}

// 格式化手机号
export function formatPhone(phone) {
    if (phone === null) {
        return ''
    }
    if (phone.length === 11) {
        return phone.substr(0, 3) + '****' + phone.substr(7, 4)
    }
}

export function getSignStatuss() {
    return [

        // { 'id': -2, 'name': '失效' },

        // { 'id': 0, 'name': '草稿' },
        // { 'id': 1, 'name': '待审核' },
        { 'id': 3, 'name': '审核通过' },
        { 'id': 2, 'name': '审核不通过' },
        { 'id': -1, 'name': '报名取消' },
        { 'id': -3, 'name': '禁止报名' }
    ]
}

export function getSourceTypes(val) {
    if (val) {
        return [
            // { 'id': 1, 'name': '后台录入' },
            { 'id': 2, 'name': '本人报名' },
            { 'id': 3, 'name': '代报名' },
            { 'id': 4, 'name': '会务组代报名' },
            { 'id': 5, 'name': '受邀参加' }
        ]
    }
    return [
        { 'id': 1, 'name': '后台录入' },
        { 'id': 2, 'name': '本人报名' },
        { 'id': 3, 'name': '代报名' },
        { 'id': 4, 'name': '会务组代报名' },
        { 'id': 5, 'name': '受邀参加' }
    ]
}

export function getMeetingStatuss() {
    return [
        { 'id': 1, 'name': '未报到' },
        { 'id': 2, 'name': '已报到' },
        { 'id': 3, 'name': '离会外出' },
        { 'id': 4, 'name': '提前离会' },
        { 'id': 5, 'name': '参会结束' }
    ]
}

// 格式化时间年.月.日
export function GMTToStrYYYYMMDDOfdian(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = date.getFullYear() + '.'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '.'
    } else {
        str += (date.getMonth() + 1) + '.'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + ''
    } else {
        str += date.getDate() + ''
    }

    return str
}

// 格式化时间年.月
export function GMTToStrYYYYMMOfChiness(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = date.getFullYear() + '年'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '月'
    } else {
        str += (date.getMonth() + 1) + '月'
    }

    return str
}

// 格式化时间年.月
export function GMTToStrNianYueRiOfChiness(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = date.getFullYear() + '年'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '月'
    } else {
        str += (date.getMonth() + 1) + '月'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + '日'
    } else {
        str += date.getDate() + '日'
    }

    return str
}

// 格式化时间年.月日上下午
export function GMTToStrYYYYMMDDOfChiness(time) {
    if (time === null || time === '') {
        return ''
    }
    var date = new Date(time)
    var str = date.getFullYear() + '年'
    if (date.getMonth() + 1 < 10) {
        str += '0' + (date.getMonth() + 1) + '月'
    } else {
        str += (date.getMonth() + 1) + '月'
    }
    if (date.getDate() < 10) {
        str += '0' + date.getDate() + '日'
    } else {
        str += date.getDate() + '日'
    }
    if (date.getHours() < 12) {
        str += '上午'
    } else {
        str += '下午'
    }

    return str
}

export function formatTableCellData(val) {
    if (val === null || val === '') {
        return '-'
    } else {
        return val
    }
}

export function formatOrgName(orgShortName, orgName, length) {
    if ((orgShortName === null || orgShortName === '') && (orgName === null || orgName === '')) {
        return null
    }
    var result = orgShortName !== null && orgShortName !== '' ? orgShortName : orgName
    if (length !== undefined && length !== null) {
        return result != null && result.length > length ? result.substr(0, length - 1) + '...' : result
    }
    return result
}

// startDate: 计划开始时间； endDate：计划结束时间；dayLength：每隔几天，0-代表每天，1-代表日期间隔一天
export function getDateStr(startDate, endDate, dayLength) {
    var str = startDate
    for (var i = 0; ; i++) {
        var getDate = getTargetDate(startDate, dayLength)
        startDate = getDate
        if (getDate <= endDate) {
            str += ',' + getDate
        } else {
            break
        }
    }

    return str
}

// startDate: 开始时间；dayLength：每隔几天，0-代表获取每天，1-代表日期间隔一天
export function getTargetDate(date, dayLength) {
    dayLength = dayLength + 1
    var tempDate = new Date(date)
    tempDate.setDate(tempDate.getDate() + dayLength)
    var year = tempDate.getFullYear()
    var month = tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1
    var day = tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()
    return year + '-' + month + '-' + day
}

// startDate: 当前时间；dayLength：向前几天，0-代表获取每天，1-代表日期间隔一天
export function getSubtDate(date, dayLength) {
    dayLength = dayLength + 1
    var tempDate = new Date(date)
    tempDate.setDate(tempDate.getDate() - dayLength)
    var year = tempDate.getFullYear()
    var month = tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1
    var day = tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()
    return year + '-' + month + '-' + day
}

/**
 * 检查图片大小符合要求
 * file:图片文件
 * fileCheckSize:规定文件比例
 * showSize:显示图片比例
 * successFun：成功后回调函数
 * */
export function checkPngSize(file, fileCheckSize, successFun) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const image = new Image()
    reader.onload = (e) => {
        image.src = e.target.result
        // base64地址图片加载完毕后
        image.onload = function() {
            // 图片原始尺寸
            const originWidth = this.width
            const originHeight = this.height
            const bili = (originWidth / originHeight).toFixed(2)
            if (bili >= fileCheckSize * 0.9 && bili <= fileCheckSize * 1.1) {
                successFun(true)
            } else {
                successFun(false)
            }
        }
    }
}

/**
 * 检查图片大小符合要求
 * file:图片文件
 * fileCheckSize:规定文件比例
 * showSize:显示图片比例
 * successFun：成功后回调函数
 * */
export function checkPngHeightWidth(file, maxWidth, minWidth, maxHeight, minHeight, successFun) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const image = new Image()
    reader.onload = (e) => {
        image.src = e.target.result
        // base64地址图片加载完毕后
        image.onload = function() {
            // 图片原始尺寸
            const originWidth = this.width
            const originHeight = this.height

            if (maxWidth !== null && maxWidth !== '' && originWidth > maxWidth) {
                successFun(false, '图片宽度不能大于' + maxWidth)
            }

            if (minWidth !== null && minWidth !== '' && originWidth < minWidth) {
                successFun(false, '图片宽度不能小于' + minWidth)
            }

            if (maxHeight !== null && maxHeight !== '' && originHeight > maxHeight) {
                successFun(false, '图片高度不能大于' + maxHeight)
            }

            if (minHeight !== null && minHeight !== '' && originWidth < minHeight) {
                successFun(false, '图片高度不能小于' + minHeight)
            }

            successFun(true)
        }
    }
}

export function getDaysBetweenForWeikaishi(dateString1, dateString2) {
    var startDate = Date.parse(GMTToStrYYYYMMDD(dateString1) + ' 00:00:00')
    var endDate = Date.parse(GMTToStrYYYYMMDD(dateString2) + ' 00:00:00')
    var days = ((endDate - startDate) / (1 * 24 * 60 * 60 * 1000)).toFixed(0)
    return days
}

export function getDaysBetween(dateString1, dateString2) {
    var startDate = Date.parse(GMTToStrYYYYMMDD(dateString1) + ' 00:00:00')
    var endDate = Date.parse(GMTToStrYYYYMMDD(dateString2) + ' 00:00:00')
    var days = ((endDate - startDate + 1 * 24 * 60 * 60 * 1000) / (1 * 24 * 60 * 60 * 1000)).toFixed(0)
    // alert(days);
    return days
}

/**
 * 获取UUID
 */
export function getUuid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function isRepeat(arr) {
    var hash = {}
    for (var i in arr) {
        if (hash[arr[i]]) {
            return true
        }
        hash[arr[i]] = true
    }
    return false
}
