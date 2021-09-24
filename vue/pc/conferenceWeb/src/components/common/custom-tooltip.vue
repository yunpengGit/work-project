<template>
    <div class="">
        <el-tooltip :disabled="isShowTooltip" placement="bottom" effect="light">
            <div slot="content">
                {{ value }}
            </div>
            <div class="lianghangxianshibuquan" @mouseover="onMouseOver(value)">
                <span :ref="value">
                    {{ formatTableCellData(value) }}
                </span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'CustomToolTip',
    props: {
        value: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            isShowTooltip: true
        }
    },
    methods: {
        onMouseOver(str) {
            console.log(str)
            const parentWidth = this.$refs[str].parentNode.offsetHeight
            const contentWidth = this.$refs[str].offsetHeight
            // 判断是否开启tooltip功能
            if (contentWidth > parentWidth) {
                this.isShowTooltip = false
            } else {
                this.isShowTooltip = true
            }
            console.log(contentWidth)
            console.log(parentWidth)
            console.log(this.isShowTooltip)
        }
    }
}
</script>
<style lang="scss" scoped>
.lianghangxianshibuquan {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
