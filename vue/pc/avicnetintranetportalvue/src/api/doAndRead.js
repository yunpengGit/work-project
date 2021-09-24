export const list = {
  url: '/portal/todo/user/list',
  method: 'GET'
}

export const showHide = {
  url: '/portal/todo/:todoUserId/showState/:showType',
  method: 'POST'
}

export const urgentLevel = {
  url: '/system/dict/data/type/todo_urgent_level',
  method: 'GET'
}

export const business = {
  url: '/portal/todo/dictionary/business',
  method: 'GET'
}

export const setKnown = {
  url: '/portal/todo/read/:todoUserId',
  method: 'POST'
}

export const batchSetKnown = {
  url: '/portal/todo/readBatch',
  method: 'POST',
  isString: true
}
