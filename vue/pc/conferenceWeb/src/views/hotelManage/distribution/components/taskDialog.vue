<template>
    <div v-if="dialogVisible">

        <el-dialog ref="dialog" :visible.sync="dialogVisible" width="90%" top="10px" :show-close="false"
            :before-close="handleClose">
            <div slot="title" style="padding:10px;">
                <div class="title">正在为以下人员分配住宿</div>
                <div class="scrollbar">
                    <div v-for="item in attendeeList" :key="item.attendeeId" class="attendee-item">
                        <div :class="houseData.length?'resideMessage':''">
                            <span class="attendee-name">{{ item.fixAttributeCommonVO?item.fixAttributeCommonVO.attendeeName:item.attendee.fixAttributeCommonVO.attendeeName }}</span>
                            <p class="resideDetail" v-if="houseData.length">
                                入住酒店：
                                <span v-for="(value,key) in houseData" :key="key">
                                    {{value.roomFormVO.hotelVO.name}}（{{value.roomFormVO.modelName}}·{{value.roomNo}}）
                                    {{value.startDate}}-{{value.endDate}}
                                    <i v-if="key!==houseData.length-1">、</i>
                                </span>
                            </p>
                        </div>
                        <span class="attendee-name">基本信息：</span>单位：{{ item.fixAttributeCommonVO? item.fixAttributeCommonVO.organizationSortName:item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职位：{{ item.fixAttributeCommonVO?item.fixAttributeCommonVO.position:item.attendee.fixAttributeCommonVO.position }}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系方式：{{ item.fixAttributeCommonVO?formatPhone(item.fixAttributeCommonVO.phone):formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        <div v-if="item.attendeeTask && item.attendeeTask.changeContent && item.attendee.roomTaskList && item.attendee.roomTaskList.length">
                            <!-- 首次分配不显示变更信息 -->
                            <span class="attendee-name">变更信息：</span>
                            <div style="margin-top: -20px;margin-left: 100px;">
                                <div v-for="itemSub in formatLogContent(item.attendeeTask.changeContent)"
                                :key="itemSub.code" >
                                <div v-show="itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}变更，
                                    由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                    变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                </div>
                                <div v-show="itemSub.code === 'photoUrl'">
                                    <span style="font-weight:700;">·</span> {{ itemSub.attribute }}有变更
                                    <el-link :underline="false" type="info"
                                        :href="imagePath + (itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : defaultPhoto)">
                                        详情</el-link>
                                </div>
                                <div v-if="itemSub.code === 'agenda'">
                                    <span style="font-weight:700;">·</span> {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <!-- <div v-for="(item,index) in attendeeList" :key="item.attendeeId">
                        {{ item.attendee.fixAttributeCommonVO.attendeeName }}
                        {{ formatPhone(item.attendee.fixAttributeCommonVO.phone) }}
                        {{ item.attendee.fixAttributeCommonVO.position }}
                        {{ item.attendee.fixAttributeCommonVO.organizationSortName ? item.attendee.fixAttributeCommonVO.organizationSortName: item.attendee.fixAttributeCommonVO.organizationName }}
                        <el-button
                            v-if="zhanKaiArray.indexOf(index) === -1 && item.attendeeTask && item.attendeeTask.changeContent "
                            style="line-height:2px" type="text" @click="zhanKaiArrayClick(index)">
                            展开
                        </el-button>
                        <el-button
                            v-if="zhanKaiArray.indexOf(index) !== -1 && item.attendeeTask && item.attendeeTask.changeContent "
                            style="line-height:2px" type="text" @click="shouQiArrayClick(index)">
                            收起
                        </el-button>
                        <div v-if="zhanKaiArray.indexOf(index) !== -1 && item.attendeeTask">
                            <div v-for="itemSub in formatLogContent(item.attendeeTask.changeContent)"
                                :key="itemSub.code">
                                <div v-show="itemSub.code !== 'photoUrl' && itemSub.code !== 'agenda'">
                                    {{ itemSub.attribute }}变更，
                                    由“{{ itemSub.beforeValue !== null && itemSub.beforeValue !== '' ? itemSub.beforeValue : '无' }}”
                                    变更为“{{ itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : '无' }}”
                                </div>
                                <div v-show="itemSub.code === 'photoUrl'">
                                    {{ itemSub.attribute }}有变更
                                    <el-link :underline="false" type="info"
                                        :href="imagePath + (itemSub.afterValue !== null && itemSub.afterValue !== '' ? itemSub.afterValue : defaultPhoto)">
                                        详情</el-link>
                                </div>
                                <div v-if="itemSub.code === 'agenda'">
                                    {{ formatAgenda(itemSub.beforeValue, itemSub.afterValue) }}
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>

            <diningTask ref="diningTask" :attendee-ids="attendeeIds" :houseData.sync="houseData" :attendee-list="attendeeList" @closeDialog="closeDialog" />

            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import diningTask from './diningTask' // 文件名懒得改了
import { formatPhone } from '@/utils/index'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'



export default {
    name: 'TaskDialog',
    components: { diningTask },
    props: {
        attendeeIds: {
            type: Array
        },
        fangData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data () {
        return {
            dialogVisible: false,
            attendeeList: [],
            imagePath: getOssBaseUrl(),
            defaultPhoto: process.env.VUE_APP_DEFAULT_PHOTO,
            zhanKaiArray: [],  //用来存储人员信息是否展开的序号
            houseData:[],
        }
    },
    watch: {
        // '$route' () {  // 对route进行监控  添加返回时会调用刷新数据
        //     this.getListInfo()
        // }
        fangData:{
            handler:function(newData,oldData){
                // console.warn(newData,"newData")
                this.houseData=newData
            },
            deep:true
        },

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () { },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
        // this.$refs.dialog[0].$el.firstChild.style.height = '90%';
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
    methods: {
        zhanKaiArrayClick (index) {
            this.zhanKaiArray.push(index)
        },
        shouQiArrayClick (param) {
            var index = this.zhanKaiArray.indexOf(param);
            if (index > -1) {
                this.zhanKaiArray.splice(index, 1);
            }
        },
        close () {
            this.dialogVisible = false
            this.$emit('getListInfo')
        },
        handleClose (done) {
            done();
            this.$emit('getListInfo')
        },
        formatPhone (val) {
            return formatPhone(val)
        },
        formatAgenda (beforeValue, afterValue) {
            var befores = []
            var afters = []
            var delValue = ''
            var addValue = ''
            if (beforeValue !== null && beforeValue.length > 0) {
                befores = beforeValue.split(';')
            }
            if (afterValue !== null && afterValue.length > 0) {
                afters = afterValue.split(';')
            }
            befores.forEach(item => {
                if (item !== null && item !== '' && afters.indexOf(item) === -1) {
                    delValue += item + ';'
                }
            })

            afters.forEach(item => {
                if (item !== null && item !== '' && befores.indexOf(item) === -1) {
                    addValue += item + ';'
                }
            })

            var resultStr = ''
            if (addValue !== null && addValue !== '') {
                addValue = addValue.substr(0, addValue.length - 1)
                resultStr += '议程变更，新增“' + addValue + '”'
            }

            if (delValue !== null && delValue !== '') {
                delValue = delValue.substr(0, delValue.length - 1)
                if (resultStr === '') {
                    resultStr += '议程变更，取消“' + delValue + '”'
                } else {
                    resultStr += '，取消“' + delValue + '”'
                }
            }

            return resultStr
        },
        formatLogContent (val) {
            if (val === undefined || val === null || val === '') {
                return []
            } else {
                return JSON.parse(val)
            }
        },
        closeDialog () {
            this.$emit('getListInfo')
            this.$emit('closeDialog')
            this.dialogVisible = false
        },
        
        showDialog (item) {
            console.log(item,"item")
            this.attendeeList = item
            this.dialogVisible = true
            //this.zhanKaiArray = []
        }
        // onSubmit () {

        //     var taskId = this.$refs["diningTask"].$refs.table.selection[0].id;
        //     var attendees = [];
        //     this.attendeeIds.forEach(item => {
        //         attendees.push({ "id": item })
        //     })
        //     var params = {
        //         "taskId": taskId,
        //         "attendees": attendees
        //     }
        //     console.log(params)
        //     addDiningTaskAttendee(params).then(res => {
        //         if (res.success) {
        //             this.$message("加入成功！")
        //             this.$refs["diningTask"].getListInfo(this.$refs["diningTask"].paramData)
        //         }
        //     })
        // }

    }
}
</script>
<style lang='scss'  >
.title {
    font-size: 16px;
    color: #191F24;
    font-weight: 700;
    margin-bottom: 10px;
}
.scrollbar {
    background:#FAFAFA;
    padding:10px;
    max-height:128px;
    color:#393939 !important;
    overflow-y:auto;
    .attendee-item {
        padding-bottom:10px;
        color: #191F24;
        .resideMessage{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            background: #fff;
            .resideDetail{
                width: 90%;
                height: 100%;
                line-height: 40px;
                // display: flex;
                // align-items: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
            }
        }
        span {
            line-height: 23px;
            color:#393939 !important;
        }
        .attendee-name {
            font-weight:700;
            width: 100px;display:inline-block;
        }
    }
}
/* 设置滚动条的样式 */
.scrollbar::-webkit-scrollbar {
width:8px;
}
/* 滚动槽 */
.scrollbar::-webkit-scrollbar-track {
-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
border-radius:6px;
}
/* 滚动条滑块 */
.scrollbar::-webkit-scrollbar-thumb {
border-radius:6px;
background:rgba(0,0,0,0.1);
-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
.scrollbar::-webkit-scrollbar-thumb:window-inactive {
background:#CCCCCC;
}
</style>
