<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <zh-table :cols="cols" :api="api" :selection.sync="selection" keys="userName,phonenumber,userStatus,dateRangeValue">
          <div slot="top" class="opt-btns">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="selection.length != 1" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!selection.length" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
            <right-toolbar></right-toolbar>
          </div>
          <!-- <template>
            <zh-table :cols="colsC" :api="api" :selection.sync="selection" :layout="null"></zh-table>
          </template> -->
        </zh-table>
      </el-col>
    </el-row>
    <zh-dialog :title="title" width="600px" uid="user-dialog"></zh-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
import formatDate from "@/utils/format-date";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import elSwitch from "@/components/ElSwitch";
import Params, {
  parse,
  componentization
} from "@/utils/extends/utils/router-params";

export default {
  name: "User",
  components: { Treeselect },
  data () {
    return {
      cols: [
        {
          label: "用户编号",
          prop: "userId"
        },
        {
          label: "用户名称",
          prop: "userName",
          'show-overflow-tooltip': true
        },
        {
          label: "用户昵称",
          prop: "nickName",
          'show-overflow-tooltip': true
        },
        {
          label: "部门",
          prop: "dept.deptName",
          'show-overflow-tooltip': true
        },
        {
          label: "手机号码",
          prop: "phonenumber",
          width: 120
        },
        {
          label: "状态",
          prop: ({ row }, h) => {
            return h(elSwitch, {
              props: {
                data: row,
                warningText: `确认要${row.status !== '0' ? '启用' : '停用'}${row.userName} 用户吗?`,
                callback: () => {
                  let userId = row.userId
                  let status = row.status === '0' ? '1' : '0'
                  return changeUserStatus(userId, status)
                }
              }
            })
          }
        },
        {
          label: "创建时间",
          prop: ({ row }) => {
            return formatDate(row.createTime, "yyyy-MM-dd hh:mm:ss")
          },
          width: 160
        },
        {
          label: "操作",
          width: "170px",
          prop: ({ row }) => {
            const buttonArr = []
            buttonArr.push({
              label: "修改",
              icon: 'el-icon-edit',
              directives: [{ name: 'hasPermi', value: ['system:user:edit'] }],
              callback: this.handleUpdate,
            });
            if (row.userId !== 1) {
              buttonArr.push({
                label: "删除",
                icon: 'el-icon-delete',
                directives: [{ name: 'hasPermi', value: ['system:user:remove'] }],
                callback: this.handleDelete,
              });
            }
            buttonArr.push({
              label: "重置",
              icon: 'el-icon-refresh',
              directives: [{ name: 'hasPermi', value: ['system:user:resetPwd'] }],
              callback: this.handleResetPwd,
            })

            return buttonArr
          }
        }
      ],
      colsC: [
        {
          label: "用户编号",
          prop: "userId"
        },
        {
          label: "用户名称",
          prop: "userName",
          'show-overflow-tooltip': true
        }
      ],
      selection: [],//复选
      params: new Params('F', 0),
      queryParams: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    api (params) {
      return listUser(params)
    },
    /** 查询部门下拉树结构 */
    getTreeselect () {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick (data) {
      this.queryParams.deptId = data.id;
      const params = parse('F', Object.keys(this.$route.query).toString().split('.')[1], this.$route.query) || {}
      params.deptId = data.id
      let bb = this.params.componentization(params)
      this.$router.push({
        query: {
          ...this.$router.query,
          ...bb
        }
      })
      this.$store.commit('UPDATE_ALL_TABLE_DATA');
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.title = "添加用户";
      this.$store.commit('OPEN_DIALOG', {
        uid: 'user-dialog',
        props: {
          initData: {
            deptOptions: this.deptOptions,
            statusOptions: this.statusOptions,
            sexOptions: this.sexOptions
          }
        },
        component: require('./dialog/user-dialog').default
      })
    },
    /** 修改按钮操作 */
    handleUpdate ({ row }) {
      this.title = "修改用户";
      const userId = row && row.userId || this.selection[0].userId;
      this.$store.commit('OPEN_DIALOG', {
        uid: 'user-dialog',
        props: {
          userId: userId,
          initData: {
            deptOptions: this.deptOptions,
            statusOptions: this.statusOptions,
            sexOptions: this.sexOptions
          }
        },
        component: require('./dialog/user-dialog').default
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd ({ row }) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功，新密码是：" + value);
          }
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete ({ row }) {
      const userIds = row.userId || this.selection.map(item => item.userId);
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delUser(userIds).then(() => {
          this.msgSuccess("删除成功")
          this.$store.commit('UPDATE_ALL_TABLE_DATA');
        })
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate () {
      this.download('system/user/importTemplate', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.$store.commit('UPDATE_ALL_TABLE_DATA');
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit();
    }
  }
};
</script>
