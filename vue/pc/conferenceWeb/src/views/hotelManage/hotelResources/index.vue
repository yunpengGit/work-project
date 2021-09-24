<template>

    <div style="padding-left:8px; padding-top:8px;padding-right:8px;">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="background-color: white;">
            <el-tab-pane name="roomList">
                <span slot="label" style="padding-left:10px">
                    房间管理
                </span>
                <roomList :roomFormOptions="roomFormOptions" :hotelOptions="hotelOptions"></roomList>
            </el-tab-pane>
            <el-tab-pane label="房型管理" name="roomFormList">
                <roomFormList :hotelOptions="hotelOptions" @getOptionInfo="getRoomFormOptions()"></roomFormList>
            </el-tab-pane>
            <el-tab-pane label="酒店管理" name="hotelList">
                <hotelList @getOptionInfo="getHotelOptions()"></hotelList>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
import roomList from './components/roomList'
import roomFormList from './components/roomFormList'
import hotelList from './components/hotelList'
import { getConferenceId } from '@/utils/conference-auth'
import { getRoomFormList, getHotelList } from '@/api/hotel'

export default {
    name: '',
    // import引入的组件需要注入到对象中才能使用
    // 例如：import 《组件名称》 from '《组件路径》';
    components: {
        roomList,
        roomFormList,
        hotelList
    },
    data () {
        // 这里存放数据
        return {
            activeName: "roomList",
            roomFormOptions: [],
            hotelOptions: []

        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 各种查询条件下的选择框可以共用数据
        getRoomFormOptions () {
            getRoomFormList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.roomFormOptions = response.result.list;
                    console.log("roomformoptions " + this.roomFormOptions)
                }
            })
        },
        getHotelOptions () {
            getHotelList({ conferenceId: getConferenceId() }).then(response => {
                if (response.success) {
                    this.hotelOptions = response.result.list;
                }
            })
        },




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
        this.getHotelOptions();
        this.getRoomFormOptions();

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