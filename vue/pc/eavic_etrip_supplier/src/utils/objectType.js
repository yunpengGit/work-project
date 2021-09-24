export const type = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
// const isArray = type('Array')
// const isString = type('String')
// let arr = [1,2,3,4]
// if(isArray(arr)){

// }
export function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
