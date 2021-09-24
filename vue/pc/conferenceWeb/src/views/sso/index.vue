<script>
// import { getToken, setToken, removeToken } from '@/utils/user-auth'
import { setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'
export default {

    data() {
        return {
            ssoFlag: process.env.VUE_APP_SSO_LOGIN_FLAG,
            ssoAddress: process.env.VUE_APP_SSO_ADDRESS,
            baseAddress: process.env.VUE_APP_BASE_ADDRESS
        }
    },

    created() {
        setConferenceId('')
        setConferenceTemplate('')
        // window.location.href = 'https://hw-user-pc.avicnet.cn/#/index'
        if (this.ssoFlag === 'true') {
            // const token = getToken()
            // if (token == null) {
            if (window.location.href.indexOf('?') > -1) {
                let ticket
                const reg = new RegExp('(^|&)' + 'ticket' + '=([^&]*)(&|$)', 'i')
                const urlObj = window.location
                var r = urlObj.href.indexOf('#') > -1 ? urlObj.href.split('?')[1].match(reg) : urlObj.search.substr(1).match(reg)
                if (r != null) {
                    ticket = unescape(r[2])
                    var data = {}
                    data.identifierCode = 'xxx'
                    data.ticket = ticket
                    data.service = this.baseAddress

                    this.loading = true
                    this.$store.dispatch('user/ssoLogin', data).then((res) => {
                        if (res.success) {
                        // this.$router.push({ path: '/index' })
                            // window.location.href = 'https://hw-user-pc.avicnet.cn/#/index'
                            window.location.href = this.baseAddress + '#/index'
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    window.location.href = this.ssoAddress + '?service=' + this.baseAddress
                    // ticket = null
                }
            } else {
                // window.location.href="https://sso.avicnet.cn/sso?service=https://hw-user-pc.avicnet.cn/"
                window.location.href = this.ssoAddress + '?service=' + this.baseAddress
            }
            // } else {
            //     this.$router.push({ path: '/index' })
            // }
        } else {
            this.$router.push({ path: '/login' })
        }
    }
}
</script>
