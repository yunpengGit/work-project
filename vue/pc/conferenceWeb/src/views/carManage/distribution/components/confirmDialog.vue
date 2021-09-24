<template>
    <div v-if="dialogVisible">
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" ref="dialog" append-to-body top="200px"
            :close-on-click-modal="false" :show-close="false">
            <span>{{message}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="finishClick">分配完成</el-button>
                <el-button @click="laterClick">稍后分配</el-button>
                <el-button @click="nextClick">继续分配</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>


export default {
    name: 'dialog',
    props: {

    },
    components: {},
    methods: {

        showDialog (message) {
            this.message = message;
            this.dialogVisible = true;
        },
        closeDialog () {
            this.dialogVisible = false;
        },



    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        //this.$refs.dialog[0].$el.firstChild.style.height = '90%';
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()

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
    activated () { },
    data () {
        return {
            dialogVisible: false,
            message: ""
        }
    }
}
</script>
<style lang='scss'  >
</style>