<template>
    <div style="padding-left:8px; padding-top:8px;padding-right:8px;">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="background-color: white;">
            <el-tab-pane name="attendeeCard">
                <span slot="label" style="padding-left:10px">
                    嘉宾证
                </span>
                <attendeeCard :cardStatusOptions="cardStatusOptions" :flagNum="flagNum"></attendeeCard>
            </el-tab-pane>
            <el-tab-pane label="车证" name="vehicleCard">
                <vehicleCard :cardStatusOptions="cardStatusOptions"></vehicleCard>
            </el-tab-pane>

        </el-tabs>

    </div>
</template>

<script>
import attendeeCard from './components/attendeeCard'
import vehicleCard from './components/vehicleCard'
import { getCardStatusOptions } from '@/api/card'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {
        attendeeCard,
        vehicleCard
    },
    data () {
        // 这里存放数据
        return {
            activeName: "attendeeCard",
            cardStatusOptions: [],
            flagNum: 0
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        getCardStatusOptions () {
            getCardStatusOptions().then(res => {
                if (res.success) {
                    this.cardStatusOptions = res.result.list;
                    // this.$nextTick(() => { this.$refs.table.doLayout() })
                }
            })
        },
        handleClick (tab, event) {
            console.log(tab, event)
            this.flagNum++
            // setTimeout(() => {
                // this.$refs.cardList.$refs.table.doLayout()
            // }, 1000);
            console.log(this.activeName)
        }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // console.log(this.$route.params.name)
        // if (typeof (this.$route.params.name) !== "undefined") {
        //     this.activeName = this.$route.params.name
        //     console.log("this.activename" + this.activeName)
        // }
        this.getCardStatusOptions()

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
    activated () { }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>