<!--
 * @Author: your name
 * @Date: 2021-06-10 10:45:48
 * @LastEditTime: 2021-07-01 11:33:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\components\SelectPersonnel\often.vue
-->
<template>
  <div>
    <div v-for="item in list" :key="item.id" class="often-item">
      <el-checkbox
        v-model="item.isSelected"
        :disabled="item.disabled"
        @input="$emit('oftenCheck', item)"
      >
        <!-- <span class="photo">
          <img :src="item.type === 2 ? item.avatar : deptSrc ">
        </span> -->
        <div>
          <p class="name">{{ item.name }}</p>
          <p class="sub-name">{{ item.parentName }}</p>
        </div>
      </el-checkbox>
      <icon-svg name="qingkongshanchu" @click.native="$emit('delOften',item)" />
    </div>

  </div>
</template>
<script>
import iconSvg from '@/components/icon-svg'
import deptSrc from './dept.png'
export default {
  components: { iconSvg },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return { deptSrc }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.often-item {
    display: inline-block;
    width: 225px;
    padding: 8px;
    margin: 16px;
    position: relative;
    &:hover {
        background-color: #F6F6F6;
        .icon {
            display: block;
        }
    }

    .icon {
        display: none;
        position: absolute;
        top: -11px;
        right: -7px;
        cursor: pointer;
        width: 25px;
        height: 25px;
    }

    .photo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-right: 6px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .sub-name {
        color: #9f9f9f;
        font-size: 12px;
    }
}
</style>
