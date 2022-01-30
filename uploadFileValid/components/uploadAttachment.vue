<template>
  <div class="attachment">
    <AttachmentInfo
      :uploadUrl="uploadUrl"
      :tableData="tableData"
      :showColumns="showColumns"
      :customRules="rules"
      :exclude="['']"
      :selectChange="selectChange"
      :customVal="customPropVal"
      :uploadStateFns="uploadStateFns"
      isSelect
    >
     <!--  <template #size="{ row }">
        <span>{{ row.size + 'kb' }}</span>
      </template>
      <template #status="{ row, item }">
        <span>{{ item.prop }}:{{ mapStatus[row.status] }}</span>
      </template> -->
      <template #btn="{ row, index }">
        <el-button size="mini" icon="el-icon-delete" @click="deleteData(index, row.uid)">Delete</el-button>
        <el-button size="mini" icon="el-icon-edit" @click="deleteData(index, row.uid)">Delete</el-button>
      </template>
    </AttachmentInfo>
  </div>
</template>
<script>
import AttachmentInfo from './AttachmentInfo.vue';
export default {
  name: 'uploadAttachment',
  components: {
    AttachmentInfo,
  },
  data() {
    const checkRepeatFile = (file, { tableData }) => {
      if (tableData.some(item => item.name === file.name)) {
        return '文件名又又又又重复';
      }
    };
    return {
      tableData: [],
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      rules: [
        { validator: checkRepeatFile }
      ],
      showColumns: [
        {
          label: '文件名',
          prop: 'name',
          width: '30%',
        },
        {
          label: '文件类型',
          prop: 'fileType',
          width: '30%',
        },
        {
          label: '大小',
          prop: 'size',
          width: '20%',
        },
        {
          label: '状态',
          prop: 'status',
          width: '20%',
        },
      ],
      mapStatus: {
        'success': '上传成功'
      },
      uploadStateFns: {
        onBefore({ file }) {
          const { name, size } = file;
          return {
            name,
            size,
            status:'上传开始',
          }
        },
        onSuccess({ res, file, fileList }) {
          const { uid, name, raw: { type }, size, status } = file;
          return {
            uid,
            name,
            size,
            status,
            fileType: type,
          }
        },
        onError({ err, file, fileList }) {
          
        },
        onProgress({ event, file, fileList }) {

        }
      }
    };
  },
  created() {
  },
  methods: {
    // 
    selectChange(selection) {
      console.log(selection);
    },
    deleteData(index, uid) {
      this.tableData.splice(index, 1);
      // this.fileList = this.fileList.filter(item => item.uid !== id);
    },
    customPropVal(row, prop) {
      const value = row[prop];
      if (prop === 'size') {
        return value + 'kb';
      } else if (prop === 'status') {
        // return this.mapStatus[value];
        return value;
      }
      return value;
    }
  }
}
</script>
