<template>
    <div>
        <el-tabs v-model="materialsActiveName" class="huiyiziliaoClass" :stretch="false" style="background-color:white;" @tab-click="handleClick">
            <el-tab-pane :lazy="true" name="first">
                <span slot="label" style="margin-top:15px;font-size:16px;">{{ getConferenceTemplate(1) }}文件</span>
                <MaterialsFile :materials-active-name="materialsActiveName" :conference-id="conferenceId" :active-name="activeName" />
            </el-tab-pane>
            <el-tab-pane :lazy="true" name="second">
                <span slot="label" style="margin-top:15px;font-size:16px">{{ getConferenceTemplate(1) }}文件夹</span>
                <MaterialsGroup :materials-active-name="materialsActiveName" :conference-id="conferenceId" :active-name="activeName" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import MaterialsGroup from './materialsGroup'
import MaterialsFile from './materialsFile'
export default {
    name: 'Materials',
    components: {
        MaterialsGroup,
        MaterialsFile
    },
    props: {
        conferenceId: {
            type: null,
            default: null
        },
        activeName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            materialsActiveName: 'first'
        }
    },
    watch: {
    },
    created() {
    },
    methods: {
        handleClick() {}
    }
}
</script>
<style lang="scss" scoped>
</style>
<style>
.huiyiziliaoClass .el-tabs__header {
    margin-left:10px;
}
</style>
