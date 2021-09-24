<template>
    <div class="table-xiao" style="height:100%">
        <el-row style="height:100%">
            <el-col :span="12" style="height:100%">
                <div class="youxia" style="height:100%">
                    <div class="heightpos">
                        <el-row style="padding-bottom:10px">
                            <span class="cardtitle">合作方通讯录</span>
                        </el-row>
                    </div>
                    <div class="tablediv">
                        <el-table
                            :data="tableDataHezuo"
                            stripe
                            style="width: 100%"
                            height="100%"
                        >
                            <el-table-column
                                prop="name"
                                label="合作方"
                            />
                            <el-table-column
                                prop="contactPerson"
                                label="联系人"
                            />
                            <el-table-column
                                prop="phone"
                                label="电话"
                            />
                        </el-table>
                    </div>
                </div>
            </el-col>
            <el-col :span="12" style="height:100%">
                <div class="zuoxia" style="height:100%">
                    <div class="heightpos">
                        <el-row style="padding-bottom:10px">
                            <span class="cardtitle">会务组通讯录</span>
                        </el-row>
                    </div>
                    <div class="tablediv">
                        <el-table
                            :data="tableDataHuiwuzu"
                            stripe
                            style="width: 100%"
                            height="100%"
                        >
                            <el-table-column
                                prop="roleName"
                                label="名称"
                            />
                            <el-table-column
                                prop="userName"
                                label="姓名"
                            />
                            <el-table-column
                                prop="mobile"
                                label="电话"
                            />
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { findUsersByConferenceId } from '@/api/conferenceGroupUser'
import { getConferenceId } from '@/utils/conference-auth'
import { getContact } from '@/api/overview'
export default {
    name: 'InMeetingLeftBottom',
    data() {
        return {
            tableDataHezuo: [],
            tableDataHuiwuzu: []
        }
    },
    created() {
        this.findUsersByConferenceId()
        this.getContact()
    },
    methods: {
        findUsersByConferenceId() {
            findUsersByConferenceId({ 'conferenceId': getConferenceId() }).then(res => {
                this.tableDataHuiwuzu = res.result.list
            })
        },
        getContact() {
            getContact({ 'conferenceId': getConferenceId() }).then(res => {
                this.tableDataHezuo = res.result.list
            })
        }
    }
}
</script>

<style scoped>
    .youxia {
        background-color: #fafafa;
        padding: 10px;
        margin-right: 5px;
        position: relative;
    }
    .zuoxia {
        background-color: #fafafa;
        padding: 10px;
        margin-left: 5px;
        position: relative;
    }
    .cardtitle {
        /* font-size: 16px; */
        font-size: 1.3em;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        /* line-height: 21px; */
    }
    .tablediv {
        position: absolute;
        /* top:40px; */
        top:19%;
        bottom: 10px;
        left: 10px;
        right: 10px;
    }
    .el-table--small {
        font-size: 1em;
    }
    .el-button--mini {
        font-size: 1em;
    }
</style>
