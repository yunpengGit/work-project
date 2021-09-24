var num = (rule, value, callback) => {
    if (isNaN(value)) {
        callback(new Error('请输入数字'))
    } else if (!(/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(value))) {
        callback(new Error('请保留两位小数'))
    } else if (value.length > 10) {
        callback(new Error('请输入10位有效数字'))
    } else {
        // if (this.ruleForm.checkPass !== '') {
        //     this.$refs.ruleForm.validateField('checkPass')
        // }
        callback()
    }
}

var num2 = (rule, value, callback) => {
    if (isNaN(value)) {
        callback(new Error('请输入数字'))
    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
        callback(new Error('请输入整数'))
    } else if (value.length > 11) {
        callback(new Error('请输入11位有效数字'))
    } else {
        // if (this.ruleForm.checkPass !== '') {
        //     this.$refs.ruleForm.validateField('checkPass')
        // }
        callback()
    }
}

var num3 = (rule, value, callback) => {
    if (isNaN(value)) {
        callback(new Error('请输入数字'))
    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
        callback(new Error('请输入整数'))
    } else if (value.length > 11) {
        callback(new Error('请输入11位有效数字'))
    } else if (value < 1) {
        callback(new Error('请输入大于零的数'))
    } else {
        // if (this.ruleForm.checkPass !== '') {
        //     this.$refs.ruleForm.validateField('checkPass')
        // }
        callback()
    }
}

var card = (rule, value, callback) => {
    if (value === null || value === '') {
        callback()
    }
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
        callback(new Error('身份证格式错误'))
    } else {
        // if (this.ruleForm.checkPass !== '') {
        //     this.$refs.ruleForm.validateField('checkPass')
        // }
        callback()
    }
}

// var tel = (rule, value, callback) => {
//     if (value === null || value === '') {
//         callback()
//     }
//     if (isNaN(value)) {
//         callback(new Error('手机号格式错误'))
//     } else if (!(/^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(value))) {
//         callback(new Error('手机号格式错误'))
//     } else {
//         // if (this.ruleForm.checkPass !== '') {
//         //     this.$refs.ruleForm.validateField('checkPass')
//         // }
//         callback()
//     }
// }

var tel = (rule, value, callback) => {
    if (value === null || value === '') {
        callback()
    } else {
        if (isNaN(value)) {
            callback(new Error('手机号格式错误'))
        } else if (value.length !== 11) {
            callback(new Error('手机号格式错误'))
        } else {
            // if (this.ruleForm.checkPass !== '') {
            //     this.$refs.ruleForm.validateField('checkPass')
            // }
            callback()
        }
    }
}

export function requireValid(flag, label) {
    if (flag === 'input') {
        return { required: true, message: '请输入' + label, pattern: '[^ \x22]+', trigger: 'blur' }
    } else if (flag === 'time') {
        return { required: true, message: '请输入' + label, trigger: 'blur' }
    } else if (flag === 'select') {
        return { required: true, message: '请选择' + label, trigger: 'change' }
    } else if (flag === 'file') {
        return { required: true, message: '请上传应急预案', trigger: 'blur' }
    }
}

export function lengthValid(min, max, label) {
    return { min: min, max: max, message: '长度在 ' + min + ' 到 ' + max + ' 个字符', trigger: 'blur' }
}

export function numValid() {
    return { validator: num, trigger: 'blur' }
}

export function num2Valid() {
    return { validator: num2, trigger: 'blur' }
}
export function num3Valid() {
    return { validator: num3, trigger: 'blur' }
}
export function emailValid() {
    return { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
}

export function telephoneValid() {
    return { validator: tel, trigger: 'blur' }
}

export function cardValid(val) {
    if (val === '1') {
        return { validator: card, trigger: 'blur' }
    }
    return null
}
