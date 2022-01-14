<template>
  <div class="hello">
    <el-form :model="ruleForm" ref="validForm" size="mini">
      <el-table :data="tableData" border style="width: 100%" @cell-click="cellClick">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="data" label="日期" width="180" key="data">
          <template slot-scope="{ row,$index }">
            <span v-if="!getRowState(row).data.edit">{{ row.data }}</span>
            <el-form-item v-else :prop="`${$index}.data`" :rules="getRule">
              <el-input v-model="row.data" @click="handlerClick"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" key="name">
          <template slot-scope="{ row,$index }">
            <span v-if="!getRowState(row).name.edit">{{ row.name }}</span>
            <el-form-item v-else :prop="`${$index}.name`" :rules="getRule">
              <el-input v-model="row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="tarAddress" label="地址" key="tarAddress"></el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="{ row,$index }">
            <el-button size="mini" type="danger" @click="deleteData($index, row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <hr />
    <el-button @click="submitForm('validForm')">提交</el-button>
    <el-button @click="resetForm('validForm')">reset</el-button>
    <el-button @click="addFirstData()">首部添加</el-button>
    <el-button @click="addLastData()">尾部添加</el-button>
  </div>
</template>

<script>
import usePropState from '../util/common-methods';
export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      refArr: [],
      urlObj: {},
      columnOps: ['data', 'name'],
    }
  },
  created() {
    this.getTableData();
    [this.getRowState, this.setPropState] = usePropState(this.refArr, this.columnOps, this.createRowState);
  },
  computed: {
    ruleForm({ tableData }) {
      return { ...tableData }
    },
    getRule() {
      return [
        { required: true, message: '必填', trigger: 'blur' },
      ]
    }
  },

  methods: {
    // 请求数据
    getTableData() {
      setTimeout(() => {
        const srcData = [{
          data: '2016-05-01',
          name: '王1虎',
          tarAddress: '上海市普陀区金沙江路 1511 弄'
        }, {
          data: '2016-05-02',
          name: '',
          tarAddress: '上海市普陀区金沙江路 1512 弄'
        }, {
          data: '2016-05-03',
          name: '王3虎',
          tarAddress: '上海市普陀区金沙江路 1513 弄'
        }, {
          data: '2016-05-04',
          name: '',
          tarAddress: '上海市普陀区金沙江路 1514 弄'
        }];
        // 同步副作用
        this.setPropState({ diffArr: srcData, isInitialize: true })
        this.tableData = srcData;
      }, 200);
    },
    // create row prop State;
    createRowState(row, columns) {
      const rowState = {};
      const { urlObj } = this;
      for (const key in row) {
        if (Object.hasOwnProperty.call(row, key) && columns.includes(key)) {
          const valKey = row[key];
          rowState[key] = key === 'data'
            ? {
              edit: false,
              url: urlObj[valKey] || '',
            }
            : { edit: false }
        }
      }
      return rowState;
    },
    /* 操作类 */
    cellClick(row, { property }) {
      if (!this.columnOps.includes(property)) return;
      this.getRowState(row)[property].edit = true;
    },
    //删
    deleteData(index, row) {
      // 同步副作用
      this.setPropState({ diffArr: [row], isAdd: false })
      this.tableData.splice(index, 1);
    },
    // 首部增加
    addFirstData() {
      const data = {
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      };
      const partUrls = {
        '2036-05-01': 'www.tx.com'
      }
      this.urlObj = partUrls;
      this.setPropState({ diffArr: [data] })
      this.tableData.unshift(data);
    },
    // 尾部添加
    addLastData() {
      const data = {
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      };
      const partUrls = {
        '2036-05-01': 'www.tx.com'
      }

      this.urlObj = partUrls;
      this.setPropState({ diffArr: [data] });
      this.tableData.push(data);
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          alert('error submit!!');
          // return false;
        }
        console.log(this.tableData)
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
