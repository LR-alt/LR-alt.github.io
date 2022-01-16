<template>
  <div class="attachment">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="primary">上传附件</el-button>
    </el-upload>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="fileType" label="文件类型"></el-table-column>
      <el-table-column prop="size" label="大小"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="deleteData($index, row.uid)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import useValidator from '../util/valid';
import { rules, strategies } from '../util/strategy';
export default {
  name: 'AttachmentInfo',
  props: {
    customRules: {
      type: Array,
      default: () => ([]),
    },
    exclude: {
      type: Array,
      default: () => ([])
    },
    include: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      fileList: [],
      tableData: [],
      defRules: rules,
    };
  },
  computed: {
    allRules({ customRules, defRules }) {
      const curDefRules = defRules.filter(item => !this.exclude.includes(item.strategy))
      return [...curDefRules, ...customRules];
    },
  },
  created() {
    console.log(this.allRules);
  },
  mounted() {
    const [addRule, startVerify] = useValidator(strategies);
    addRule(this.allRules);
    this.startVerify = startVerify;
  },
  methods: {
    beforeUpload(file) {
      /* 
     * 文件大小不能超过500kb
     * 文件类型只能是jpg/png
     * 文件名大小不能超过50个字符
     * 文件名必须带有水印两个字
     * 文件名不能重名
     * 文件数量不能超过5个
     */
      const errMsg = this.startVerify(file, this.tableData);
      if (errMsg) {
        this.$message.error(errMsg);
        return false;
      } else {
        return true;
      }
    },
    handleSuccess(res, file, fileList) {
      const { uid, name, raw: { type }, size, status } = file;
      this.tableData.push({
        uid,
        name,
        size,
        status,
        fileType: type,
      });
    },
    deleteData(index, id) {
      this.tableData.splice(index, 1);
      this.fileList = this.fileList.filter(item => item.uid !== id);
    },
  }
}
</script>