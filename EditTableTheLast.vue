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
import initPropMap from '../util/common-methods';
export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      ruleForm: {},
      refArr: [],
      propMap: null,
      urlObj: {},
      columnOps: ['data', 'name'],
    }
  },
  created() {
    this.getTableData();
    this.usePropMap = initPropMap(this.refArr, this.columnOps, this.createRowState);
  },
  computed: {
    getRule() {
      return [
        { required: true, message: '必填', trigger: 'blur' },
      ]
    },
  },
  watch: {
    tableData(newTable) {
      // 表单数据浅拷贝于数组，因此表单和数组共享子项数据。
      this.ruleForm = { ...newTable };
    },
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
        this.propMap = this.usePropMap({ diffArr: srcData, isInitialize: true })
        this.tableData = srcData;
      }, 200);
    },
    // create row prop State;
    createRowState(rowObj, columns) {
      const stateObj = {};
      const { urlObj } = this;
      for (const key in rowObj) {
        const valKey = rowObj[key];
        if (Object.hasOwnProperty.call(rowObj, key) && columns.includes(key)) {
          stateObj[key] = key === 'data'
            ? {
              edit: false,
              url: urlObj[valKey] || '',
            }
            : { edit: false }
        }
      }
      return stateObj;
    },
    // 获取状态
    getRowState(row) {
      return this.propMap.get(row);
    },
    /* 操作类 */
    // 
    cellClick(row, { property }) {
      if (!this.columnOps.includes(property)) return;
      this.getRowState(row)[property].edit = true;
    },
    // 
    handlerClick() {

    },
    //删
    deleteData(index, row) {
      // 同步副作用
      this.usePropMap({ diffArr: [row], isIncrement: false })
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
      this.usePropMap({ diffArr: [data], isIncrement: true })
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
      this.usePropMap({ diffArr: [data], isIncrement: true });
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
