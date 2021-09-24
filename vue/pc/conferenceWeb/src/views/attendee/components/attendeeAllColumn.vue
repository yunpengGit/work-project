<template>
    <div class="">
        <div v-for="columnItem in allColumnList" :key="columnItem.code">
            <el-table-column
                v-if="defalutColumnCodes.indexOf(columnItem.code) === -1 && specialColumns.indexOf(columnItem.code) === -1"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{ formatTableCellData(formatColumnBean(scope)[columnItem.code]) }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'phoneForMsg'"

                :label="columnItem.name"
                :min-width="120"
            >
                <template slot-scope="scope">
                    <PhoneEncryption :value="formatColumnBean(scope).phoneForMsg" />
                    <!-- <div>
                        <span>{{ formatTableCellData(formatPhone(formatColumnBean(scope).phoneForMsg)) }}</span>
                        <span style="display:none">{{ formatColumnBean(scope).phoneForMsg }}</span>
                        <el-button v-show="formatColumnBean(scope).phoneForMsg !== null && formatColumnBean(scope).phoneForMsg !== ''" icon="el-icon-view" type="text" @click="(event) => qiehuanshoujijiami(event)" />
                    </div> -->
                    <!-- <div @click="xianshi">aaa</div> -->
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'sex'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{ formatColumnBean(scope).sex === '1' ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'nation'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{ formatTableCellData(formatColumnBean(scope).nationStr) }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'positionLevel'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{ formatTableCellData(formatColumnBean(scope).positionLevelStr) }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'cardType'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{ formatTableCellData(formatColumnBean(scope).cardTypeStr) }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'cardFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).cardFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'bookDinnerFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).bookDinnerFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'bookStayFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).bookStayFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'bookTicketFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).bookTicketFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'ticketFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).ticketFlag === 1 ? '去程' : formatColumnBean(scope).ticketFlag === 2 ? '返程' : formatColumnBean(scope).ticketFlag === 3 ? '往返' : '-'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'pickUpFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).pickUpFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'arriveTime'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).arriveTime !== null && formatColumnBean(scope).arriveTime >= 17 ? formatColumnBean(scope).arriveTime.substr(0,16) : formatTableCellData(formatColumnBean(scope).arriveTime)
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'pickOutFlag'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).pickOutFlag === 1 ? '是' : '否'
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'returnTime'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatColumnBean(scope).returnTime !== null && formatColumnBean(scope).returnTime >= 17 ? formatColumnBean(scope).returnTime.substr(0,16) : formatTableCellData(formatColumnBean(scope).returnTime)
                    }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="columnItem.code === 'honourId'"

                :label="columnItem.name"
                :min-width="100"
            >
                <template slot-scope="scope">
                    {{
                        formatHonour(scope)
                    }}
                </template>
            </el-table-column>
        </div>
    </div>
</template>

<script>
import { formatPhone } from '@/utils/index'
export default {
    name: 'AttendeeAllColumn',
    props: {
        defalutColumnCodes: {
            type: Array,
            default: () => {
                return ['attendeeName', 'honourFlag', 'photoUrl', 'position', 'phone', 'organizationName', 'organizationSortName', 'photoUrl', 'photoUrl']
            }
        },
        allColumnList: {
            type: Array,
            default: () => {
                return []
            }
        },
        attendeeFlag: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            specialColumns: ['phoneForMsg', 'sex', 'nation', 'positionLevel', 'cardType', 'cardFlag', 'bookDinnerFlag', 'bookStayFlag', 'bookTicketFlag', 'ticketFlag', 'pickUpFlag', 'arriveTime', 'pickOutFlag', 'returnTime', 'honourId']
        }
    },
    beforeCreate() {
    },
    created() {
    },
    methods: {
        formatHonour(val) {
            var accompanyTotips = []
            if (this.attendeeFlag === 1) {
                accompanyTotips = val.row.accompanyTotips
            } else {
                accompanyTotips = val.row.attendee.accompanyTotips
            }

            var honourName = '-'
            if (accompanyTotips !== null) {
                var zhubin = accompanyTotips.find(item => item.name === '主宾信息')
                if (zhubin !== undefined && zhubin !== null && zhubin.attendeeAccompany !== null && zhubin.attendeeAccompany.length > 0) {
                    honourName = zhubin.attendeeAccompany[0].attendeeFixAttribute.attendeeName
                }
            }
            return honourName
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        },
        formatPhone(val) {
            return formatPhone(val)
        },
        formatColumnBean(val) {
            if (this.attendeeFlag === 1) {
                return val.row.fixAttributeCommonVO
            } else {
                return val.row.attendee.fixAttributeCommonVO
            }
        }

    }
}
</script>
<style lang="scss" scoped>
</style>
