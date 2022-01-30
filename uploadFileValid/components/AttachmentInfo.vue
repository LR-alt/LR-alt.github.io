<template>
  <div class="attachment">
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
    >
      <el-button size="small" type="primary">上传附件</el-button>
    </el-upload>
    <el-table :data="tableData" @selection-change="selectChange">
      <el-table-column v-if="isSelect" type="selection" width="50"></el-table-column>
      <el-table-column
        v-for="item in showColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        v-slot="{ row }"
      >
        <slot :name="item.prop" :row="row" :item="item">
          <span>{{ customVal(row, item.prop) }}</span>
        </slot>
      </el-table-column>
      <el-table-column label="操作" v-slot="{ row, $index }">
        <slot name="btn" :row="row" :index="$index">
          <el-button size="mini" type="danger" @click="deleteData($index, row.uid)">defDelete</el-button>
        </slot>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { useTableParams, useValidator } from '../util/valid';
import { rules, strategies } from '../util/strategy';
export default {
  name: 'AttachmentInfo',

  data() {
    return {
      defRules: rules,
    };
  },
  computed: {
    allRules({ customRules, defRules }) {
      const curDefRules = defRules.filter(item => !this.exclude.includes(item.strategy))
      return [...curDefRules, ...customRules];
    },
  },
  mounted() {
    // 初始化校验
    const startVerify = useValidator(strategies, this.allRules);
    // 初始化表格
    const { addItem, setEffect } = useTableParams(this.tableData, this.uploadStateFns);
    // 挂载到this中
    Object.assign(this, {
      startVerify,
      addItem,
      setEffect,
    })
  },
  methods: {
    beforeUpload(file) {
      // 校验
      const errMsg = this.startVerify({ file, tableData: this.tableData });
      if (errMsg) {
        this.$message.error(errMsg);
        return false;
      }
      // 初始化入参
      this.addItem(this.refProps).setEffect('onBefore', { file }, defItem => {
        defItem.status = 'upload start';
      });
    },
    handleProgress(event, file, fileList) {
      this.setEffect('onProgress', { event, file, fileList }, defItem => {
        defItem.status = 'uploading';
      })
    },
    handleSuccess(res, file, fileList) {
      this.setEffect('onSuccess', { res, file, fileList }, defItem => {
        defItem.status = 'upload success';
      })
    },
    handleError(err, file, fileList) {
      this.setEffect('onError', { err, file, fileList }, defItem => {
        defItem.status = 'upload failing';
      })
    },
    deleteData(index, id) {
      this.tableData.splice(index, 1);
      this.fileList = this.fileList.filter(item => item.uid !== id);
    },
  },
  props: {
    uploadUrl: {
      type: String,
      default: '',
      required: true,
    },
    showColumns: {
      type: Array,
      default: () => [],
      required: true,
    },
    tableData: {
      type: Array,
      default: () => [],
      required: true,
    },
    // 自定义规则
    customRules: {
      type: Array,
      default: () => [],
    },
    // 排除规则
    exclude: { 
      type: Array,
      default: () => []
    },
    // 包含规则
    include: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    },
    // 多选 和 单选
    selectChange: {
      type: Function,
      default: () => { }
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    // 响应式（动态）属性
    refProps: {
      type: Object,
      default: () => ({
        status: '',
      })
    },
    // 状态函数
    uploadStateFns: {
      type: Object,
      default: () => ({}),
      validator(statusFnObj) {
        const requiredFnNames = ['onBefore', 'onProgress', 'onSuccess', 'onError', 'onChange'];
        const curFnNames = Object.keys(statusFnObj);
        // 传入的属性值需为函数且函数名称必须包含于requiredFnNames中
        return curFnNames.every(fnName => {
          const isFn = typeof statusFnObj[fnName] === 'function';
          const isInclude = requiredFnNames.includes(fnName);
          return isFn && isInclude;
        })
      }
    },
    customVal: {
      type: Function,
      default: (row, prop) => row[prop],
    },
  },
}
</script>
