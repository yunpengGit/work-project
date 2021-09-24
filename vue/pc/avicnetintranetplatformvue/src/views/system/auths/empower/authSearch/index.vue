<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-09 15:03:56
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-01 21:42:21
-->
<template>
  <div>
    <div class="auth-search-content">
      <el-select
        v-model="value"
        class="auth-autocomplete"
        multiple
        filterable
        remote
        reserve-keyword
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <div class="search-result-title">搜索 “{{ searchCondition }}” 的相关人员</div>
        <ul>
          <li
            v-for="(item,index) in usersData"
            :key="item.value"
          >
            <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="change(index)">
              <div>
                <span class="user-name">{{ item.userName }}</span>
                <span>{{ item.phonenumber }}</span>
              </div>
              <div>{{ item.ancestorsNames }}</div>
            </el-checkbox>
          </li>
        </ul>
        <!-- <el-option
          v-for="(item,index) in usersData"
          :key="item.value"
          :label="item.userName"
          :value="item.userName"
        >
          <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="change(index)">
            <div>
              <span class="user-name">{{ item.userName }}</span>
              <span>{{ item.phonenumber }}</span>
            </div>
            <div>{{ item.ancestorsNames }}</div>
          </el-checkbox>
        </el-option> -->
      </el-select>
      <icon-svg
        slot="suffix"
        class="search-suffix"
        name="sousuo"
      />
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
export default {
  components: { iconSvg },
  props: {
    roleId: {
      type: String,
      default: ''
    },
    selectedUsersData: {
      type: Array,
      default: () => []
    },
    usersData: {
      type: Array,
      default: () => []
    },
    authorizedUsersData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      value: [],
      loading: false,
      // 输入框内容
      searchCondition: '',
      // 输入框防抖延时时间
      debounce: 300
    }
  },
  methods: {
    // 搜索下拉框的点击事件
    change (index) {
      this.$emit('selectedEvent', index)
    },
    // 输入框输入的远程搜索事件
    remoteMethod (query) {
      this.throttle(query, this.getUsers, this.debounce)
    },
    // 输入框防抖处理
    throttle (query, method, time = 300) {
      clearTimeout(method.tId)
      method.tId = setTimeout(() => {
        method.call(method, query)
      }, time)
    },
    // 搜索人员姓名或手机号查询授权用户
    getUsers (queryString) {
      queryString = queryString.trim()
      if (!queryString.length) { return }
      this.searchCondition = queryString
      this.loading = true
      this.value = []
      this.$api('auths.getGivenRole', {
        roleId: this.roleId,
        searchValue: queryString,
        ancestorSeparator: '>'
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data.length) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].customKey = `${res.data[i].userId}${res.data[i].ancestorsNames}`
              const filterUserId = this.authorizedUsersData.find(ele => {
                return ele.userId === res.data[i].userId
              })
              res.data[i].checked = false
              if (filterUserId) {
                res.data[i].checked = true
                res.data[i].disabled = true
              }
              if (this.selectedUsersData.findIndex(ele => ele.customKey === res.data[i].customKey) !== -1) {
                res.data[i].checked = true
              }
            }
          }
          this.$emit('changeUsersData', res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-search-content::v-deep {
  position: relative;
  margin-bottom: 20px;
  .search-suffix {
    position: absolute;
    right: 10px;
    margin-top: 6px;
  }
  .auth-autocomplete {
    width: 100%;
  }
  .el-tag {
    display: none;
  }
}
.user-name {
  margin-right: 15px;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
}
.el-checkbox {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}
.is-disabled {
  cursor: not-allowed;
}
.el-checkbox__label {
  line-height: 24px;
  padding-left: 15px;
}
.el-select-dropdown__item {
  height: auto;
  padding: 0;
}
.search-result-title {
  padding: 8px 15px;
  margin-bottom: 8px;
}
.el-autocomplete-suggestion li:hover {
  cursor: default;
  background-color: #fff;
}
</style>
<style lang="scss">
.auth-search-content {
  .el-select__tags {
    height: 100%;
    input {
      margin-left: 10px;
      width: 100% !important;
      height: 100% !important;
    }
  }
  // .el-input {
    // .el-input__inner {
      // max-height: 32.66px !important;
      // display: none;
    // }
  // }
  // .el-input__suffix {
  // height: 32px !important;
  // }
}
</style>
