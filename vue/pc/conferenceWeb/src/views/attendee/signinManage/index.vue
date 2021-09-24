<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <el-tabs v-model="activeName" class="huiyiziliaoClass" :stretch="false" style="background-color:white;" @tab-click="handleClick">
            <el-tab-pane :lazy="true" name="first">
                <span slot="label" style="margin-top:15px;font-size:16px;">{{ getConferenceTemplate(1) }}活动报到</span>
                <SigninConference :active-name="activeName" />
            </el-tab-pane>
            <el-tab-pane :lazy="true" name="second">
                <span slot="label" style="margin-top:15px;font-size:16px">议程签到</span>
                <SigninAgenda style="background-color: #EEF0F4" active-name="activeName" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import SigninConference from './conference'
import SigninAgenda from './agenda'
export default {
    name: 'SingninManage',
    components: {
        SigninConference,
        SigninAgenda
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    watch: {
    },
    created() {
        if (this.$route.query.activeName !== undefined && this.$route.query.activeName !== null) {
            this.activeName = 'second'
        }
    },
    methods: {
        handleClick() {}
    }
}
</script>
<style lang="scss" scoped>
</style>
<style>
.huiyiziliaoClass .el-tabs__header {
    margin-left:10px;
}
</style>
