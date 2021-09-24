<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="标签名称">
                        <el-input v-model.trim="pageInfo.nameLike" class="widthClass" maxlength="25" placeholder="" />
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div style="background-color: #EEF0F4;height:8px;width:100%" />
        <div style="background-color: white;padding-left:10px;padding-top:10px;padding-right: 10px">
            <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeTag.delete" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.AttendeeTag.insert" type="primary" @click="add">添加</el-button>
                <!-- <el-button v-permission="Global.buttons.AttendeeTag.import" @click="importFunction">导入</el-button>
                <el-button v-permission="Global.buttons.AttendeeTag.export" @click="exportFunction">导出</el-button> -->
            </div>
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeTag.insert) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeTag.delete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.AttendeeTag.import) !== -1 ? 0: 32)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <!-- width="180" -->
                <el-table-column
                    prop="name"
                    label="标签名称"
                />
                <el-table-column
                    label="标签"
                >
                    <template slot-scope="scope">
                        <el-tag style="margin-left:4px" :style="{ backgroundColor: scope.row.backgroundColor, color: scope.row.fontColor }" type="info">
                            <!-- {{ tagVO.name }} -->
                            <!-- {{ scope.row.tagVOs !== null && scope.row.tagVOs.length > 0 ? '' : '-' }} -->
                            <el-tooltip placement="bottom" effect="light">
                                <div slot="content">
                                    {{ scope.row.tagTitle }}
                                </div>
                                <div class="danhangxianshibuquan">{{ scope.row.tagTitle !== null && scope.row.tagTitle.length > 5 ? scope.row.tagTitle.substr(0,4) + '...' : scope.row.tagTitle }}</div>
                            </el-tooltip>
                        </el-tag>
                        <!-- <el-tag v-for="tagVO in scope.row.tagVOs" :key="tagVO.id" style="margin-left:4px" type="info">{{ tagVO.name }}</el-tag> -->
                    </template>
                </el-table-column>
                <!-- <el-form-item label="标签">
                    <el-select v-model="pageInfo.tagIdsIn" class="width100Class" placeholder="全部" clearable>
                        <el-option
                            v-for="item in tagList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item> -->
                <el-table-column
                    prop="relationAttendeeNum"
                    label="关联人数"
                />
                <el-table-column
                    prop="createUserName"
                    label="添加人"
                />
                <el-table-column
                    prop="createTime"
                    label="添加时间"
                />
                <el-table-column
                    label="操作"
                    width="360"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-permission="Global.buttons.AttendeeTag.edit"
                            @click.native.prevent="edit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.AttendeeTag.delete"
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button>
                        <el-button
                            @click.native.prevent="viewAttendee(scope.row)"
                        >
                            查看{{ getConferenceTemplate(2) }}
                        </el-button>
                        <el-button
                            v-permission="Global.buttons.AttendeeTag.addAttendee"
                            @click.native.prevent="addAttendee(scope.row)"
                        >添加{{ getConferenceTemplate(2) }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <el-drawer
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            destroy-on-close
            size="40%"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto',}"
            >
                <!-- 'border-top': 'solid #ccc 1px' aaaaaa-->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="标签名称" prop="name">
                        <el-input class="keepOutRight" v-model="ruleForm.name" show-word-limit maxlength="30" style="width:80%" placeholder="请输入标签名称" />
                    </el-form-item>
                    <el-form-item label="标签颜色">
                        <el-select v-model="colorsValue" placeholder="请选择颜色标签" style="width:80%" @change="colorsChange">
                            <el-option
                                v-for="ele in colorsData"
                                :key="ele.value"
                                :label="ele.label"
                                :value="ele.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签描述" prop="description">
                        <el-input
                            v-model="ruleForm.description"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            maxlength="300"
                            placeholder="填写标签的描述可以让会务组其他人员更清晰的知道这个标签的作用哦~"
                            style="width:80%"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
        <!-- <TagAttendeeList :tag-name="tagName" :attendee-dialog-visible="attendeeDialogVisible" :tag-id="tagId" @closeDialog="closeAttendeeDialog" /> -->
        <ImportAttendeeTag :dialog-visible="importDialogVisible" @closeDialog="closeImportDialog" />
        <!-- <PickAttendee :pick-dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" /> -->

        <PickAttendeeToMsg :tag-id="tagId" :dialog-disabled="dialogDisabled" :model-type="modelType" :dialog-visible="pickDialogVisible" @closeDialog="closePickAttendeeDialog" />
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, insert, update, deleteBatch, getView, insertTagAttendee } from '@/api/attendeeTag'
import { getConferenceId } from '@/utils/conference-auth'
// import TagAttendeeList from './attendeeList'
import ImportAttendeeTag from './importAttendeeTag'
// import PickAttendee from '../components/pickAttendee'
import PickAttendeeToMsg from '@/views/msg/log/pickAttendee'
import { getColors } from '@/api/newExtend'

export default {
    name: 'AttendeeTag',
    components: {
        PickAttendeeToMsg,
        // PickAttendee,
        // TagAttendeeList,
        ImportAttendeeTag
    },
    props: {
    },
    data() {
        return {
            dialogDisabled: false,
            modelType: 2,
            pickDialogVisible: false,
            importDialogVisible: false,
            attendeeDialogVisible: false,
            tagId: null,
            tagName: null,
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            loading: false,
            ruleForm: {
                id: null,
                name: null,
                description: null,
                colorId: null
            },
            rules: {
                name: [{ required: true, message: '请输入标签名称', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            dialogTitle: '添加标签',
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(170),
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            colorsData: [],
            colorsValue: '随机颜色'
        }
    },
    created() {
        this.search()
        // 获取颜色列表
        this.getColors()
    },
    methods: {
        colorsChange(val) {
            // if (val === '随机颜色') {
            //     const colors = this.colorsData.slice(1)
            //     const random = Math.floor(Math.random() * 5)
            //     console.log(random)
            //     this.ruleForm.colorId = colors[random].value
            // } else {
            //     const choiceData = this.colorsData.find(ele => ele.value === val)
            //     this.ruleForm.colorId = choiceData.value
            // }
        },
        // 获取颜色列表
        getColors() {
            getColors().then(res => {
                const data = res.result
                data.forEach(ele => {
                    ele.value = ele.id
                    ele.label = ele.tagTitle
                })
                data.unshift({ value: '随机颜色', id: -1 })
                this.colorsData = res.result
            })
        },
        closeAttendeeDialog() {
            this.tagId = null
            this.tagName = null
            this.pickDialogVisible = false
            this.modelType = 2
            this.dialogDisabled = false
            this.getList()
        },
        viewAttendee(val) {
            this.tagId = val.id
            this.tagName = val.name
            this.pickDialogVisible = true
            this.modelType = 1
            this.dialogDisabled = true
        },
        addAttendee(val) {
            this.tagId = val.id
            this.tagName = val.name
            this.pickDialogVisible = true
            this.modelType = 2
            this.dialogDisabled = false
        },
        closePickAttendeeDialog(val) {
            if (val !== null) {
                var params = []
                val.forEach(item => {
                    params.push(item.id)
                })

                var dataTemp = {
                    conferenceId: getConferenceId(),
                    tagId: this.tagId,
                    tagName: this.tagName,
                    attendeeIds: params
                }
                insertTagAttendee(dataTemp).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.pickDialogVisible = false
                        this.getList()
                        this.tagId = null
                        this.tagName = null
                    }
                })
            } else {
                this.pickDialogVisible = false
                this.tagId = null
                this.tagName = null
            }
        },
        resetSearch() {
            this.pageInfo = {
                pageNum: 1,
                pageSize: 10,
                total: this.pageInfo.total
            }
        },
        edit(val) {
            console.log(val)
            getView({ 'id': val.id }).then(res => {
                this.dialogTitle = '编辑标签'
                this.ruleForm.id = res.result.id
                this.ruleForm.name = res.result.name
                this.ruleForm.description = res.result.description
                this.colorsValue = val.colorId
                // this.colorsValue = val.tagTitle
                this.dialogVisible = true
                console.log(this.colorsValue, this.colorsData)
            })
        },
        add(val) {
            this.dialogTitle = '添加标签'
            this.ruleForm.id = null
            this.ruleForm.name = null
            this.ruleForm.description = null
            this.ruleForm.colorId = null
            this.colorsValue = '随机颜色'
            this.dialogVisible = true
        },
        del(row) {
            this.deleteSubmit([row.id])
        },
        deleteBatch() {
            if (this.multipleSelection.length === 0) {
                this.$message('至少选择一条记录')
                return
            }
            const param = []
            this.multipleSelection.forEach(item => {
                param.push(item.id)
            })
            this.deleteSubmit(param)
        },
        deleteSubmit(param) {
            this.$confirm('请确认是否删除标签信息？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBatch({ 'ids': param }).then(res => {
                    if (res.success) {
                        this.$message(res.message)
                        this.search()
                    }
                })
            }).catch(() => {})
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        insert() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    // 当前所选颜色id
                    if (this.colorsValue === '随机颜色') {
                        const colors = this.colorsData.slice(1)
                        const random = Math.floor(Math.random() * 5)
                        this.ruleForm.colorId = colors[random].value
                    } else {
                        const choiceData = this.colorsData.find(ele => ele.value === this.colorsValue)
                        this.ruleForm.colorId = choiceData.value
                    }
                    this.ruleForm.conferenceId = this.conferenceId
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        update(this.ruleForm).then(res => {
                            this.loading = true
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        insert(this.ruleForm).then(res => {
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.getList()
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        closeDialog(val) {
            this.dialogVisible = false
            this.search()
            this.$refs['ruleForm'].resetFields()
            this.ruleForm.id = null
        },
        getList() {
            this.pageInfo.conferenceId = this.conferenceId
            getList(this.pageInfo).then(res => {
                this.tableData = res.result.list
                this.pageInfo.total = res.result.total
            })
        },
        search() {
            this.pageInfo.pageNum = 1
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val
            this.getList()
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val
            this.getList()
        },
        importFunction() {
            this.importDialogVisible = true
        },
        closeImportDialog() {
            this.importDialogVisible = false
        },
        exportFunction() {
        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
</style>
