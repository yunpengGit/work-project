<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-14 13:06:58
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-16 09:58:27
-->
<template>
    <div class="tags-container">
        <el-form-item label="适用人群" style="width:80%">
            <div v-for="(ele, index) in applicablePeopleTypes" :key="index" class="tags-choice">
                <el-select v-model="ele.typeValue" placeholder="请选择" class="type-choice" @change="typeChoice(index)" @visible-change="visibleChangeType($event,index)">
                    <el-option v-for="item in typeOptions" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value" />
                </el-select>
                <div v-if="ele.typeValue === 1" class="choice-detail">
                    <el-input v-model="ele.inputValue" placeholder="请输入职务" class="type-choice-item" :class="ele.warning ? 'tags-choice-checked' : ''" @blur="inputBlur(index)" />
                    <div v-if="ele.warning" class="tips">请输入职务</div>
                </div>
                <div v-else class="choice-detail">
                    <el-select v-model="ele.tagsValue" placeholder="请选择标签" class="type-choice-item" :class="ele.warning ? 'tags-choice-checked' : ''" @change="selectChange(index, ...arguments)" @visible-change="visibleChange($event,index)">
                        <el-option v-for="item in tagsOptions" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value" />
                    </el-select>
                    <div v-if="ele.warning" class="tips">请选择标签</div>
                </div>
                <el-button icon="el-icon-delete" style="margin-left:5px" @click.prevent="remove(index)" />
            </div>
            <el-button :disabled="!isLoading" size="small" style="margin-top:5px;color:#1E89FF" @click="add"><i class="el-icon-plus" />添加</el-button>
        </el-form-item>
    </div>
</template>

<script>
import { getTags } from '@/api/newExtend'
import { getConferenceId } from '@/utils/conference-auth'

export default {
    props: {
        form: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        form: {
            handler(newVal) {
                console.log('watch', newVal)
                if (newVal.applicablePeopleTypes) {
                    this.applicablePeopleTypes = []
                    newVal.applicablePeopleTypes.forEach((ele, index) => {
                        const data = {
                            typeValue: ele.type,
                            warning: false,
                            // 职务内容
                            inputValue: '',
                            // 标签
                            tagsValue: ''
                        }
                        if (ele.type === 1) {
                            data.inputValue = ele.value
                        } else {
                            data.tagsValue = ele.value
                            if (this.tagsOptions.length) {
                                const indexChecked = this.tagsOptions.findIndex(eleFind => String(eleFind.id) === String(ele.value))
                                this.tagsOptions[indexChecked].disabled = true
                            }
                        }
                        this.applicablePeopleTypes.push(data)
                    })
                }
            }
        }
    },
    data() {
        return {
            // 获取会议id
            conferenceId: getConferenceId(),
            applicablePeopleTypes: [],
            // 默认打开职务
            // typeValue: 1,
            typeOptions: [
                { value: 1, label: '职务' },
                { value: 2, label: '标签', disabled: false }
            ],
            // tagsValue: '',
            // 标签列表
            tagsOptions: [],
            isCheckedValue: '',
            isLoading: false
        }
    },
    created() {
        this.getTags()
    },
    methods: {
        // 职务输入框失焦判断是否提示警告信息
        inputBlur(index) {
            if (this.applicablePeopleTypes[index].inputValue.trim()) {
                this.applicablePeopleTypes[index].warning = false
            } else {
                this.applicablePeopleTypes[index].warning = true
            }
        },
        // 每次打开标签下拉框时缓存之前是否选中过
        visibleChange(e, index) {
            if (e) {
                const value = this.applicablePeopleTypes[index].tagsValue
                this.isCheckedValue = value
            }
            console.log(this.tagsOptions)
        },
        selectChange(index, item) {
            const indexChecked = this.tagsOptions.findIndex(ele => String(ele.id) === String(item))
            this.tagsOptions[indexChecked].disabled = true
            // 如果之前选中过 需要将之前选中的状态移除
            if (this.isCheckedValue) {
                const indexChecked = this.tagsOptions.findIndex(ele => String(ele.id) === String(this.isCheckedValue))
                this.tagsOptions[indexChecked].disabled = false
            }
            // 选中值则去除警告框
            if (this.applicablePeopleTypes[index].tagsValue) {
                this.applicablePeopleTypes[index].warning = false
            } else {
                this.applicablePeopleTypes[index].warning = true
            }
        },
        // 每次选择类型的时候根据标签选择的状态和剩余数量判断是否可以点击选择
        visibleChangeType(e) {
            if (e) {
                if (this.tagsOptions.length) {
                    let disabledFlag = false
                    this.tagsOptions.forEach(ele => {
                        if (!ele.disabled) {
                            disabledFlag = true
                        }
                    })
                    if (!disabledFlag) {
                        this.typeOptions[1].disabled = true
                    } else {
                        this.typeOptions[1].disabled = false
                    }
                }
            }
        },
        // 添加
        add() {
            const data = {
                // 职务
                typeValue: 1,
                // 职务内容
                inputValue: '',
                // 标签
                tagsValue: '',
                warning: false
                // tagsOptions: []
            }
            // data.tagsOptions = this.tagsOptions
            this.applicablePeopleTypes.push(data)
        },
        // 删除
        remove(index) {
            // 删除的时候将禁选状态移除
            const item = this.applicablePeopleTypes[index].tagsValue
            if (this.applicablePeopleTypes[index].typeValue === 2 && item) {
                const indexChecked = this.tagsOptions.findIndex(ele => String(ele.id) === String(item))
                this.tagsOptions[indexChecked].disabled = false
            }
            this.applicablePeopleTypes.splice(index, 1)
        },
        typeChoice(val) {
            // this.tagsValue = []
            if (val === 1) {
                // 职务
            } else {
                // 标签
            }
        },
        // 获取标签列表
        getTags() {
            getTags({
                pageNum: 1,
                pageSize: 1000,
                conferenceId: this.conferenceId
            }).then(res => {
                const data = res.result.list
                console.log(data)
                data.forEach(ele => {
                    ele.label = ele.name
                    ele.value = String(ele.id)
                    ele.disabled = false
                })
                this.tagsOptions = data
                this.isLoading = true
                // 如果是回显数据 需要将对应的已选的标签标志设为true
                this.applicablePeopleTypes.forEach(ele => {
                    if (ele.typeValue === 2) {
                        const indexChecked = this.tagsOptions.findIndex(eleFind => String(eleFind.id) === String(ele.tagsValue))
                        this.tagsOptions[indexChecked].disabled = true
                    }
                })
                // 如果没有相关标签数据 需要将选择类型的时候 将标签选择置灰
                // if (!data.length) {
                //     this.typeOptions[1].disabled = true
                // }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.tags-container::v-deep {
    .tags-choice {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 18px;
    }
    .type-choice-item {
        flex: 1;
    }
    .tags-choice-checked {
        .el-input__inner {
            border-color: #ff4949;
        }
    }
    .choice-detail {
        margin-left: 5px;
        position: relative;
        .tips {
            position: absolute;
            left: 5px;
            bottom: -18px;
            line-height: 18px;
            color: #ff4949;
        }
    }
    // .el-form-item__content {
    //     display: flex;
    //     flex-direction: row;
    //     justify-content: center;
    // }
    // .type-choice {
    //     width: 22%;
    //     margin-right: 3%;
    // }
    // .type-choice-input {
    //     width: 75%;
    // }
}
</style>
