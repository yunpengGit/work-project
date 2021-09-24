import renderProps from './render-props'

export default function (src, target) {
  Object.keys(src).forEach(prop => {
    if (~renderProps.indexOf(prop)) {
      if (target[prop]) {
        target[prop] = { ...target[prop], ...src[prop] }
      } else {
        target[prop] = src[prop]
      }
    }
  })
}
