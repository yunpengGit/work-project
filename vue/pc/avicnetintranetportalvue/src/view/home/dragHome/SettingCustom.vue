<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 18:12:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-30 16:12:36
-->
<template>
  <div class="content-box">
    <div class="group">
      <div class="label">
        <span class="title">多页签组件</span>
        <!-- <el-button type="text" @click="add"><icon-svg name="xinjian" />新增</el-button> -->
      </div>
      <draggable
        :list="components"
        tag="ul"
        :disabled="!draggableEnabled"
        class="list"
        ghost-class="ghost"
        handle=".handle"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
          <li v-for="item in components" :key="item.id" class="item">
            <span>
              <el-checkbox v-model="item.checked" @click="()=>item.checked=!item.checked" />
              <!-- <el-input v-model="item.name" placeholder="" style="width: 120px" /> -->
              <span class="componentName">{{ item.label }}</span>
            </span>
            <!-- <span class="delete" @click="del(item.id)"><icon-svg name="del" /></span> -->
            <span class="handle" title="排序"><icon-svg name="tuodong" /></span>
          </li>
        </transition-group>
      </draggable>
      <div class="btn-box">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    iconSvg,
    draggable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dragging: false,
      components: [
        {
          id: '2',
          checked: false,
          name: '待办',
          label: '待办',
          componentName: 'Upcoming',
          fixed: false
        },
        {
          id: '3',
          checked: false,
          name: '待阅',
          label: '待阅',
          componentName: 'ToBeRead',
          fixed: false
        },
        {
          id: '4',
          checked: false,
          name: '关注',
          label: '关注',
          componentName: 'FocusWork',
          fixed: false
        },
        {
          id: '5',
          checked: false,
          name: '通知公告',
          label: '通知公告',
          componentName: 'Notice',
          fixed: false
        },
        {
          id: '1',
          checked: false,
          name: '未读邮件',
          label: '未读邮件',
          componentName: 'Email',
          fixed: false
        }
      ],
      draggableEnabled: true
    }
  },
  watch: {
    config (n, o) {
      if (this.config && JSON.stringify(this.config) !== '{}') {
        const config = this.config.config
        if (config.length > 0) {
          const arr = config.map(e => {
            return e.id
          })
          this.components.forEach(e => {
            if (arr.includes(e.id)) {
              e.checked = true
            }
          })
        }
      }
    }
  },
  methods: {
    // add () {
    //   const obj = {
    //     id: +new Date() + '',
    //     name: '',
    //     componentName: 'Upcoming',
    //     fixed: false
    //   }
    //   this.list.push(obj)
    // },
    // del (id) {
    //   this.$confirm('是否删除该条数据?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const index = this.list.findIndex(e => e.id === id)
    //     this.list.splice(index, 1)
    //   }).catch(() => {

    //   })
    // },
    checkMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    submitForm () {
      // console.log(this.components)
      const data = this.components.filter(e => {
        return e.checked
      })
      // console.log(data)
      this.$emit('editComponent', data)
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     // console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm () {
      this.$emit('exitEditItem')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './setting.scss';
.label{
  display: flex;
  justify-content: space-between;
  .el-button {
    .icon{
      margin-right: 6px;
      width: 14px;
      height: 14px;
      vertical-align: top;
    }
  }
}
.list{
  & > span {
    display: block;
    .item{
      transition: transform 0.5s;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .componentName{
        margin-left: 10px;
        width: 100px;
      }
      .handle{
        cursor: pointer;
      }
    }
  }
}
.btn-box{
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  text-align: right;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  background: rgba(73, 156, 248, 0.08);
}
</style>
