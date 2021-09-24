<template>
    <div class="login-wrapper">
        <div class="main-title">
            <h1>会议活动管理系统</h1>
        </div>
        <!-- <div class="sub-title">
            <h2>
                三地数据中心机房和基础设施运行管理系统
            </h2>
        </div> -->
        <div class="login-box-outer">
            <div class="login-box">
                <div id="userLogin" class="header">用户登录</div>
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" size="large">
                    <el-form-item prop="username">
                        <span class="txtIcon" />
                        <el-input v-model="loginForm.userInfo.userName" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <span class="txtIcon userPwd" />
                        <el-input
                            v-model="loginForm.userInfo.pwd"
                            type="password"
                            placeholder="请输入密码"
                            @keyup.enter.native="submitForm"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="submitForm">
                            <span style="font-size: 18px;">登 录</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                identifierCode: 'xxxxxx',
                userInfo: {
                    userName: '',
                    pwd: ''
                }

            },
            loginRules: {
                userInfo: {
                    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
                }

            },
            loading: false
        }
    },
    methods: {
        submitForm() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.loginForm).then((res) => {
                        if (res.success) {
                            this.$router.push({ path: '/index' })
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .login-wrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/login.png);
        background-repeat: no-repeat;
        background-size: cover;

        .main-title {
            width: 570px;
            margin-left: 30px;
        }

        .sub-title {
            width: 500px;
            margin: 50px 0 0 300px;
        }

        .login-box-outer{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .login-box {
            background-color: rgba(0,0,0,.5);
            height: 280px;
            padding: 10px 20px;
            width: 360px;

            .header {
                font-size: 20px;
                margin: 12px 0;
                text-align: center;
            }

            .txtIcon {
                background: url('../../assets/icons.png') no-repeat 0px -17px;
                position: absolute;
                width: 20px;
                height: 20px;
                top: 11px;
                left: 10px;
                z-index: 6;
            }

            .txtIcon.userPwd {
                background-position: 0px -37px;
            }
        }

    }
</style>
