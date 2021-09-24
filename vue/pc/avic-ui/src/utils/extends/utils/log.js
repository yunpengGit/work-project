export default (title, content) => {
  console.log(`%c ✅(${title})`, 'color:red;font-weight:bold;', content)
  window.__log = window.__log || {}
  window.__log[title] = content
}
