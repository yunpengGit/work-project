<template>
    <div class="" :style="{'height':treeHeight + 'px','overflow-x':'hidden','overflow-y':'auto', 'padding-bottom': '10px'}">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
            <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px;padding-bottom: 10px;">
                <div v-show="(data !== null && data.length > 0)">

                    <el-tree
                        v-show="data !== null && data.length > 0"
                        ref="tree"
                        :data="data"
                        :props="defaultProps"
                        default-expand-all
                        :expand-on-click-node="false"
                        :render-content="renderContent"
                    />

                </div>
                <div v-show="!(data !== null && data.length > 0)" :style="{'text-align':'center'}">
                    <div style="margin-top:60px;"><img src="@/assets/tree-no-data.png"></div>
                    <div style="margin-left:-12px;margin-top:20px;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 18px;">暂无数据</div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { getListByUser, agendaSignInByOrganized, agendaCancelByOrganized } from '@/api/agenda'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'AgendaTree',
    props: {
        attendeeId: {
            type: null,
            default: null
        },
        treeHeight: {
            type: Number,
            default: 300
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            data: []
        }
    },
    watch: {
        attendeeId(val) {
            if (val !== null) {
                this.getListByUser(val)
            } else {
                this.data = []
            }
        }
    },
    created() {
        if (this.attendeeId !== null && this.attendeeId !== '' && this.attendeeId !== 0) {
            this.getListByUser(this.attendeeId)
        }
    },
    methods: {
        getListByUser(val) {
            getListByUser({ 'attendeeId': val, 'conferenceId': getConferenceId() }).then(res => {
                this.data = res.result
            })
        },
        qiandao(node, data, event) {
            // var that = event.currentTarget
            var submitData = {
                conferenceId: getConferenceId(),
                attendeeIds: [this.attendeeId],
                signInType: 3,
                agendaId: data.id
            }
            agendaSignInByOrganized(submitData).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    data.signInStatus = 1
                    this.$emit('refreshChenInstatus', null)
                    // this.getListByUser(this.attendeeId)
                    // that.innerHTML = '取消签到'
                    // event = this.quxiaoqiandao(node, data, event)
                }
            })
        },
        quxiaoqiandao(node, data, event) {
            // var that = event.currentTarget
            var submitData = {
                attendeeIds: [this.attendeeId],
                agendaIds: [data.id]
            }
            agendaCancelByOrganized(submitData).then(res => {
                if (res.success) {
                    this.$message(res.message)
                    // this.getListByUser(this.attendeeId)
                    data.signInStatus = 0
                    this.$emit('refreshChenInstatus', null)
                    // that.innerHTML = '签到'
                    // that.onclick = this.qiandao(node, data, event)
                }
            })
        },
        renderContent(h, { node, data, store }) {
            if (data.parentId === undefined) {
                return (
                    <span class='custom-tree-node' style='width:100%;padding-right:10px;'>
                        <span style='font-size:14px;line-height:32px;color:#191F24;' title={ data.date }>{data.date}</span>
                    </span>)
            } else {
                var str = ''
                if (node.label.length > 10) {
                    str = node.label.substring(0, 10) + '...'
                } else {
                    str = node.label
                }
                var dateStr = (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)

                console.log(str)

                if (data.signInStatus !== 1) {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label }>{dateStr}<span style='margin-left:20px;'>{ str }</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            <span>
                                <el-button v-permission={this.Global.buttons.AttendeeQuery.signin} type='text' style='margin-left:12px;float:right;font-size:14px' on-click={ (event) => this.qiandao(node, data, event) }>
                                    签到
                                </el-button>
                            </span>
                        </span>)
                } else {
                    return (
                        <span class='custom-tree-node' style='width:100%;padding-right:10px;padding-top:3px;height:40px' >
                            <span style='font-size:14px;line-height:32px;color:#191F24;' title={ node.label }>{dateStr}<span style='margin-left:20px;'>{ str }</span><span v-show={ data.recommend !== null && data.recommend !== '' } style='padding-left:2px;padding-right:2px;margin-left:10px;background: #FF8200;color:white;width: 52px;height: 20px;border-radius: 3px;font-family: PingFangSC-Medium, PingFang SC;'>{ data.recommend }</span></span>
                            <span>
                                <el-button v-permission={this.Global.buttons.AttendeeQuery.signin} type='text' style='margin-left:12px;float:right;font-size:14px' on-click={ (event) => this.quxiaoqiandao(node, data, event) }>
                                    取消签到
                                </el-button>
                            </span>
                        </span>)

                //
                }
            }
        }
        // this.getListByUser(val.id)
    }

}
</script>
<style lang="scss" scoped>
</style>
