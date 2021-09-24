<template>
    <div class="">
        <el-radio-group
            :value="value"
            class="marginleftClass"
            @input="change($event)"
        >
            <el-radio v-for="item in options" :key="item.optionValue + ''" :label="item.optionValue + ''">{{ item.optionText }}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
export default {
    name: 'AttendeeRadio',
    props: {
        value: {
            type: String,
            default: null
        },
        placeholder: {
            type: String,
            default: null
        },
        options: {
            type: Array,
            default: () => {
                return []
            }
        }

    },
    methods: {
        change: function(val) {
            this.$emit('input', val)
        }
    }
}
</script>
<style lang="scss" scoped>
.width360 {
    width: 360px;
}
.marginleftClass {
    margin-left: 5%;
}
</style>
