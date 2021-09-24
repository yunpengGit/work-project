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
        <el-select
            v-model="value"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width:80%;margin-left:30px"
        >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <div
            class="demo-drawer__footer"
            style="text-align:center; border:solid 1px #DDDDDD;position:absolute;bottom:0px;width:100%;"
        >
            <el-button
                type="primary"
                :loading="loading1"
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
        return {
            options: [],
            value: [],
            list: [],
            loading: false,
            states: ['Alabama', 'Alaska', 'Arizona',
                'Arkansas', 'California', 'Colorado',
                'Connecticut', 'Delaware', 'Florida',
                'Georgia', 'Hawaii', 'Idaho', 'Illinois',
                'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                'Louisiana', 'Maine', 'Maryland',
                'Massachusetts', 'Michigan', 'Minnesota',
                'Mississippi', 'Missouri', 'Montana',
                'Nebraska', 'Nevada', 'New Hampshire',
                'New Jersey', 'New Mexico', 'New York',
                'North Carolina', 'North Dakota', 'Ohio',
                'Oklahoma', 'Oregon', 'Pennsylvania',
                'Rhode Island', 'South Carolina',
                'South Dakota', 'Tennessee', 'Texas',
                'Utah', 'Vermont', 'Virginia',
                'Washington', 'West Virginia', 'Wisconsin',
                'Wyoming'],
            dialog: false,
            title: '',
            attendeeList: [],
            loading1: false
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {

        'dialog': function(val) {
            this.options = []
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
        this.list = this.states.map(item => {
            return { value: `value:${item}`, label: `label:${item}` }
        })
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

        remoteMethod(query) {
            if (query !== '') {
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                    this.options = this.list.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1
                    })
                }, 200)
            } else {
                this.options = []
            }
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
</style>
