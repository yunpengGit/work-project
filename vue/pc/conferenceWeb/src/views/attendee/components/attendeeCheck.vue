<template>
    <div class="marginleftClass">

        <el-checkbox-group v-model="selectValue" @change="change">
            <el-checkbox v-for="item in options" :key="item.optionValue + ''" :label="item.optionValue + ''">{{ item.optionText }}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    name: 'AttendeeCheck',
    props: {
        value: {
            type: String,
            default: ''
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
    data() {
        return {
            selectValue: []
        }
    },
    created() {
        this.selectValue = this.value !== null && this.value !== '' ? JSON.parse(this.value) : []
        // alert(this.value)
        // alert(JSON.stringify(this.options))
    },
    methods: {
        change: function(val) {
            if (this.selectValue !== null && this.selectValue.length > 0) {
                this.$emit('input', JSON.stringify(this.selectValue))
            } else {
                this.$emit('input', null)
            }
            this.$emit('changgeCheck', null)
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
