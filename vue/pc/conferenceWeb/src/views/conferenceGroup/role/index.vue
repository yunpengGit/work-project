<template>
    <div style="padding-left:8px;padding-right:8px;margin-top:8px">
        <div class="clearfix">
            <div style="background-color: white;padding-left:10px;padding-top: 15px">
                <el-form :inline="true" :model="pageInfo">
                    <el-form-item label="角色名称">
                        <el-input v-model.trim="pageInfo.conferenceGroupRoleNameLike" class="widthClass" maxlength="25" placeholder="" />
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
            <!-- <div style="float: left; text-center: left;margin-left:10px;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ConferenceGroupRole.delete" @click="deleteBatch">批量删除</el-button>
            </div>
            <div style="float: right; text-center: right;padding-bottom:10px;">
                <el-button v-permission="Global.buttons.ConferenceGroupRole.insert" type="primary" @click="add">添加</el-button>
            </div> -->
            <!-- :height="tableHeight + (this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceGroupRole.delete) !== -1 ||
                    this.$store.state.menu.buttons.indexOf(Global.buttons.ConferenceGroupRole.insert) !== -1 ? 0: 32)" -->
            <el-table
                ref="table"
                :data="tableData"
                :height="tableHeight"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectInit"
                /> -->
                <!-- width="280" -->
                <el-table-column
                    prop="name"
                    label="角色名称"
                />
                <el-table-column
                    prop="accountNumber"
                    label="人员"
                />
                <el-table-column
                    label="操作"
                    width="200"
                >
                    <template slot-scope="scope">
                        <!--  -->
                        <!--   -->
                        <el-button
                            v-permission="Global.buttons.ConferenceGroupRole.edit"
                            @click.native.prevent="edit(scope.row)"
                        >
                            查看详情
                        </el-button>
                        <!-- <el-button
                            @click.native.prevent="viewAttendee(scope.row)"
                        >
                            查看人员
                        </el-button> -->
                        <!-- <el-button
                            v-permission="Global.buttons.ConferenceGroupRole.delete"
                            :disabled="scope.row.defaultFlag === 1"
                            @click.native.prevent="del(scope.row)"
                        >
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    :page-sizes="[10, 20, 30, 40]"
                    :current-page="pageInfo.pageNum"
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
                <!-- 'border-top': 'solid #ccc 1px' -->
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
                    <el-form-item label="角色名称" prop="name">
                        <el-input class="keepOutRight" v-model="ruleForm.name" show-word-limit maxlength="30" style="width:80%" placeholder="请输入角色名称" />
                    </el-form-item>
                    <el-form-item label="包含资源" prop="name">
                        <el-radio-group v-model="platformType">
                            <el-radio :label="1">PC端</el-radio>
                            <el-radio :label="2">App</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="name">
                        <el-tree
                            v-show="platformType === 1"
                            ref="tree"
                            check-strictly
                            node-key="resCode"
                            :data="resData"
                            :props="defaultProps"
                            default-expand-all
                            :expand-on-click-node="false"
                            :default-checked-keys="defaultCheckedNodes"
                            show-checkbox
                            @check-change="handleCheckChange"
                        />
                        <el-tree
                            v-show="platformType === 2"
                            ref="appTree"
                            check-strictly
                            node-key="resCode"
                            :data="appResData"
                            :props="defaultProps"
                            default-expand-all
                            :expand-on-click-node="false"
                            :default-checked-keys="defaultCheckedNodes"
                            show-checkbox
                            @check-change="handleCheckChange1"
                        />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <div class="demo-drawer__footer" style="height:60px;text-align:center;padding-right:20px;padding-top:3px;border-top:solid 1px #DDDDDD">
                <el-button style="height:32px;margin-top:12px" @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="loading" style="height:32px;margin-top:12px" @click="insert">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getTableHeight } from '@/utils/index'
import { getList, insert, update, deleteBatch, getView } from '@/api/conferenceGroupRole'
import { getConferenceId } from '@/utils/conference-auth'
import { getConferenceRes } from '@/api/conferenceGroupRole'
export default {
    name: 'ConferenceGroupUser',
    props: {
    },
    data() {
        return {
            platformType: 1,
            appResData: [],
            defaultCheckedNodes: [],
            resData: [],
            defaultProps: {
                children: 'children',
                label: 'resName'
            },
            roles: [],
            dialogHeight: getTableHeight(35) + 'px',
            multipleSelection: [],
            loading: false,
            ruleForm: {
                id: null,
                name: ''
            },
            rules: {
                name: [{ required: true, message: '请输入角色名称', pattern: '[^ \x22]+', trigger: 'blur' }]
            },
            dialogTitle: '添加会务组',
            dialogVisible: false,
            conferenceId: getConferenceId(),
            tableData: [],
            tableHeight: getTableHeight(120),
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.resData = []
                this.getConferenceRes()
            }
        }
    },
    created() {
        this.search()
    },
    methods: {
        getConferenceRes() {
            getConferenceRes({ conferenceId: getConferenceId(), platformType: 1 }).then(res => {
                this.resData = res.result
            })
            getConferenceRes({ conferenceId: getConferenceId(), platformType: 2 }).then(res => {
                this.appResData = res.result
            })
        },
        selectInit(row, index) {
            if (row.defaultFlag === 1) {
                return false // 不可勾选
            } else {
                return true // 可勾选
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
            getView({ 'id': val.id }).then(res => {
                this.dialogTitle = '编辑会务组'
                this.dialogVisible = true
                this.ruleForm.id = res.result.id
                this.ruleForm.name = res.result.name
                this.defaultCheckedNodes = res.result.resCodes
                if (this.defaultCheckedNodes === null) {
                    this.defaultCheckedNodes = ['AttendeeView']
                } else {
                    this.defaultCheckedNodes.push('AttendeeView')
                }
            })
        },
        add(val) {
            this.dialogTitle = '添加会务组'
            this.dialogVisible = true
            this.ruleForm = {
                id: null,
                name: null
            }
            this.defaultCheckedNodes = ['AttendeeView']
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
            this.$confirm('请确认是否删除会务组信息?', '', {
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
                    this.ruleForm.conferenceId = this.conferenceId
                    var params = this.$refs.tree.getCheckedKeys()
                    this.ruleForm.conferenceGroupRoleResList = []
                    var resCode = []
                    var that = this
                    if (params !== null) {
                        params.forEach(item => {
                            that.ruleForm.conferenceGroupRoleResList.push({
                                conferenceResCode: item,
                                platformType: 1,
                                operateFlag: 1
                            })
                        })
                        resCode = params
                    }

                    var params1 = this.$refs.appTree.getCheckedKeys()
                    if (params1 !== null) {
                        params1.forEach(item => {
                            that.ruleForm.conferenceGroupRoleResList.push({
                                conferenceResCode: item,
                                platformType: 2,
                                operateFlag: 1
                            })
                            resCode.push(item)
                        })
                    }

                    this.ruleForm.resCodes = resCode
                    if (this.ruleForm.id !== null && this.ruleForm.id !== '' && this.ruleForm.id !== undefined) {
                        update(this.ruleForm).then(res => {
                            this.loading = true
                            if (res.success) {
                                this.$message('保存成功')
                                this.closeDialog()
                                this.search()
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
                                this.search()
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
        handleCheckChange(data, checked, indeterminate) {
            if (data.children !== null && data.children.length > 0) {
                var that = this
                if (checked) {
                    var childreFlag = false
                    var currentCode = this.$refs.tree.getNode(data.resCode)
                    currentCode.childNodes.forEach(item => {
                        if (item.checked) {
                            childreFlag = true
                        }
                    })
                    if (!childreFlag) {
                        data.children.forEach(item => {
                            console.log(that.defaultCheckedNodes.indexOf(item.resCode))
                            if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
                                var params = this.$refs.tree.getCheckedKeys()
                                params.push(item.resCode)
                                that.$refs.tree.setCheckedKeys(params)
                            }
                        })
                    }
                } else {
                    data.children.forEach(item => {
                        console.log(that.defaultCheckedNodes.indexOf(item.resCode))
                        if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
                            var params = this.$refs.tree.getCheckedKeys()
                            params.push(item.resCode)

                            var checkeParams = []
                            params.forEach(item1 => {
                                if (item.resCode !== item1) {
                                    checkeParams.push(item1)
                                }
                            })

                            that.$refs.tree.setCheckedKeys(checkeParams)
                        }
                    })
                }
            }
            if (checked) {
                if (this.defaultCheckedNodes.indexOf(data.parentCode) === -1) {
                    var params = this.$refs.tree.getCheckedKeys()
                    params.push(data.parentCode)
                    this.$refs.tree.setCheckedKeys(params)
                }
            } else {
                if (data.parentId !== null && data.parentId !== '') {
                    var parentNode = this.$refs.tree.getNode(data.parentCode)
                    if (parentNode !== null) {
                        var childrenNodes = parentNode.childNodes
                        var childrenChecked = false
                        childrenNodes.forEach(item => {
                            if (item.checked) {
                                childrenChecked = true
                            }
                        })
                        if (!childrenChecked) {
                            var params1 = this.$refs.tree.getCheckedKeys()
                            params1.splice(params1.indexOf(data.parentCode), 1)
                            this.$refs.tree.setCheckedKeys(params1)
                        }
                    }
                }
            }
        },
        handleCheckChange1(data, checked, indeterminate) {
            if (data.children !== null && data.children.length > 0) {
                var that = this
                if (checked) {
                    var childreFlag = false
                    var currentCode = this.$refs.appTree.getNode(data.resCode)
                    currentCode.childNodes.forEach(item => {
                        if (item.checked) {
                            childreFlag = true
                        }
                    })
                    if (!childreFlag) {
                        data.children.forEach(item => {
                            console.log(that.defaultCheckedNodes.indexOf(item.resCode))
                            if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
                                var params = this.$refs.appTree.getCheckedKeys()
                                params.push(item.resCode)
                                that.$refs.appTree.setCheckedKeys(params)
                            }
                        })
                    }
                } else {
                    data.children.forEach(item => {
                        console.log(that.defaultCheckedNodes.indexOf(item.resCode))
                        if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
                            var params = this.$refs.appTree.getCheckedKeys()
                            params.push(item.resCode)

                            var checkeParams = []
                            params.forEach(item1 => {
                                if (item.resCode !== item1) {
                                    checkeParams.push(item1)
                                }
                            })

                            that.$refs.appTree.setCheckedKeys(checkeParams)
                        }
                    })
                }
            }
            if (checked) {
                if (this.defaultCheckedNodes.indexOf(data.parentCode) === -1) {
                    var params = this.$refs.appTree.getCheckedKeys()
                    params.push(data.parentCode)
                    this.$refs.appTree.setCheckedKeys(params)
                }
            } else {
                if (data.parentId !== null && data.parentId !== '') {
                    var parentNode = this.$refs.appTree.getNode(data.parentCode)
                    if (parentNode !== null) {
                        var childrenNodes = parentNode.childNodes
                        var childrenChecked = false
                        childrenNodes.forEach(item => {
                            if (item.checked) {
                                childrenChecked = true
                            }
                        })
                        if (!childrenChecked) {
                            var params1 = this.$refs.appTree.getCheckedKeys()
                            params1.splice(params1.indexOf(data.parentCode), 1)
                            this.$refs.appTree.setCheckedKeys(params1)
                        }
                    }
                }
            }
        },
        // handleCheckChange(data, checked, indeterminate) {
        //     if (data.children !== null && data.children.length > 0 && (data.parentId === null || data.parentId === '')) {
        //         if (data.children !== null) {
        //             var that = this
        //             if (checked) {
        //                 data.children.forEach(item => {
        //                     console.log(that.defaultCheckedNodes.indexOf(item.resCode))
        //                     if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
        //                         var params = this.$refs.tree.getCheckedKeys()
        //                         params.push(item.resCode)
        //                         that.$refs.tree.setCheckedKeys(params)
        //                     }
        //                 })
        //             } else {
        //                 data.children.forEach(item => {
        //                     console.log(that.defaultCheckedNodes.indexOf(item.resCode))
        //                     if (that.defaultCheckedNodes.indexOf(item.resCode) === -1) {
        //                         var params = this.$refs.tree.getCheckedKeys()
        //                         params.push(item.resCode)

        //                         var checkeParams = []
        //                         params.forEach(item1 => {
        //                             if (item.resCode !== item1) {
        //                                 checkeParams.push(item1)
        //                             }
        //                         })

        //                         that.$refs.tree.setCheckedKeys(checkeParams)
        //                     }
        //                 })
        //             }
        //         }
        //     } else {
        //         if (checked) {
        //             if (this.defaultCheckedNodes.indexOf(data.parentCode) === -1) {
        //                 var params = this.$refs.tree.getCheckedKeys()
        //                 params.push(data.parentCode)
        //                 this.$refs.tree.setCheckedKeys(params)
        //             }
        //         } else {
        //             if (data.parentId !== null && data.parentId !== '') {
        //                 var parentNode = this.$refs.tree.getNode(data.parentCode)
        //                 if (parentNode !== null) {
        //                     var childrenNodes = parentNode.childNodes
        //                     var childrenChecked = false
        //                     childrenNodes.forEach(item => {
        //                         if (item.checked) {
        //                             childrenChecked = true
        //                         }
        //                     })
        //                     if (!childrenChecked) {
        //                         var params1 = this.$refs.tree.getCheckedKeys()
        //                         params1.splice(params1.indexOf(data.parentCode), 1)
        //                         this.$refs.tree.setCheckedKeys(params1)
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // },
        viewAttendee() {

        }
    }
}
</script>
<style lang="scss" scoped>
.widthClass {
    width: 150px;
}
</style>
