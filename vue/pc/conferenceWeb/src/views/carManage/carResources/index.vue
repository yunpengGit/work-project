<template>
    <div style="padding-left:8px; padding-top:8px;padding-right:8px;">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="background-color: white;">
            <el-tab-pane name="car">
                <span slot="label" style="padding-left:10px">
                    车辆管理
                </span>
                <carList></carList>
            </el-tab-pane>
            <el-tab-pane label="车型管理" name="vehicleType">
                <vehicleTypeList></vehicleTypeList>
            </el-tab-pane>
            <el-tab-pane label="司机管理" name="driver">
                <driverList></driverList>
            </el-tab-pane>
            <el-tab-pane label="公司管理" name="company">
                <taxiCompanyList></taxiCompanyList>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import carList from './components/carList'
import driverList from './components/driverList'
import taxiCompanyList from './components/taxiCompanyList'
import vehicleTypeList from './components/vehicleTypeList'
export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {
        carList,
        driverList,
        taxiCompanyList,
        vehicleTypeList
    },
    data () {
        // 这里存放数据
        return {
            activeName: "car"
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        handleClick (tab, event) {
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