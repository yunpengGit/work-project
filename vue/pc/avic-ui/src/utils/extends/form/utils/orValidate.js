export default function (vm, next, errorMessage) {
  const form = vm.$refs[`zh-form-${vm.uid}`]
  return (rule, value, callback) => {
    if (value === '' && vm.form[next] === '') {
      callback(new Error(errorMessage))
    } else if (value !== '' && vm.form[next] === '') {
      try {
        form.clearValidate(next)
      } catch (error) {}
      callback()
    } else {
      callback()
    }
  }
}
