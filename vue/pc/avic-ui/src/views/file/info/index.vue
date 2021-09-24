<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="附件名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入附件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机密等级" prop="secretLevel">
        <el-select v-model="queryParams.secretLevel" placeholder="请选择机密等级" clearable size="small">
          <el-option
            v-for="dict in secretLevelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable size="small">
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务ID" prop="businessId">
        <el-input
          v-model="queryParams.businessId"
          placeholder="请输入业务ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="储存类型" prop="storageType">
        <el-select v-model="queryParams.storageType" placeholder="请选择储存类型" clearable size="small">
          <el-option
            v-for="dict in storageTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['file:info:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['file:info:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['file:info:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['file:info:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleDownload"
          v-hasPermi="['file:info:download']"
          :disabled="ids.length <= 0"
        >下载文件
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleDownloadByBus"
          v-show="false"
          v-hasPermi="['file:info:downloadByIdByBus']"
        >测试根据业务类型或ID下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="附件名称" align="center">
        <template slot-scope="scope">
          <span v-bind:title="scope.row.name">{{ scope.row.name | ellipsis}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件存储路径" align="center">
        <template slot-scope="scope">
          <span v-bind:title="scope.row.path">{{ scope.row.path | ellipsis}}</span>
        </template>
      </el-table-column>
      <el-table-column label="机密等级" align="center" prop="secretLevel" :formatter="secretLevelFormat"/>
      <el-table-column label="业务类型" align="center" prop="businessType" :formatter="businessTypeFormat"/>
      <el-table-column label="业务ID" align="center" prop="businessId"/>
      <el-table-column label="储存类型" align="center" prop="storageType" :formatter="storageTypeFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['file:info:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['file:info:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['file:info:download']"
          >下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文件信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件" prop="fileUploadFlag" v-if="!editFlag">
          <el-upload
            name="file"
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            :http-request="uploadHttpRequest"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件不可超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="附件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入附件名称"/>
        </el-form-item>
        <el-form-item label="机密等级" prop="secretLevel">
          <el-select v-model="form.secretLevel" placeholder="请选择机密等级">
            <el-option
              v-for="dict in secretLevelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择业务类型">
            <el-option
              v-for="dict in businessTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务ID" prop="businessId">
          <el-input v-model="form.businessId" placeholder="请输入业务ID"/>
        </el-form-item>
        <el-form-item label="储存类型" prop="storageType">
          <el-select v-model="form.storageType" placeholder="请选择储存类型">
            <el-option
              v-for="dict in storageTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        listInfo,
        getInfo,
        delInfo,
        addInfo,
        updateInfo,
        downloadFileByIds,
        handleDownloadByBusId,
        handleDownloadByBusType
    } from "@/api/file/info";

    export default {
        name: "Info",
        data() {
            const validateFile = (rule, value, callback) => {
                if (!this.fileUploadFlag) {
                    callback(new Error('上传文件不可为空'));
                } else {
                    callback();
                }
            };
            return {
                // 文件列表
                fileList: [],
                // 文件上传标识
                fileUploadFlag: false,
                // 修改文件标识
                editFlag: false,
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 文件信息管理表格数据
                infoList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 机密等级，字典sys_file_secret_level字典
                secretLevelOptions: [],
                // 业务类型,字典sys_file_business_type字典
                businessTypeOptions: [],
                // 储存类型，字典sys_file_storage_type字典
                storageTypeOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    name: null,
                    secretLevel: null,
                    businessType: null,
                    businessId: null,
                    storageType: null,
                },
                // 表单参数
                form: {},
                // 表单对象
                param: undefined,
                // 表单校验
                rules: {
                    fileUploadFlag: [
                        {required: true, validator: validateFile, trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "附件名称不能为空", trigger: "blur"}
                    ],
                    secretLevel: [
                        {required: true, message: "机密等级不能为空", trigger: "change"}
                    ],
                    businessType: [
                        {required: true, message: "业务类型不能为空", trigger: "change"}
                    ],
                    businessId: [
                        {required: true, message: "业务ID不能为空", trigger: "blur"}
                    ],
                    storageType: [
                        {required: true, message: "储存类型不能为空", trigger: "change"}
                    ],
                },
            };
        },
        created() {
            this.getList();
            this.getDicts("sys_file_secret_level").then(response => {
                this.secretLevelOptions = response.data;
            });
            this.getDicts("sys_file_business_type").then(response => {
                this.businessTypeOptions = response.data;
            });
            this.getDicts("sys_file_storage_type").then(response => {
                this.storageTypeOptions = response.data;
            });
        },
        filters: {
            ellipsis(value) {
                if (!value) return "";
                if (value.length > 8) {
                    return value.slice(0, 8) + "...";
                }
                return value;
            },
        },
        methods: {
            // 新增\修改弹窗关闭触发动作
            dialogClosed() {
                this.editFlag = false;
                this.fileUploadFlag = false;
                this.$refs["form"].resetFields()
            },
            // 覆盖element的默认上传文件
            uploadHttpRequest(data) {
                //重新写一个表单上传的方法
                this.param = new FormData();
                this.param.append('file', data.file);
                this.form.name = data.file.name;
                this.fileUploadFlag = true;
            },
            /** 文件上传触发 */
            handleRemove(file, fileList) {
                this.fileUploadFlag = false;
            },
            handleSuccess(res, file) {
            },
            handleChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }
                this.$refs["form"].clearValidate();
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 10MB!');
                }
                return isLt2M;
            },
            handlePreview(file) {
            },
            /** 查询文件信息管理列表 */
            getList() {
                this.loading = true;
                listInfo(this.queryParams).then(response => {
                    this.infoList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },
            // 机密等级，字典sys_file_secret_level字典翻译
            secretLevelFormat(row, column) {
                return this.selectDictLabel(this.secretLevelOptions, row.secretLevel);
            },
            // 业务类型,字典sys_file_business_type字典翻译
            businessTypeFormat(row, column) {
                return this.selectDictLabel(this.businessTypeOptions, row.businessType);
            },
            // 储存类型，字典sys_file_storage_type字典翻译
            storageTypeFormat(row, column) {
                return this.selectDictLabel(this.storageTypeOptions, row.storageType);
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    id: null,
                    name: null,
                    size: null,
                    suffix: null,
                    path: null,
                    secretLevel: null,
                    businessType: null,
                    businessId: null,
                    storageType: null,
                    createBy: null,
                    createTimestamp: null,
                    createTime: null,
                    updateBy: null,
                    updateTime: null,
                    updateTimestamp: null,
                    remark: null,
                    delFlag: null
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加文件信息管理";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids;
                getInfo(id).then(response => {
                    this.form = response.data;
                    this.editFlag = true;
                    this.open = true;
                    this.title = "修改文件信息管理";
                });
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id != null) {
                            updateInfo(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("修改成功");
                                    this.open = false;
                                    this.getList();
                                }
                            });
                        } else {
                            for (let key in this.form) {
                                if (this.form.hasOwnProperty(key) && this.form[key]) {
                                    this.param.set(key, this.form[key]);
                                }
                            }
                            addInfo(this.param).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess("新增成功");
                                    this.open = false;
                                    this.getList();
                                }
                            });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const ids = row.id || this.ids;
                this.$confirm('是否确认删除文件信息管理编号为"' + ids + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return delInfo(ids);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(function () {
                });
            },
            /** 导出按钮操作 */
            handleExport() {
                this.download('file/info/export', {
                    ...this.queryParams
                }, `file_info.xlsx`)
            },
            /** 下载文件操作 */
            handleDownload(row) {
                const ids = row.id || this.ids;
                downloadFileByIds(ids)
            },
            /** 根据业务类型及ID下载文件操作 */
            handleDownloadByBus() {
                handleDownloadByBusId('123', {secretLevel: "S,U"});
                handleDownloadByBusType('notice', {secretLevel: "S,U"});
            }
        },
        watch: {
            // 监听
            open(val) {
                if (!val) {
                    this.dialogClosed();
                }
            }
        },
    };
</script>
