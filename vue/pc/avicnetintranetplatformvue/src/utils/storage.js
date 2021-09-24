function getKey (key) {
  return key.charAt().toUpperCase() + key.length + '_' + key
}
export function setItem (key, value, isLocal) {
  return window[isLocal ? 'localStorage' : 'sessionStorage'].setItem(getKey(key), JSON.stringify(value))
}

export function getItem (key, isLocal) {
  const item = window[isLocal ? 'localStorage' : 'sessionStorage'].getItem(getKey(key))
  return item ? JSON.parse(item) : item
}

export function removeItem (key, value, isLocal) {
  return window[isLocal ? 'localStorage' : 'sessionStorage'].removeItem(getKey(key))
}
