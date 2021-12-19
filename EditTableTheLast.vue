<template>
  <div class="hello">
    <el-form :model="ruleForm" ref="validForm" size="mini">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="data" label="日期" width="180" key="data">
          <template slot-scope="{ row,$index }">
            <el-form-item :prop="`${$index}.data`" :rules="getRule">
              <el-input v-model="ruleForm[$index].data"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" key="name">
          <template slot-scope="{ row,$index }">
            <el-form-item :prop="`${$index}.name`" :rules="getRule">
              <el-input v-model="ruleForm[$index].name"></el-input>
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
export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      ruleForm: {},
    }
  },
  created() {
    this.getTableData();
  },
  computed: {
    getRule() {
      return [
        { required: true, message: '必填', trigger: 'blur' },
      ]
    },
  },
  watch: {
    tableData(newTableArr) {
      // 表单数据浅拷贝于数组，因此表单和数组共享子项数据。
      this.ruleForm = { ...newTableArr };
      console.log(this.tableData);
      console.log(this.ruleForm);
    },
  },
  methods: {
    // 请求数据
    getTableData() {
      setTimeout(() => {
        this.tableData = [{
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
      }, 200);
    },
    //删
    deleteData(index) {
      this.tableData.splice(index, 1);
    },
    // 首部增加
    addFirstData() {
      this.tableData.unshift({
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      })
    },
    // 尾部添加
    addLastData() {
      this.tableData.push({
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      })
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
.el-form-item {
  /* margin-bottom: 0px; */
}
</style>
