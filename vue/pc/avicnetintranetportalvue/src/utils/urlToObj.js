export function getUrlParam (url, ref) {
  let str = ''

  // 如果不包括此参数
  if (url.indexOf(ref) === -1) return ''

  str = url.substr(url.indexOf('?') + 1)
  let i
  const arr = str.split('&')
  for (i in arr) {
    const paired = arr[i].split('=')

    if (paired[0] === ref) {
      return paired[1]
    }
  }

  return ''
}

export function putUrlParam (url, ref, value) {
  // 如果没有参数
  if (url.indexOf('?') === -1) return url + '?' + ref + '=' + value

  // 如果不包括此参数
  if (url.indexOf(ref) === -1) return url + '&' + ref + '=' + value

  const arr_url = url.split('?')

  const base = arr_url[0]

  const arr_param = arr_url[1].split('&')

  for (let i = 0; i < arr_param.length; i++) {
    const paired = arr_param[i].split('=')

    if (paired[0] === ref) {
      paired[1] = value
      arr_param[i] = paired.join('=')
      break
    }
  }

  return base + '?' + arr_param.join('&')
}
export function delUrlParam (url, ref) {
  const arr_url = url.split('?')

  const base = arr_url[0]
  // 如果不包括此参数
  if (url.indexOf(ref) === -1) return base

  const arr_param = arr_url[1].split('&')

  let index = -1

  for (let i = 0; i < arr_param.length; i++) {
    const paired = arr_param[i].split('=')

    if (paired[0] === ref) {
      index = i
      break
    }
  }
  if (index === -1) {
    return url
  } else {
    arr_param.splice(index, 1)
    return base + '?' + arr_param.join('&')
  }
}
