<template>
    <div class="">
        <div style="height:68px;width: 100%;background-color: rgba(255, 255, 255, 0.92)">
            <div style="width: 84%;margin-left: 8%">
                <el-button style="margin-top:18px;height: 32px;" @click="fanhui"><i class="el-icon-back" style="margin-right:4px" />返回</el-button>
                <span style="margin-left:16px;height: 25px;font-size: 20px;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #191F24;line-height: 25px;padding-top:3px">请选择会议活动模板</span>
            </div>
        </div>
        <div :style="{'width': '100%', 'height': allHeight + 'px'}">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;">
                <div v-for="item in templateList" :key="item.id" style="width: 84%;margin-left: 8%;background-color: white;height:100%;background: #FFFFFF;box-shadow: 0px -1px 0px 0px rgba(25, 31, 36, 0.08);">
                    <el-row style="border-radius: 4px;">
                        <el-col :span="9" style="padding-left:20px;padding-top: 24px;padding-bottom: 24px">
                            <img :src="imagePath + item.coverDownloadUrl" style="height:206px;width: 100%">
                        </el-col>
                        <el-col :span="15" style="padding-left: 30px;padding-top: 24px">
                            <div style="width: 100%;height: 24px;">
                                <div class="nameClass" style="max-width:60%;float: left;">
                                    <div class="yihangxianshibuquan" style="width:100%">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top:4px;width: 100%;height:40px;margin-left: -8px">
                                <div v-for="(tag1, index1) in jiequTag(item.tag1)" :key="'tag1' + index1" class="tag1" :style="{'float': 'left', 'margin-left': '8px'}">
                                    {{ tag1 }}
                                </div>
                            </div>
                            <div style="width: 100%">
                                <div style="width: 100%;">
                                    <span class="lianghangxianshibuquan" style="width:90%;height:40px">
                                        {{ item.lable5 }}
                                    </span>
                                </div>

                            </div>
                            <div style="margin-top:10px;width: 100%;min-height:40px;">
                                <div v-for="(tag2, index2) in jiequTag(item.tag2)" :key="'tag2' + index2" class="tag2" :style="{'float': 'left', 'margin-left': '8px','margin-top': '3px'}">
                                    {{ tag2 }}
                                </div>
                            </div>
                            <div style="margin-top:10px">
                                <el-button style="margin-left:10px;margin-top:5px;float:left;box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08);border-radius: 4px;" size="small" type="primary" @click="xuanzemuban(item)">确认选择</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getTemplateList } from '@/api/conference'
import { getOssBaseUrl } from '@/utils/x-sso-baseurl'
import { setConferenceTemplate } from '@/utils/conference-auth'
export default {
    name: 'SelectConferenceTemplate',
    data() {
        return {
            allHeight: getTableHeight(0),
            templateList: [],
            imagePath: getOssBaseUrl()
        }
    },
    created() {
        getTemplateList().then(res => {
            this.templateList = res.result
        })
    },
    methods: {
        jiequTag(val) {
            if (val === null) {
                return []
            }
            return val.split(',')
        },
        fanhui() {
            this.$router.replace({
                path: '/index'
            })
            // window.history.back()
        },
        xuanzemuban(val) {
            setConferenceTemplate(val)
            this.$router.push({
                path: '/meetingCreate/create',
                query: {
                    conferenceTemplate: JSON.stringify(val)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .tag1 {
        padding-left: 8px;
        padding-right: 8px;
        height: 20px;
        background: rgba(25, 31, 36, 0);
        border-radius: 2px;
        border: 1px solid #FF8200;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF8200;
        line-height: 20px;
    }
    .tag2 {
        padding-left: 8px;
        padding-right: 8px;
        height: 20px;
        background: rgba(25, 31, 36, 0);
        border-radius: 2px;
        border: 1px solid rgba(25, 31, 36, 0.16);
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.72);
        line-height: 20px;
    }
    .nameClass {
        height: 22px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191F24;
        line-height: 22px;
    }
    .lianghangxianshibuquan {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .yihangxianshibuquan {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .biaoqian1CLass {
        height: 20px;
        background: rgba(25, 31, 36, 0);
        border-radius: 2px;
        border: 1px solid #FF8200;
    }
</style>
