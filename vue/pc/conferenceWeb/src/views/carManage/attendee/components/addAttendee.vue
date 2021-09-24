<template>
    <el-drawer
        ref="drawer"
        :title="title"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="40%"
    >
        <div style="margin-left:60px">
            <el-input
                v-model="query"
                clearable
                placeholder="请输入姓名或手机号查询"
                style="width:36%"
                @keyup.enter.native="onSearch"
            >
                <el-button slot="append" icon="el-icon-search" @click="onSearch" />
            </el-input>
            <el-transfer v-model="value" :data="data" style="margin-top:8px" :titles="['可选' + this.getConferenceTemplate(2) + '', '已选' + this.getConferenceTemplate(2) + '']" />
        </div>

        <div
            class="demo-drawer__footer"
            style="text-align:center; border:solid 1px #DDDDDD;position:absolute;bottom:0px;width:100%;"
        >
            <el-button
                type="primary"
                :loading="loading"
                style="height:32px;margin-top:12px;margin-bottom:12px"
                @click="onSubmit()"
            >
                确定</el-button>
            <el-button style="height:32px;margin-top:12px" @click="cancelForm">取 消</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { getAttendeeList, addVehicleTaskAttendee } from '@/api/car'
import { getTableHeight } from '@/utils/index'
import { telephoneValid } from '@/utils/valid-common.js'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';

    components: {},
    data() {
        const generateData = _ => {
            const data = []
            for (let i = 1; i <= 15; i++) {
                data.push({
                    key: i,
                    label: `备选项 ${i}`,
                    disabled: i % 4 === 0
                })
            }
            return data
        }
        return {
            data: generateData(),
            value: [],
            dialog: false,
            title: '',
            query: '',
            attendeeList: [],
            loading: false
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

        'dialog': function(val) {

        },
        'value': function(val) {
            console.log('value' + this.value)
            console.log(this.data)
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    // 这里存放数据
    beforeCreate() {
    },
    // 生命周期 - 挂载之前
    beforeMount() { },
    // 生命周期 - 更新之前
    beforeUpdate() { },
    // 生命周期 - 更新之后
    updated() { },
    // 生命周期 - 销毁之前
    beforeDestroy() { },
    // 生命周期 - 销毁完成
    destroyed() { },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() { },
    // 方法集合
    methods: {
        onSearch() {
            var params = {
                conferenceId: 1,
                resFlag: 2,
                signStatusEqual: 3
            }
            getAttendeeList(params).then(res => {
                if (res.success) {
                    this.attendeeList = res.result.list
                }
            })
        },
        showEdit() {
            this.title = '添加人员'
            this.dialog = true
        },

        handleClose(done) {
            // this.$confirm('确认关闭？')
            //     .then(_ => {
            //         done();
            //         this.resetForm('form')
            //         this.dialog = false
            //     })
            //     .catch(_ => { });
            done()
            this.dialog = false
        },
        cancelForm() {
            this.dialog = false
        },

        onSubmit() {

        }

    }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
::v-deep .el-transfer-panel {
    width: 200px;
    height: 400px;
}
// .el-transfer-panel__list.is-filterable {
//     height: 400px;
// }
::v-deep .el-transfer-panel__list {
    height: 380px;
}
</style>
