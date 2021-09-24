<template>
    <div style="padding-left:8px; padding-top:8px;padding-right:8px;">
        <el-tabs v-model="activeName" style="background-color: white;" @tab-click="handleClick">

            <el-tab-pane name="newRegist">
                <span slot="label" style="padding-left:10px">
                    接站用车
                    <el-badge v-if="num1>0" :value="num1" />
                </span>
                <newRegist @getToDoNum="getToDoNum($event,1)" />
            </el-tab-pane>
            <el-tab-pane name="changeRegist">
                <span slot="label">
                    送站用车
                    <el-badge v-if="num2>0" :value="num2" />
                </span>
                <changeRegist @getToDoNum="getToDoNum($event,2)" />
            </el-tab-pane>
            <el-tab-pane name="changeRoute">
                <span slot="label">
                    {{ getConferenceTemplate(1) }}用车
                    <el-badge v-if="num3>0" :value="num3" />
                </span>
                <changeRoute @getToDoNum="getToDoNum($event,3)" />
            </el-tab-pane>
            <!-- <el-tab-pane name="leave">
                <span slot="label">
                    请假<el-badge v-if="num4>0" :value="num4"></el-badge>
                </span>
                <leave @getToDoNum="getToDoNum($event,4)"></leave>
            </el-tab-pane> -->
        </el-tabs>

    </div>
</template>

<script>
import newRegist from './components/newRegist'
import changeRegist from './components/changeRegist'
import changeRoute from './components/changeRoute'
import { getToDoNum } from '@/api/car'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {
        newRegist,
        changeRegist,
        changeRoute
    },
    data () {
        // 这里存放数据
        return {
            num1: '',
            num2: '',
            num3: '',
            num4: '',
            activeName: 'newRegist'
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        if (typeof (this.$route.params.sourceType) !== 'undefined') {
            this.activeName = this.changeSourceType(this.$route.params.sourceType)
            console.log('this.activename     ' + this.activeName)
        }
    },
    // 这里存放数据
    beforeCreate () { },
    // 生命周期 - 挂载之前
    beforeMount () { },
    // 生命周期 - 更新之前
    beforeUpdate () { },
    // 生命周期 - 更新之后
    updated () { },
    // 生命周期 - 销毁之前
    beforeDestroy () { },
    // 生命周期 - 销毁完成
    destroyed () { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
    // 方法集合
    methods: {
        changeSourceType (val) {
            if (val === 61) {
                return 'newRegist'
            }
            if (val === 62) {
                return 'changeRegist'
            }
            if (val === 63) {
                return 'changeRoute'
            }
        },
        getToDoNum (val, key) {
            if (key === 1) {
                getToDoNum({ 'conferenceId': getConferenceId(), 'type': 61, 'attendeeRoleFlagEqual': val }).then(res => {
                    if (res.success) {
                        this.num1 = res.result
                    }
                })
            } else if (key === 2) {
                getToDoNum({ 'conferenceId': getConferenceId(), 'type': 62, 'attendeeRoleFlagEqual': val }).then(res => {
                    if (res.success) {
                        this.num2 = res.result
                    }
                })
            } else if (key === 3) {
                // getToDoNum({ "conferenceId": getConferenceId(), "type": 63, "attendeeRoleFlagEqual": [0, 1, 3] }).then(res => {
                //     if (res.success) {
                //         this.num3 = res.result;
                //     }
                // })
            } else if (key === 4) {
                // this.num4 = val;
            }
            // 实现标记实时更新?
            this.$children[0].$children[0].$forceUpdate()
        },
        handleClick (tab, event) {
            console.log(this.activeName)
        }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
