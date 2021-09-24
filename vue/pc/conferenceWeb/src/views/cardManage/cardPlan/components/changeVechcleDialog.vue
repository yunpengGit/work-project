<template>
    <div>
        <el-dialog title="将选中的证件更改制证状态？" :visible.sync="dialogVisible" width="30%" ref="dialog">

            <el-form style="margin-top:20px;">
                <el-form-item label="证件状态" prop="cardStatus">
                    <el-select v-model="cardStatus" placeholder="全部" clearable style="width:70%" filterable>
                        <el-option v-for="item in cardStatusOptions" :key="item.enumKey" :label="item.enumValue"
                            :value="item.enumKey">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>


export default {
    name: 'changeStatusDialog',
    props: {
        cardStatusOptions: {
            type: Array,
            default: []
        }
    },
    components: {},
    methods: {

        showDialog (selectedList) {
            console.log(selectedList)
            this.selectedList = selectedList;
            this.cardStatus = "";
            this.dialogVisible = true;
        },
        closeDialog () {
            this.dialogVisible = false;
        },
        onSubmit () {
            if (this.cardStatus === null || this.cardStatus === "") {
                this.$message("请选择状态")
                return;
            }
            var cardVehicleList = [];
            this.selectedList.forEach(item => {
                var cardAttendee = { "vehicle": { "id": item.vehicle.id }, "card": { "id": item.card.id } };
                cardVehicleList.push(cardAttendee);
            });
            var param = { "cardVehicleList": cardVehicleList, "cardStatus": this.cardStatus }
            this.$emit("updateCardStatus", param)


            // var taskId = this.$refs["diningTask"].$refs.table.selection[0].id;
            // var attendees = [];
            // this.attendeeIds.forEach(item => {
            //     attendees.push({ "id": item })
            // })
            // var params = {
            //     "taskId": taskId,
            //     "attendees": attendees
            // }
            // console.log(params)
            // addDiningTaskAttendee(params).then(res => {
            //     if (res.success) {
            //         this.$message("加入成功！")
            //         this.$refs["diningTask"].getListInfo(this.$refs["diningTask"].paramData)
            //     }
            // })
        }


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
            selectedList: [],
            cardStatus: ""
        }
    }
}
</script>
<style lang='scss'  >
</style>