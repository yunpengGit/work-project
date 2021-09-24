<!--
 * @Author: your name
 * @Date: 2021-06-10 10:45:48
 * @LastEditTime: 2021-07-01 12:38:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\components\SelectPersonnel\often.vue
-->
<template>

  <div class="search-result">
    <template v-if="list.length">
      <div class="search-title">
        <span>搜索结果：{{ list.length }}条</span>
        <!-- <span>结果</span> -->
      </div>
      <div class="search-content">

        <div
          v-for="item in list"
          :key="item.keyId"
          class="search-item"
        >
          <el-checkbox
            v-model="item.isSelected"
            class="checkbox-item"
            :disabled="item.disabled"
            @input="$emit('onSelected',item)"
          >
            <!-- <span class="photo">
              <img :src="item.type === 2 ? item.avatar : deptSrc ">
            </span> -->

            <div>
              <p class="name">{{ item.name }}</p>
              <p class="sub-name">{{ item.parentName }}</p>
            </div>
          </el-checkbox>
        </div>

      </div>
    </template>
    <div v-else class="no-data">没有匹配到相关信息</div>
  </div>
</template>
<script>

import deptSrc from './dept.png'
export default {
  components: { },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return { deptSrc }
  },
  computed: {
    personnelNum () {
      return this.list.filter(v => v.type === 2).length
    },
    departmentNum () {
      return this.list.filter(v => v.type === 1).length
    }
  },
  mounted () {
    // 点击除了搜索框和搜索结果，隐藏搜索结果
    const dialogs = document.getElementsByClassName('select-personnel')
    for (let i = 0; i < dialogs.length; i++) {
      dialogs[i].addEventListener('mousedown', (e) => {
        this.$emit('hidenSearch')
      })
    }
    const search_input = document.getElementsByClassName('search-input')[0]
    search_input.addEventListener('mousedown', function (e) {
      e.stopPropagation()
    })
    const search_result = document.getElementsByClassName('search-result')[0]
    search_result.addEventListener('mousedown', function (e) {
      e.stopPropagation()
    })
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.search-result {
    width: calc(60% - 15px);
    position: absolute;
    right: 12px;
    top: 44px;
    z-index: 9;
    background: #fff;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 20%);
    border-radius: 4px;
    .search-title {
        padding: 8px 16px;
        border-bottom: 1px solid #e8e8e8;
        color: rgba(0,0,0,.65);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
    }
    .search-content {
        padding: 0 16px;
        border-bottom: 1px solid #e8e8e8;
        max-height: 365px;
        overflow: auto;
        .search-item {
            padding: 6px 0;
            font-size: 14px;
            border-bottom: 1px solid #e8e8e8;
            .photo {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                margin-right: 8px;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                font-size: 14px;
            }
            .sub-name {
                font-size: 12px;
                color: #9f9f9f;
            }
        }
    }
    .no-data {
        font-size: 14px;
        text-align: center;
        padding: 40px 0;
        color: rgba(0,0,0,.65);
    }
}
</style>
