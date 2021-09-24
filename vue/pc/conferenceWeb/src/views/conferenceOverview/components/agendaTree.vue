<template>
    <div class="">
        <div v-for="(item1, index1) in data" :key="'item1' + index1" style="width: 100%">
            <div style="width:100%;padding-right:10px;">
                <el-link :underline="false" @click="(event) => xianshizijiedian(event)"><span style="font-size:14px;line-height:32px;color:#191F24;" :title="item1.date">{{ item1.date }}
                    {{ formatXingqi(item1.date) }}</span></el-link>
                <!-- <img v-if="findTianqiItem(item1) !== null" style="float:right;height: 20px;margin-top: 6px" :src="tianqiImg + findTianqiItem(item1).wea_img + '.png'"> -->
                <svg-icon v-if="findTianqiItem(item1) !== null" :icon-class="findTianqiItem(item1).wea_img" style="float:right;height: 20px;width:20px;margin-top: 6px" />
                <span v-if="findTianqiItem(item1) !== null" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 32px;margin-right:10px;float:right">{{ findTianqiItem(item1).tem1 }}/{{ findTianqiItem(item1).tem2 }}</span>
            </div>
            <div :style="{'width':'100%','padding-right':'20px', 'display': panduanshibushijintian(item1.date, index1, data)}">
                <div v-if="item1.children !== undefined && item1.children !== null">
                    <div v-for="(item2, index2) in item1.children" :key="'item2' + index2">
                        <div style="width:100%;padding-right:10px;padding-left:20px;">
                            <el-link :underline="false" @click="(event) => xianshizijiedian(event)">
                                <div style="font-size:14px;line-height:32px;color:#191F24;float: left">{{ formatTime(item2) }}</div>
                                <div style="font-size:14px;line-height:32px;color:#191F24;margin-left:10px;float: left">
                                    <div :title="item2.name">
                                        {{ formatName(item2.name) }}
                                    </div>
                                    <div :title="item2.address" style="height: 16px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 16px;">
                                        {{ formatAddress(item2.address) }}
                                    </div>
                                </div>
                            </el-link>
                        </div>
                        <div style="width:100%;padding-right:20px;">
                            <div v-if="item2.children !== undefined && item2.children !== null">
                                <div v-for="(item3, index3) in item2.children" :key="'item3' + index3">
                                    <div style="width:100%;padding-right:10px;padding-left:40px;">
                                        <el-link :underline="false">
                                            <div style="font-size:14px;line-height:32px;color: rgba(25, 31, 36, 0.64);;float: left">{{ formatTime(item3) }}</div>
                                            <div style="font-size:14px;line-height:32px;color:#191F24;margin-left:10px;float: left">
                                                <div :title="item3.name">
                                                    {{ formatName(item3.name) }}
                                                </div>
                                                <div :title="item3.address" style="height: 16px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: rgba(25, 31, 36, 0.48);line-height: 16px;">
                                                    {{ formatAddress(item3.address) }}
                                                </div>
                                            </div>
                                        </el-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GMTToStrYYYYMMDD, formatXingqi } from '@/utils/index'
import { formatCity } from '@/utils/city'
import axios from 'axios'
import { getList as getAgendaList } from '@/api/agenda'
import { getConferenceId } from '@/utils/conference-auth'
export default {
    name: 'OverviewAgenda',
    props: {
        conferenceView: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            tianqiApi: process.env.VUE_APP_TIANQI_API,
            tianqiImg: process.env.VUE_APP_TIANQI_IMG,
            tianqis: [],
            data: []
        }
    },
    mounted() {
        // this.huyoqutianqi()
        // this.getAgendaList()
    },
    methods: {
        formatXingqi(val) {
            return formatXingqi(val)
        },
        formatName(name) {
            if (name === null || name.length < 10) {
                return name
            } else {
                return name.substr(0, 9) + '...'
            }
        },
        formatAddress(address) {
            if (address === null || address.length < 15) {
                return address
            } else {
                return address.substr(0, 14) + '...'
            }
        },
        formatTime(data) {
            return (data.startTime !== null && data.startTime.length === 8 ? data.startTime.substr(0, 5) : data.startTime) +
                '~' + (data.endTime !== null && data.endTime.length === 8 ? data.endTime.substr(0, 5) : data.endTime)
        },
        panduanshibushijintian(date, index, items) {
            if (GMTToStrYYYYMMDD(new Date()) === date) {
                return ''
            }

            var index1 = items.findIndex(item => item.date >= GMTToStrYYYYMMDD(new Date()))

            if (index1 === -1) {
                if (index === 0) {
                    return ''
                }
            }

            if (index1 === index) {
                return ''
            }

            // var jintian =
            // if (this.conferenceView.conferenceStatus === 2) {
            //     if (index === items.length - 1) {
            //         return ''
            //     }
            // } else if (this.conferenceView.conferenceStatus === 3) {
            //     // if (date === ) {
            //     //     return ''
            //     // }
            // } else {
            //     if (index === 0) {
            //         return ''
            //     }
            // }
            return 'none'
        },
        getAgendaList() {
            getAgendaList({ 'conferenceId': getConferenceId() }).then(res => {
                this.data = res.result
            })
        },
        xianshizijiedian(event) {
            var oldDisplay = event.currentTarget.parentElement.parentElement.children[1].style.display
            if (oldDisplay !== 'none') {
                event.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.parentElement.children[1].style.display = ''
            }
        },
        findTianqiItem(data) {
            if (this.tianqis === null || this.tianqis.length === 0) {
                return null
            }
            var tianItem = this.tianqis.find(item => item.date === data.date)
            if (tianItem === undefined || tianItem === null) {
                return null
            }
            return tianItem
        },
        huyoqutianqi(data) {
            var city = formatCity(data.provinceValue, data.cityValue)
            if (city !== null && city !== '') {
                var cityTemp = city.replace('市', '')

                axios.get(this.tianqiApi + '&city=' + cityTemp).then(response => {
                    console.log(response.data.data)
                    this.tianqis = response.data.data
                }).catch(error => {
                    console.log(error)
                    // _that.$message('天气获取失败')
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
