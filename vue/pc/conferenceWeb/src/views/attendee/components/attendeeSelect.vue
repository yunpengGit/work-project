<template>
    <div class="">
        <el-select
            clearable
            :value="value"
            class="marginleftClass width360"
            :placeholder="placeholder"
            @input="change($event)"
        >
            <el-option v-for="item in options" :key="item.optionValue + ''" :label="item.optionText + ''" :value="item.optionValue + ''" />
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'AttendeeSelect',
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
    created() {
        if (this.value !== null) {
            var selectedValue = this.options.find(item => item.optionValue + '' === this.value)
            if (selectedValue === undefined || selectedValue === null) {
                this.value = null
                this.$emit('input', null)
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
