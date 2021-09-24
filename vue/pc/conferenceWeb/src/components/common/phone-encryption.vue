<template>
    <div class="">
        <div>
            <span>{{ formatTableCellData(formatPhone(value)) }}</span>
            <span style="display:none">{{ value }}</span>
            <svg-icon v-show="value !== null && value !== ''" style="cursor:pointer" :class="buttonClass" :icon-class="buttonIconClass" @click="(event) => qiehuanshoujijiami(event)" />
        </div>
    </div>
</template>

<script>
import { formatPhone } from '@/utils/index'
export default {
    name: 'PhoneEncryption',
    props: {
        value: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            buttonClass: 'marginleftClass',
            buttonIconClass: 'biyan'
        }
    },
    methods: {
        formatPhone(val) {
            return formatPhone(val) + '                        '
        },
        qiehuanshoujijiami(event) {
            if (event.currentTarget.parentElement.children[0].style.display === 'none') {
                this.buttonIconClass = 'biyan'
                this.buttonClass = 'marginleftClass'
                event.currentTarget.parentElement.children[0].style.display = ''
                event.currentTarget.parentElement.children[1].style.display = 'none'
            } else {
                this.buttonClass = ''
                this.buttonIconClass = 'zhengyan'
                event.currentTarget.parentElement.children[0].style.display = 'none'
                event.currentTarget.parentElement.children[1].style.display = ''
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.marginleftClass {
    margin-left:6px;
}
</style>
