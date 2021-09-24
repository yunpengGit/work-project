<template>
    <div :style="{'height': formHeight,'overflow-x':'hidden','overflow-y':'auto'}">
        <el-scrollbar style="height:100%">
            <h3 style="margin-left:3%;width:65%;color:#191F24;height:20px"><div style="width:4px;height:16px;background-color:#1E89FF;float:left;margin-top:3px" />
                <div style="float:left;margin-left:5px">基本信息</div>
                <div style="float:right;">
                    <el-button v-if="innerFlag === 0" type="primary" @click="synForm">同步商网表单</el-button>
                    <el-checkbox v-show="false" v-model="xianshiquanbu" @change="panduanxianshi">显示全部</el-checkbox>
                </div>
            </h3>
            <el-table
                empty-text=" "
                :data="tableData1"
                style="margin-left:3%;width:65%; clear:both;margin-top:10px;"
                :row-class-name="tableRowClassName"
            >
                <el-table-column
                    prop="fieldLabel"
                    label="字段名称"
                />
                <el-table-column
                    prop="type"
                    label="校验规则"
                    width="120"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1">输入框</span>
                        <span v-if="scope.row.type === 2">多行文本</span>
                        <span v-if="scope.row.type === 3">日期框</span>
                        <span v-if="scope.row.type === 4">数值</span>
                        <span v-if="scope.row.type === 5">地址</span>
                        <span v-if="scope.row.type === 6">单选按钮</span>
                        <span v-if="scope.row.type === 7">复选框</span>
                        <span v-if="scope.row.type === 8">下拉列表</span>
                        <span v-if="scope.row.type === 9">图片</span>
                        <span v-if="scope.row.type === 10">附件</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="设置显示"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="设置必填"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.fieldCode === 'photoUrl'" type="text" @click.native.prevent="bianji0(scope)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                v-show="tableData2 !== null && tableData2.length > 0"
                id="jiben"
                empty-text=" "
                :data="tableData2"
                :show-header="false"
                style="margin-left:3%;width:65%;"
                row-key="fieldLabel"
                :row-class-name="tableRowClassName"
            >
                <el-table-column
                    prop="fieldLabel"
                    label="字段名称"
                >
                    <template slot-scope="scope">
                        {{ scope.row.fieldLabel }}
                        <span class="_48OpacityClass"><br>{{ scope.row.signExplain }} </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="校验规则"
                    width="120"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1">输入框</span>
                        <span v-if="scope.row.type === 2">多行文本</span>
                        <span v-if="scope.row.type === 3">日期框</span>
                        <span v-if="scope.row.type === 4">数值</span>
                        <span v-if="scope.row.type === 5">地址</span>
                        <span v-if="scope.row.type === 6">单选按钮</span>
                        <span v-if="scope.row.type === 7">复选框</span>
                        <span v-if="scope.row.type === 8">下拉列表</span>
                        <span v-if="scope.row.type === 9">图片</span>
                        <span v-if="scope.row.type === 10">附件</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="设置显示"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="设置必填"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click.native.prevent="bianji1(scope)">
                            编辑
                        </el-button>
                        <el-button type="text" @click.native.prevent="del1(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button :class="signUpFormDisabled ? 'tianjiahuiyizuzhiDisabledClass' : 'tianjiahuiyizuzhiClass'" :disabled="signUpFormDisabled" size="small" type="primary" style="margin-left:3%;margin-top:5px;color:#1E89FF" @click="tianjia1"><i class="el-icon-plus" />  添加字段</el-button>
            <div v-show="xingchengFlag === 1">
                <h3 v-show="xianshi2 && xianshi3 && xianshi4" style="margin-top:55px;margin-left:3%;width:65%;color:#191F24;height:20px"><div style="width:4px;height:16px;background-color:#1E89FF;float:left;margin-top:3px" /><div style="float:left;margin-left:5px">行程信息</div></h3>
                <!-- <h3 style="margin-left:3%;margin-top:55px;color:#191F24">行程信息</h3> -->
                <div v-show="xianshi2" style="margin-left:3%;margin-top:5px;color:#191F24;padding-bottom:10px;height:30px"><img src="@/assets/sinup-form.png" style="float:left;margin-top:3px;"><div style="float:left;color:#191F24;font-size:15px;margin-left:10px;color:#191F24;">会务安排</div></div>
                <el-table
                    v-show="xianshi2"
                    empty-text=" "
                    :data="tableData3"
                    style="margin-left:3%;width:65%;"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <span v-if="scope.row.type === 10">附件</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableData4 !== null && tableData4.length > 0"
                        align="center"
                        width="100"
                    />
                </el-table>
                <el-table
                    v-show="tableData4 !== null && tableData4.length > 0"
                    id="yuding"
                    empty-text=" "
                    :data="tableData4"
                    :show-header="false"
                    style="margin-left:3%;width:65%;"
                    row-key="fieldLabel"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <span v-if="scope.row.type === 10">附件</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" @click.native.prevent="bianji3(scope)">
                                编辑
                            </el-button>
                            <el-button type="text" @click.native.prevent="del3(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button v-show="xianshi2" :class="signUpFormDisabled ? 'tianjiahuiyizuzhiDisabledClass' : 'tianjiahuiyizuzhiClass'" :disabled="signUpFormDisabled" size="small" type="primary" style="margin-left:3%;margin-top:5px;color:#1E89FF" @click="tianjia3"><i class="el-icon-plus" />  添加字段</el-button>
                <div v-show="xianshi3" style="margin-left:3%;margin-top:20px;color:#191F24;padding-bottom:10px;height:30px"><img src="@/assets/sinup-form.png" style="float:left;margin-top:3px;"><div style="float:left;color:#191F24;font-size:15px;margin-left:10px;color:#191F24;">来程信息</div></div>
                <el-table
                    v-show="xianshi3"
                    empty-text=" "
                    :data="tableData5"
                    style="margin-left:3%;width:65%;"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <span v-if="scope.row.type === 10">附件</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableData6 !== null && tableData6.length > 0"
                        align="center"
                        width="100"
                    />
                </el-table>
                <el-table
                    v-show="tableData6 !== null && tableData6.length > 0"
                    id="jiezhan"
                    empty-text=" "
                    :data="tableData6"
                    :show-header="false"
                    style="margin-left:3%;width:65%;"
                    :row-class-name="tableRowClassName"
                    row-key="fieldLabel"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <span v-if="scope.row.type === 10">附件</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" @click.native.prevent="bianji5(scope)">
                                编辑
                            </el-button>
                            <el-button type="text" @click.native.prevent="del5(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button v-show="xianshi3" :disabled="signUpFormDisabled" :class="signUpFormDisabled ? 'tianjiahuiyizuzhiDisabledClass' : 'tianjiahuiyizuzhiClass'" size="small" type="primary" style="margin-left:3%;margin-top:5px;color:#1E89FF" @click="tianjia5"><i class="el-icon-plus" />  添加字段</el-button>
                <div v-show="xianshi4" style="margin-top:20px;margin-left:3%;color:#191F24;padding-bottom:10px;height:30px"><img src="@/assets/sinup-form.png" style="float:left;margin-top:3px;"><div style="float:left;color:#191F24;font-size:15px;margin-left:10px;color:#191F24;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;">返程信息</div></div>
                <el-table
                    v-show="xianshi4"
                    empty-text=" "
                    :data="tableData7"
                    style="margin-left:3%;width:65%;"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <span v-if="scope.row.type === 10">附件</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableData8 !== null && tableData8.length > 0"
                        align="center"
                        width="100"
                    />
                </el-table>
                <el-table
                    v-show="tableData8 !== null && tableData8.length > 0"
                    id="songzhan"
                    empty-text=" "
                    :data="tableData8"
                    :row-class-name="tableRowClassName"
                    :show-header="false"
                    style="margin-left:3%;width:65%;"
                    row-key="fieldLabel"
                >
                    <el-table-column
                        prop="fieldLabel"
                        label="字段名称"
                    />
                    <el-table-column
                        prop="type"
                        label="校验规则"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">输入框</span>
                            <span v-if="scope.row.type === 2">多行文本</span>
                            <span v-if="scope.row.type === 3">日期框</span>
                            <span v-if="scope.row.type === 4">数值</span>
                            <span v-if="scope.row.type === 5">地址</span>
                            <span v-if="scope.row.type === 6">单选按钮</span>
                            <span v-if="scope.row.type === 7">复选框</span>
                            <span v-if="scope.row.type === 8">下拉列表</span>
                            <span v-if="scope.row.type === 9">图片</span>
                            <!-- <span v-if="scope.row.type === 10">附件</span> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置显示"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0 || scope.row.editFlag === 2" :value="scope.row.showFlag === 1" @change="changeShow(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="设置必填"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.editFlag === 0" :value="scope.row.requireFlag === 1" @change="changeRequire(scope)" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" @click.native.prevent="bianji7(scope)">
                                编辑
                            </el-button>
                            <el-button type="text" @click.native.prevent="del7(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button v-show="xianshi4" :disabled="signUpFormDisabled" :class="signUpFormDisabled ? 'tianjiahuiyizuzhiDisabledClass' : 'tianjiahuiyizuzhiClass'" size="small" type="primary" style="margin-left:3%;margin-top:5px;color:#1E89FF" @click="tianjia7"><i class="el-icon-plus" />  添加字段</el-button>
            </div>
        </el-scrollbar>
        <el-dialog
            :title="title"
            width="37%"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeDialog"
        >
            <el-form
                ref="dynamicForm"
                :model="dynamicForm"
                :rules="dynamicRules"
                label-width="80px"
                class="demo-ruleForm"
                :style="{'height': dialogHeight,'overflow-x':'hidden','overflow-y':'auto'}"
            >
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;">
                    <el-form-item label="字段名称" prop="fieldLabel" style="margin-right: 10px;">
                        <el-input class="keepOutRight" v-model="dynamicForm.fieldLabel" maxlength="30" show-word-limit placeholder="请输入字段名称" />
                    </el-form-item>
                    <el-form-item label="是否显示" prop="showFlag" style="margin-right: 10px;">
                        <el-radio v-model="dynamicForm.showFlag" :label="1" @change="changeShowFlag">是</el-radio>
                        <el-radio v-model="dynamicForm.showFlag" :label="0" @change="changeShowFlag">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否必填" prop="requireFlag" style="margin-right: 10px;">
                        <el-radio v-model="dynamicForm.requireFlag" :label="1" @change="changeRequireFlag">是</el-radio>
                        <el-radio v-model="dynamicForm.requireFlag" :label="0" @change="changeRequireFlag">否</el-radio>
                    </el-form-item>
                    <el-form-item label="字段类型" prop="type" style="margin-right: 10px;">
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="1">输入框</el-radio>
                        <!-- <el-radio :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" v-model="dynamicForm.type" :label="2">多行文本</el-radio>
                        <el-radio :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" v-model="dynamicForm.type" :label="3">日期框</el-radio>
                        <el-radio :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" v-model="dynamicForm.type" :label="4">数值</el-radio>
                        <el-radio :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" v-model="dynamicForm.type" :label="5">地址</el-radio> -->
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="6">单选框</el-radio>
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="7">复选框</el-radio>
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="8">下拉列表</el-radio>
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="9">图片</el-radio>
                        <el-radio v-model="dynamicForm.type" :disabled="dynamicForm.id !== undefined && dynamicForm.id !== null" :label="10">附件</el-radio>
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 1" :required="dynamicForm.type === 1" label="字段长度" prop="maxLength" style="margin-right: 10px;">
                        <el-input v-model="dynamicForm.maxLength" maxlength="2" show-word-limit placeholder="请输入字段长度" />
                    </el-form-item>
                    <div v-for="(signFormOption, index) in dynamicForm.signFormOptions" v-show="dynamicForm.type === 6 || dynamicForm.type === 7 || dynamicForm.type === 8" :key="'signFormOption' + index" style="margin-right: 10px;">
                        <el-form-item
                            v-if="index === 0"
                            label="选项"
                            :prop="'signFormOptions.' + index + '.optionText'"
                            :rules="[
                                { required: true, message: '请输入选项值', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                v-model="signFormOption.optionText"
                                show-word-limit
                                class="keepOutRight"
                                maxlength="20"
                                placeholder="选项"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeSignFormOption(index)" />
                        </el-form-item>
                        <el-form-item
                            v-else
                            style="margin-right: 10px;"
                            :prop="'signFormOptions.' + index + '.optionText'"
                            :rules="[
                                { required: true, message: '请输入选项值', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                v-model="signFormOption.optionText"
                                class="keepOutRight"
                                show-word-limit
                                maxlength="20"
                                placeholder="选项"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeSignFormOption(index)" />
                        </el-form-item>
                    </div>
                    <el-form-item v-show="(dynamicForm.type === 6 || dynamicForm.type === 7 || dynamicForm.type === 8) && !(dynamicForm.signFormOptions !== undefined && dynamicForm.signFormOptions !== null && dynamicForm.signFormOptions.length === 10)" style="margin-right: 10px;" :label="dynamicForm.signFormOptions === null || dynamicForm.signFormOptions.length === 0 ? '选项': ''" prop="signFormOptions" :inline-message="true">
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiaSignFormOption"><i class="el-icon-plus" />  添加选项</el-button>
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9 || dynamicForm.type === 10" style="margin-right: 10px;" :required="dynamicForm.type === 9 || dynamicForm.type === 10" label="个数限制" prop="uploadCount">
                        <el-input v-model="dynamicForm.uploadCount" :disabled="dynamicForm.fieldCode === 'photoUrl'" maxlength="3" show-word-limit placeholder="请输入个数限制" />
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9 || dynamicForm.type === 10" style="margin-right: 10px;" :required="dynamicForm.type === 9 || dynamicForm.type === 10" label="大小限制" prop="maxVal">
                        <el-input v-model="dynamicForm.maxVal" maxlength="2" show-word-limit placeholder="请输入大小限制">
                            <template slot="append">M</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9" style="margin-right: 10px;" label="最大高度" prop="picMaxHeight">
                        <el-input v-model="dynamicForm.picMaxHeight" maxlength="10" show-word-limit placeholder="请输入最大高度" />
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9" style="margin-right: 10px;" label="最小高度" prop="picMinHeight">
                        <el-input v-model="dynamicForm.picMinHeight" maxlength="10" show-word-limit placeholder="请输入最小高度" />
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9" style="margin-right: 10px;" label="最大宽度" prop="picMaxWidth">
                        <el-input v-model="dynamicForm.picMaxWidth" maxlength="10" show-word-limit placeholder="请输入最大宽度" />
                    </el-form-item>
                    <el-form-item v-show="dynamicForm.type === 9" style="margin-right: 10px;" label="最小宽度" prop="picMinWidth">
                        <el-input v-model="dynamicForm.picMinWidth" maxlength="10" show-word-limit placeholder="请输入最小宽度" />
                    </el-form-item>

                    <div v-for="(accept, index) in dynamicForm.accept" v-show="dynamicForm.type === 9 || dynamicForm.type === 10" :key="'accept' + index" style="margin-right: 10px;">
                        <el-form-item
                            v-if="index === 0"
                            label="文件格式"
                            :prop="'accept.' + index + '.name'"
                            :rules="[
                                { required: true, message: '请输入文件格式', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                v-model="accept.name"
                                show-word-limit
                                class="keepOutRight"
                                maxlength="20"
                                placeholder="文件格式"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeAccept(index)" />
                        </el-form-item>
                        <el-form-item
                            v-else
                            :prop="'accept.' + index + '.name'"
                            :rules="[
                                { required: true, message: '请输入文件格式', trigger: 'blur' },
                            ]"
                        >
                            <el-input
                                v-model="accept.name"
                                show-word-limit
                                class="keepOutRight"
                                maxlength="20"
                                placeholder="文件格式"
                                style="width:50%"
                            />
                            <el-button icon="el-icon-delete" style="margin-left:5px;" @click.prevent="removeAccept(index)" />
                        </el-form-item>
                    </div>
                    <el-form-item v-show="(dynamicForm.type === 9 || dynamicForm.type === 10) && !(dynamicForm.accept !== undefined && dynamicForm.accept !== null && dynamicForm.accept.length === 10)" style="margin-right: 10px;" :label="dynamicForm.accept === null || dynamicForm.accept.length === 0 ? '文件格式': ''" prop="accept" :inline-message="true">
                        <el-button class="tianjiahuiyizuzhiClass" size="small" type="primary" style="margin-top:5px;color:#1E89FF" @click="tianjiaAccept"><i class="el-icon-plus" />  添加选项</el-button>
                    </el-form-item>
                    <el-form-item style="margin-right: 10px;" label="提示语">
                        <el-input class="keepOutRight" v-model="dynamicForm.titleMsessage" maxlength="25" show-word-limit placeholder="请输入提示语" />
                    </el-form-item>
                </el-scrollbar>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="baocun">保存</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Sortable from 'sortablejs'
import { getTableHeight, getUuid, isRepeat } from '@/utils/index'
export default {
    name: 'SignupForm',
    props: {
        signUpFormDisabled: {
            type: Boolean,
            default: false
        },
        tableList: {
            type: Array,
            default: null
        },
        xingchengFlag: {
            type: Number,
            default: 1
        },
        conferenceId: {
            type: null,
            default: null
        },
        innerFlag: {
            type: null,
            default: null
        }
    },
    data() {
        var validatePass1 = (rule, value, callback) => {
            if (this.dynamicForm.type === 1) {
                if (value === null || value === '') {
                    callback(new Error('字段长度不能为空'))
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else if (value.length > 2) {
                        callback(new Error('请输入2位有效数字'))
                    } else {
                        callback()
                    }
                }
            } else {
                callback()
            }
        }
        var validatePass9 = (rule, value, callback) => {
            if (this.dynamicForm.type === 9 || this.dynamicForm.type === 10) {
                if (value === null || value === '') {
                    callback(new Error('个数限制不能为空'))
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        callback()
                    }
                }
            } else {
                callback()
            }
        }
        var picMaxHeightPass = (rule, value, callback) => {
            if (this.dynamicForm.type === 9) {
                if (value === null || value === '') {
                    callback()
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        if (this.dynamicForm.picMinHeight !== null && this.dynamicForm.picMinHeight !== '' && parseInt(value) < parseInt(this.dynamicForm.picMinHeight)) {
                            callback(new Error('不得小于最小高度'))
                        } else {
                            callback()
                        }
                    }
                }
            } else {
                callback()
            }
        }
        var picMinHeightPass = (rule, value, callback) => {
            if (this.dynamicForm.type === 9) {
                if (value === null || value === '') {
                    callback()
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        if (this.dynamicForm.picMaxHeight !== null && this.dynamicForm.picMaxHeight !== '' && parseInt(value) > parseInt(this.dynamicForm.picMaxHeight)) {
                            callback(new Error('不得大于最大高度'))
                        } else {
                            callback()
                        }
                    }
                }
            } else {
                callback()
            }
        }
        var picMaxWidthPass = (rule, value, callback) => {
            if (this.dynamicForm.type === 9) {
                if (value === null || value === '') {
                    callback()
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        if (this.dynamicForm.picMinWidth !== null && this.dynamicForm.picMinWidth !== '' && parseInt(value) < parseInt(this.dynamicForm.picMinWidth)) {
                            callback(new Error('不得小于最小宽度'))
                        } else {
                            callback()
                        }
                    }
                }
            } else {
                callback()
            }
        }
        var picMinWidthPass = (rule, value, callback) => {
            if (this.dynamicForm.type === 9) {
                if (value === null || value === '') {
                    callback()
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else {
                        if (this.dynamicForm.picMaxWidth !== null && this.dynamicForm.picMaxWidth !== '' && parseInt(value) > parseInt(this.dynamicForm.picMaxWidth)) {
                            callback(new Error('不得大于最大宽度'))
                        } else {
                            callback()
                        }
                    }
                }
            } else {
                callback()
            }
        }
        var validatePass678 = (rule, value, callback) => {
            if (this.dynamicForm.type === 6 || this.dynamicForm.type === 7 || this.dynamicForm.type === 8) {
                if (this.dynamicForm.signFormOptions === null || this.dynamicForm.signFormOptions.length === 0) {
                    callback(new Error('请输入选项'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        var maxValValidatePass910 = (rule, value, callback) => {
            if (this.dynamicForm.type === 9 || this.dynamicForm.type === 10) {
                if (value === null || value === '') {
                    callback(new Error('请输入文件大小限制'))
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字'))
                    } else if (!(/^(([1-9]{1}\d*)|(0{1}))?$/.test(value))) {
                        callback(new Error('请输入整数'))
                    } else if (value > 50) {
                        callback(new Error('文件大小限制不得超过50M'))
                    } else {
                        callback()
                    }
                }
            } else {
                callback()
            }
        }
        return {
            // dialogHeight: getTableHeight(window.innerHeight * 0.25) + 'px',
            dialogHeight: 350 + 'px',
            bianjiFlag: false,
            title: '',
            currentIndex: null,
            currentDataIndex: null,
            xianshi2: true,
            xianshi3: true,
            xianshi4: true,
            xianshiquanbu: true,
            dynamicForm: {
                uuid: null,
                fieldCode: null,
                id: null,
                fieldLabel: null,
                showFlag: 1,
                requireFlag: 0,
                type: 1,
                ruleId: null,
                maxLength: null,
                uploadCount: null,
                titleMsessage: null,
                signFormOptions: [],
                maxVal: null,
                picMaxHeight: null,
                picMinHeight: null,
                picMaxWidth: null,
                picMinWidth: null,
                accept: []
            },
            dynamicRules: {
                fieldLabel: [{ required: true, message: '请输入字段名称', pattern: '[^ \x22]+', trigger: 'blur' }],
                maxLength: [{ validator: validatePass1, trigger: ['blur', 'change'] }],
                uploadCount: [{ validator: validatePass9, trigger: ['blur', 'change'] }],
                picMaxHeight: [{ validator: picMaxHeightPass, trigger: ['blur', 'change'] }],
                picMinHeight: [{ validator: picMinHeightPass, trigger: ['blur', 'change'] }],
                picMaxWidth: [{ validator: picMaxWidthPass, trigger: ['blur', 'change'] }],
                picMinWidth: [{ validator: picMinWidthPass, trigger: ['blur', 'change'] }],
                maxVal: [{ validator: maxValValidatePass910, trigger: ['blur', 'change'] }],
                signFormOptions: [{ validator: validatePass678, trigger: 'change' }]
            },
            loading: false,
            dialogVisible: false,
            formHeight: getTableHeight(125) + 'px',
            tableData1: [],
            tableData2: [],
            tableData3: [],
            tableData4: [],
            tableData5: [],
            tableData6: [],
            tableData7: [],
            tableData8: [],
            tableData: []
        }
    },
    watch: {
        'dynamicForm.type': {
            handler() {
                if (this.dynamicForm.maxVal === null || this.dynamicForm.maxVal === '') {
                    this.dynamicForm.maxVal = '10'
                }
            },
            deep: true
        },
        tableList(val) {
            this.tableData1 = []
            this.tableData2 = []
            this.tableData3 = []
            this.tableData4 = []
            this.tableData5 = []
            this.tableData6 = []
            this.tableData7 = []
            this.tableData8 = []
            if (val !== null) {
                val.forEach(item => {
                    item.signFormFieldRulePO = item.signFormFieldRuleVO
                    if (item.groupId === 1) {
                        if (item.initFlag === 1) {
                            if (item.fieldCode === 'honourId') {
                                this.tableData.push(item)
                            } else {
                                this.tableData1.push(item)
                            }
                        } else {
                            this.tableData2.push(item)
                        }
                    } else if (item.groupId === 2) {
                        if (item.initFlag === 1) {
                            this.tableData3.push(item)
                        } else {
                            this.tableData4.push(item)
                        }
                    } else if (item.groupId === 3) {
                        if (item.initFlag === 1) {
                            this.tableData5.push(item)
                        } else {
                            this.tableData6.push(item)
                        }
                    } else if (item.groupId === 4) {
                        if (item.initFlag === 1) {
                            this.tableData7.push(item)
                        } else {
                            this.tableData8.push(item)
                        }
                    }
                })
                this.panduanxianshi()
            }
        }
    },
    mounted() {
        // 阻止默认行为
        document.body.ondrop = function(event) {
            event.preventDefault()
            event.stopPropagation()
        }
        this.rowDrop()
    },
    created() {
        if (this.$route.name === 'conferenceCreate') {
            this.formHeight = getTableHeight(85) + 'px'
        } else {
            this.formHeight = getTableHeight(125) + 'px'
        }
    },
    methods: {
        synForm() {
            this.$emit('synForm')
        },
        tianjiaSignFormOption() {
            this.$refs.dynamicForm.clearValidate('signFormOptions')
            this.dynamicForm.signFormOptions.push({
                id: null,
                signFormConfigId: null,
                optionValue: null,
                optionText: null
            })
        },
        removeSignFormOption(index) {
            this.dynamicForm.signFormOptions.splice(index, 1)
        },
        tianjiaAccept() {
            this.$refs.dynamicForm.clearValidate('accept')
            this.dynamicForm.accept.push({
                name: null
            })
        },
        removeAccept(index) {
            this.dynamicForm.accept.splice(index, 1)
        },
        panduanxianshi() {
            if (this.xianshiquanbu) {
                this.xianshi2 = true
                this.xianshi3 = true
                this.xianshi4 = true
            } else {
                this.xianshi2 = true
                this.xianshi3 = true
                this.xianshi4 = true
                // if (this.getTableData34().some(item => item.showFlag === 1)) {
                //     this.xianshi2 = true
                // } else {
                //     this.xianshi2 = false
                // }

                // if (this.getTableData56().some(item => item.showFlag === 1)) {
                //     this.xianshi3 = true
                // } else {
                //     this.xianshi3 = false
                // }

                // if (this.getTableData78().some(item => item.showFlag === 1)) {
                //     this.xianshi4 = true
                // } else {
                //     this.xianshi4 = false
                // }
            }
        },
        tableRowClassName({ row, index }) {
            if (row.showFlag === 0 && !this.xianshiquanbu && row.initFlag !== 1) {
                return 'hidden-row'
            }
            return ''
        },
        changeShowFlag() {
            if (this.dynamicForm.showFlag === 0) {
                this.dynamicForm.requireFlag = 0
            }
        },
        changeRequireFlag() {
            if (this.dynamicForm.requireFlag === 1) {
                this.dynamicForm.showFlag = 1
            }
        },
        baocun() {
            this.$refs['dynamicForm'].validate(valid => {
                if (valid) {
                    var tempData = null
                    if (this.dynamicForm.id !== undefined && this.dynamicForm.id !== null && this.dynamicForm.id !== '') {
                        tempData = {
                            uuid: this.dynamicForm.uuid,
                            conferenceId: this.conferenceId,
                            innerFlag: this.innerFlag,
                            fieldCode: this.dynamicForm.fieldCode,
                            type: this.dynamicForm.type,
                            fieldLabel: this.dynamicForm.fieldLabel,
                            seq: 0,
                            editFlag: 1,
                            showFlag: this.dynamicForm.showFlag,
                            requireFlag: this.dynamicForm.requireFlag,
                            groupId: this.dynamicForm.groupId,
                            conferenceGroupFlag: null,
                            signFormFieldRuleVO: {
                                id: this.dynamicForm.ruleId,
                                titleMsessage: this.dynamicForm.titleMsessage
                            },
                            signFormOptionVOs: null
                        }
                    } else {
                        tempData = {
                            conferenceId: this.conferenceId,
                            innerFlag: this.innerFlag,
                            fieldLabel: this.dynamicForm.fieldLabel,
                            seq: 0,
                            editFlag: 1,
                            type: this.dynamicForm.type,
                            showFlag: this.dynamicForm.showFlag,
                            requireFlag: this.dynamicForm.requireFlag,
                            conferenceGroupFlag: null,
                            groupId: this.dynamicForm.groupId,
                            signFormFieldRuleVO: {
                                titleMsessage: this.dynamicForm.titleMsessage
                            },
                            signFormOptionVOs: null
                        }
                    }

                    if (this.dynamicForm.type === 1) {
                        tempData.signFormFieldRuleVO.maxLength = this.dynamicForm.maxLength
                    } else if (this.dynamicForm.type === 9 || this.dynamicForm.type === 10) {
                        if (this.dynamicForm.type === 9) {
                            tempData.signFormFieldRuleVO.picMaxHeight = this.dynamicForm.picMaxHeight
                            tempData.signFormFieldRuleVO.picMinHeight = this.dynamicForm.picMinHeight
                            tempData.signFormFieldRuleVO.picMaxWidth = this.dynamicForm.picMaxWidth
                            tempData.signFormFieldRuleVO.picMinWidth = this.dynamicForm.picMinWidth
                        }
                        if (this.dynamicForm.accept !== null && this.dynamicForm.accept.length > 0) {
                            var acceptText = ''
                            this.dynamicForm.accept.forEach((item, index) => {
                                if (index !== this.dynamicForm.accept.length - 1) {
                                    acceptText += item.name + ','
                                } else {
                                    acceptText += item.name
                                }
                            })
                            tempData.signFormFieldRuleVO.accept = acceptText
                        } else {
                            tempData.signFormFieldRuleVO.accept = ''
                        }
                        tempData.signFormFieldRuleVO.uploadCount = this.dynamicForm.uploadCount
                        tempData.signFormFieldRuleVO.maxVal = this.dynamicForm.maxVal
                    } else if (this.dynamicForm.type === 6 || this.dynamicForm.type === 7 || this.dynamicForm.type === 8) {
                        var optionTextsTemp = []
                        this.dynamicForm.signFormOptions.forEach((item, index) => {
                            item.optionValue = (index + 1)
                            optionTextsTemp.push(item.optionText)
                        })

                        if (isRepeat(optionTextsTemp)) {
                            this.$message('选项不允许重复')
                            return
                        }

                        tempData.signFormOptionVOs = this.dynamicForm.signFormOptions
                    }

                    if (tempData.fieldCode === 'photoUrl') {
                        tempData.initFlag = 1
                    }

                    tempData.signFormFieldRulePO = tempData.signFormFieldRuleVO
                    if (this.bianjiFlag) {
                        tempData.id = this.dynamicForm.id !== undefined && this.dynamicForm.id !== null && this.dynamicForm.id !== '' && this.dynamicForm.id !== 'undefined' ? this.dynamicForm.id : ''
                        if (this.currentDataIndex === 1) {
                            if (this.tableData1 !== null && this.tableData1.find(item => item.fieldLabel === this.dynamicForm.fieldLabel && ((item.id !== null && item.id !== undefined && item.id !== '') ? this.dynamicForm.id !== item.id : item.uuid !== this.dynamicForm.uuid)) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData1.splice(this.currentIndex, 1, JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.currentDataIndex === 2) {
                            if (this.tableData2 !== null && this.tableData2.find(item => item.fieldLabel === this.dynamicForm.fieldLabel && ((item.id !== null && item.id !== undefined && item.id !== '') ? this.dynamicForm.id !== item.id : item.uuid !== this.dynamicForm.uuid)) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData2.splice(this.currentIndex, 1, JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.currentDataIndex === 4) {
                            if (this.tableData4 !== null && this.tableData4.find(item => item.fieldLabel === this.dynamicForm.fieldLabel && ((item.id !== null && item.id !== undefined && item.id !== '') ? this.dynamicForm.id !== item.id : item.uuid !== this.dynamicForm.uuid)) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData4.splice(this.currentIndex, 1, JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.currentDataIndex === 6) {
                            if (this.tableData6 !== null && this.tableData6.find(item => item.fieldLabel === this.dynamicForm.fieldLabel && ((item.id !== null && item.id !== undefined && item.id !== '') ? this.dynamicForm.id !== item.id : item.uuid !== this.dynamicForm.uuid)) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData6.splice(this.currentIndex, 1, JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.currentDataIndex === 8) {
                            if (this.tableData8 !== null && this.tableData8.find(item => item.fieldLabel === this.dynamicForm.fieldLabel && ((item.id !== null && item.id !== undefined && item.id !== '') ? this.dynamicForm.id !== item.id : item.uuid !== this.dynamicForm.uuid)) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData8.splice(this.currentIndex, 1, JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        }
                    } else {
                        tempData.uuid = getUuid()
                        if (this.dynamicForm.groupId === 1) {
                            if (this.tableData2 === null) {
                                this.tableData2 = []
                            }
                            if (this.tableData2.find(item => item.fieldLabel === this.dynamicForm.fieldLabel) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData2.push(JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.dynamicForm.groupId === 2) {
                            if (this.tableData4 === null) {
                                this.tableData4 = []
                            }

                            if (this.tableData4.find(item => item.fieldLabel === this.dynamicForm.fieldLabel) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData4.push(JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.dynamicForm.groupId === 3) {
                            if (this.tableData6 === null) {
                                this.tableData6 = []
                            }

                            if (this.tableData6.find(item => item.fieldLabel === this.dynamicForm.fieldLabel) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData6.push(JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }
                        } else if (this.dynamicForm.groupId === 4) {
                            if (this.tableData8 === null) {
                                this.tableData8 = []
                            }

                            if (this.tableData8.find(item => item.fieldLabel === this.dynamicForm.fieldLabel) !== undefined) {
                                this.$message('已存在该字段名')
                            } else {
                                this.tableData8.push(JSON.parse(JSON.stringify(tempData)))
                                this.closeDialog()
                            }

                        // this.tableData8.push(tempData)
                        }
                    }
                    this.bianjiFlag = false
                }
            })
        },
        closeDialog() {
            this.dynamicForm = {
                uuid: null,
                maxVal: null,
                ruleId: null,
                id: null,
                fieldLabel: null,
                showFlag: 1,
                requireFlag: 0,
                type: 1,
                maxLength: null,
                uploadCount: null,
                titleMsessage: null,
                signFormOptions: [],
                picMaxHeight: null,
                picMinHeight: null,
                picMaxWidth: null,
                picMinWidth: null,
                accept: []
            }
            this.bianjiFlag = false
            this.dialogVisible = false
            this.$refs['dynamicForm'].resetFields()
        },
        tianjia1() {
            this.dynamicForm.groupId = 1
            this.tianjia()
        },
        editBefore(val) {
            if (val.haveData) {
            // 如果存在数据，进行二次弹窗提示
                this.$confirm('编辑' + val.fieldLabel + '会导致已收集报名信息丢失，请确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.bianji(val)
                }).catch(() => {})
            } else {
                this.bianji(val)
            }
        },
        bianji(val) {
            this.bianjiFlag = true
            this.title = '编辑字段'
            this.dialogVisible = true

            if (val.signFormFieldRulePO === undefined || val.signFormFieldRulePO === null) {
                val.signFormFieldRulePO = val.signFormFieldRuleVO
            }

            var acceptNameTemp = []

            if (val.signFormFieldRulePO !== null) {
                var acceptTemp = val.signFormFieldRulePO.accept !== undefined && val.signFormFieldRulePO.accept !== null && val.signFormFieldRulePO.accept.length > 0 ? val.signFormFieldRulePO.accept.split(',') : []

                acceptTemp.forEach(item => {
                    acceptNameTemp.push(
                        { 'name': item }
                    )
                })
                this.dynamicForm = {
                    groupId: val.groupId,
                    uuid: val.id !== undefined && val.id !== null && val.id !== '' ? val.id : val.uuid,
                    fieldCode: val.fieldCode,
                    maxVal: val.signFormFieldRulePO.maxVal,
                    ruleId: val.signFormFieldRulePO.id,
                    id: val.id,
                    fieldLabel: val.fieldLabel,
                    showFlag: val.showFlag,
                    requireFlag: val.requireFlag,
                    type: val.type,
                    maxLength: val.signFormFieldRulePO.maxLength,
                    uploadCount: val.signFormFieldRulePO.uploadCount,
                    titleMsessage: val.signFormFieldRulePO.titleMsessage,
                    signFormOptions: val.signFormOptionVOs,
                    picMaxHeight: val.signFormFieldRulePO.picMaxHeight,
                    picMinHeight: val.signFormFieldRulePO.picMinHeight,
                    picMaxWidth: val.signFormFieldRulePO.picMaxWidth,
                    picMinWidth: val.signFormFieldRulePO.picMinWidth,
                    accept: acceptNameTemp
                }
            } else {
                this.dynamicForm = {
                    groupId: val.groupId,
                    uuid: val.id !== undefined && val.id !== null && val.id !== '' ? val.id : val.uuid,
                    fieldCode: val.fieldCode,
                    maxVal: null,
                    ruleId: null,
                    id: val.id,
                    fieldLabel: val.fieldLabel,
                    showFlag: val.showFlag,
                    requireFlag: val.requireFlag,
                    type: val.type,
                    maxLength: null,
                    uploadCount: null,
                    titleMsessage: null,
                    signFormOptions: val.signFormOptionVOs,
                    picMaxHeight: null,
                    picMinHeight: null,
                    picMaxWidth: null,
                    picMinWidth: null,
                    accept: acceptNameTemp
                }
            }
        },
        bianji0(val) {
            this.currentIndex = val.$index
            this.currentDataIndex = 1
            this.editBefore(val.row)
        },
        bianji1(val) {
            this.currentIndex = val.$index
            this.currentDataIndex = 2
            this.editBefore(val.row)
        },
        bianji3(val) {
            this.currentIndex = val.$index
            this.currentDataIndex = 4
            this.editBefore(val.row)
        },
        bianji5(val) {
            this.currentIndex = val.$index
            this.currentDataIndex = 6
            this.editBefore(val.row)
        },
        bianji7(val) {
            this.currentIndex = val.$index
            this.currentDataIndex = 8
            this.editBefore(val.row)
        },
        del1(val) {
            if (val.haveData) {
            // 如果存在数据，进行二次弹窗提示
                this.$confirm('删除' + val.fieldLabel + '会导致已收集报名信息丢失，请确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData2.splice(this.tableData2.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            } else {
                this.$confirm('请确认是否删除' + val.fieldLabel + '？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData2.splice(this.tableData2.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            }
        },
        tianjia3() {
            this.dynamicForm.groupId = 2
            this.tianjia()
        },
        tianjia() {
            this.title = '添加字段'
            this.dialogVisible = true
            this.dynamicForm.uuid = null
            this.dynamicForm.id = null
        },
        del3(val) {
            if (val.haveData) {
            // 如果存在数据，进行二次弹窗提示
                this.$confirm('删除' + val.fieldLabel + '会导致已收集报名信息丢失，请确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData4.splice(this.tableData4.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            } else {
                this.$confirm('请确认是否删除' + val.fieldLabel + '？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData4.splice(this.tableData4.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            }
        },
        tianjia5() {
            this.dynamicForm.groupId = 3
            this.tianjia()
        },
        del5(val) {
            if (val.haveData) {
            // 如果存在数据，进行二次弹窗提示
                this.$confirm('删除' + val.fieldLabel + '会导致已收集报名信息丢失，请确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData6.splice(this.tableData6.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            } else {
                this.$confirm('请确认是否删除' + val.fieldLabel + '？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData6.splice(this.tableData6.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            }
        },
        tianjia7() {
            this.dynamicForm.groupId = 4
            this.tianjia()
        },
        del7(val) {
            if (val.haveData) {
            // 如果存在数据，进行二次弹窗提示
                this.$confirm('删除' + val.fieldLabel + '会导致已收集报名信息丢失，请确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData8.splice(this.tableData8.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            } else {
                this.$confirm('请确认是否删除' + val.fieldLabel + '？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData8.splice(this.tableData8.findIndex(item => item.fieldLabel === val.fieldLabel), 1)
                }).catch(() => {})
            }
        },
        getTableData4() {
            let tableDataTemp = []
            if (this.tableData3 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData3)
            }
            if (this.tableData4 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData4)
            }
            if (this.tableData5 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData5)
            }
            if (this.tableData6 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData6)
            }
            if (this.tableData7 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData7)
            }
            if (this.tableData8 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData8)
            }
            return tableDataTemp
        },

        getTableData34() {
            let tableDataTemp = []
            if (this.tableData3 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData3)
            }
            if (this.tableData4 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData4)
            }
            return tableDataTemp
        },

        getTableData56() {
            let tableDataTemp = []
            if (this.tableData5 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData5)
            }
            if (this.tableData6 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData6)
            }
            return tableDataTemp
        },

        getTableData78() {
            let tableDataTemp = []
            if (this.tableData7 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData7)
            }
            if (this.tableData8 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData8)
            }
            return tableDataTemp
        },

        getTableData() {
            let tableDataTemp = []
            if (this.tableData !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData)
            }
            if (this.tableData1 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData1)
            }
            if (this.tableData2 !== null) {
                this.tableData2.forEach((item, index) => {
                    item.seq = index
                })
                tableDataTemp = tableDataTemp.concat(this.tableData2)
            }
            if (this.tableData3 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData3)
            }
            if (this.tableData4 !== null) {
                this.tableData4.forEach((item, index) => {
                    item.seq = index
                })
                tableDataTemp = tableDataTemp.concat(this.tableData4)
            }
            if (this.tableData5 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData5)
            }
            if (this.tableData6 !== null) {
                this.tableData6.forEach((item, index) => {
                    item.seq = index
                })
                tableDataTemp = tableDataTemp.concat(this.tableData6)
            }
            if (this.tableData7 !== null) {
                tableDataTemp = tableDataTemp.concat(this.tableData7)
            }
            if (this.tableData8 !== null) {
                this.tableData8.forEach((item, index) => {
                    item.seq = index
                })
                tableDataTemp = tableDataTemp.concat(this.tableData8)
            }
            return tableDataTemp
        },
        changeShow(val) {
            if (val.row.groupId === 1) {
                if (val.row.initFlag === 1) {
                    this.tableData1[val.$index].showFlag = this.tableData1[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData1[val.$index].requireFlag = this.tableData1[val.$index].showFlag === 0 ? 0 : this.tableData1[val.$index].requireFlag
                } else {
                    this.tableData2[val.$index].showFlag = this.tableData2[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData2[val.$index].requireFlag = this.tableData2[val.$index].showFlag === 0 ? 0 : this.tableData2[val.$index].requireFlag
                }
            } else if (val.row.groupId === 2) {
                if (val.row.initFlag === 1) {
                    this.tableData3[val.$index].showFlag = this.tableData3[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData3[val.$index].requireFlag = this.tableData3[val.$index].showFlag === 0 ? 0 : this.tableData3[val.$index].requireFlag
                } else {
                    this.tableData4[val.$index].showFlag = this.tableData4[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData4[val.$index].requireFlag = this.tableData4[val.$index].showFlag === 0 ? 0 : this.tableData4[val.$index].requireFlag
                }
            } else if (val.row.groupId === 3) {
                if (val.row.initFlag === 1) {
                    this.tableData5[val.$index].showFlag = this.tableData5[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData5[val.$index].requireFlag = this.tableData5[val.$index].showFlag === 0 ? 0 : this.tableData5[val.$index].requireFlag
                } else {
                    this.tableData6[val.$index].showFlag = this.tableData6[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData6[val.$index].requireFlag = this.tableData6[val.$index].showFlag === 0 ? 0 : this.tableData6[val.$index].requireFlag
                }
            } else if (val.row.groupId === 4) {
                if (val.row.initFlag === 1) {
                    this.tableData7[val.$index].showFlag = this.tableData7[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData7[val.$index].requireFlag = this.tableData7[val.$index].showFlag === 0 ? 0 : this.tableData7[val.$index].requireFlag
                } else {
                    this.tableData8[val.$index].showFlag = this.tableData8[val.$index].showFlag === 1 ? 0 : 1
                    this.tableData8[val.$index].requireFlag = this.tableData8[val.$index].showFlag === 0 ? 0 : this.tableData8[val.$index].requireFlag
                }
            }
            this.panduanxianshi()
        },
        changeRequire(val) {
            if (val.row.groupId === 1) {
                if (val.row.initFlag === 1) {
                    this.tableData1[val.$index].requireFlag = this.tableData1[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData1[val.$index].showFlag = this.tableData1[val.$index].requireFlag === 1 ? 1 : this.tableData1[val.$index].showFlag
                } else {
                    this.tableData2[val.$index].requireFlag = this.tableData2[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData2[val.$index].showFlag = this.tableData2[val.$index].requireFlag === 1 ? 1 : this.tableData2[val.$index].showFlag
                }
            } else if (val.row.groupId === 2) {
                if (val.row.initFlag === 1) {
                    this.tableData3[val.$index].requireFlag = this.tableData3[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData3[val.$index].showFlag = this.tableData3[val.$index].requireFlag === 1 ? 1 : this.tableData3[val.$index].showFlag
                } else {
                    this.tableData4[val.$index].requireFlag = this.tableData4[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData4[val.$index].showFlag = this.tableData4[val.$index].requireFlag === 1 ? 1 : this.tableData4[val.$index].showFlag
                }
            } else if (val.row.groupId === 3) {
                if (val.row.initFlag === 1) {
                    this.tableData5[val.$index].requireFlag = this.tableData5[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData5[val.$index].showFlag = this.tableData5[val.$index].requireFlag === 1 ? 1 : this.tableData5[val.$index].showFlag
                } else {
                    this.tableData6[val.$index].requireFlag = this.tableData6[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData6[val.$index].showFlag = this.tableData6[val.$index].requireFlag === 1 ? 1 : this.tableData6[val.$index].showFlag
                }
            } else if (val.row.groupId === 4) {
                if (val.row.initFlag === 1) {
                    this.tableData7[val.$index].requireFlag = this.tableData7[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData7[val.$index].showFlag = this.tableData7[val.$index].requireFlag === 1 ? 1 : this.tableData7[val.$index].showFlag
                } else {
                    this.tableData8[val.$index].requireFlag = this.tableData8[val.$index].requireFlag === 1 ? 0 : 1
                    this.tableData8[val.$index].showFlag = this.tableData8[val.$index].requireFlag === 1 ? 1 : this.tableData8[val.$index].showFlag
                }
            }
        },
        // 行拖拽
        rowDrop() {
            const tbody = document.querySelector('#jiben .el-table__body-wrapper tbody')
            const _this = this
            Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.tableData2.splice(oldIndex, 1)[0]
                    _this.tableData2.splice(newIndex, 0, currRow)
                    console.log(JSON.stringify(_this.tableData2))
                }
            })

            // const tbody3 = document.querySelector('#yuding .el-table__body-wrapper tbody')
            // Sortable.create(tbody3, {
            //     onEnd({ newIndex, oldIndex }) {
            //         const currRow = _this.tableData4.splice(oldIndex, 1)[0]
            //         _this.tableData4.splice(newIndex, 0, currRow)
            //     }
            // })

            // const tbody5 = document.querySelector('#jiezhan .el-table__body-wrapper tbody')
            // Sortable.create(tbody5, {
            //     onEnd({ newIndex, oldIndex }) {
            //         const currRow = _this.tableData6.splice(oldIndex, 1)[0]
            //         _this.tableData6.splice(newIndex, 0, currRow)
            //     }
            // })

            // const tbody7 = document.querySelector('#songzhan .el-table__body-wrapper tbody')
            // Sortable.create(tbody7, {
            //     onEnd({ newIndex, oldIndex }) {
            //         const currRow = _this.tableData8.splice(oldIndex, 1)[0]
            //         _this.tableData8.splice(newIndex, 0, currRow)
            //     }
            // })
        }
    }
}
</script>
<style lang="scss" scoped>
.width360{
        width:360px;
}

._48OpacityClass {
    width: 343px;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.48);
    line-height: 16px;
}
.tianjiahuiyizuzhiDisabledClass {
        width: 114px!important;
        height: 32px!important;
        background: #F5F5F5!important;
        border-radius: 4px!important;
        border: 1px solid #F5F5F5!important;
    }
.tianjiahuiyizuzhiClass {
        width: 114px!important;
        height: 32px!important;
        background: #FFFFFF!important;
        border-radius: 4px!important;
        border: 1px solid #1E89FF!important;
    }
  .el-table .hidden-row {
    display: none;
  }
</style>
<style lang="scss">
  .el-table .hidden-row {
    display: none;
  }
</style>
