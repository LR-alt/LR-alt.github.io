<template>
  <div class="hello">
    <el-form :model="ruleForm" ref="validForm" size="mini">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="data" label="日期" width="180" key="data">
          <template slot-scope="{ row,$index }">
            <el-form-item :prop="`data${$index}`" :rules="getRule()">
              <el-input v-model="ruleForm[`data${$index}`]" @blur="handleBlur(row, 'data', $index)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
          <template slot-scope="{ row,$index }">
            <el-form-item :prop="`name${$index}`" :rules="getRule()">
              <el-input
                v-model="ruleForm[`name${$index}`]"
                @blur="handleBlur(row, 'name', $index,)"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="tarAddress" label="地址" key="tarAddress"></el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="danger" @click="handleDelete($index, row)">Delete</el-button>
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
  watch: {
    tableData(newTableData) {
      this.mapTableToForm(newTableData, this.ruleForm)
      console.log(this.ruleForm)
    }
  },
  created() {
    setTimeout(() => {
      this.tableData = [{
        data: '2016-05-02',
        name: '王1虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      }, {
        data: '2016-05-04',
        name: '',
        tarAddress: '上海市普陀区金沙江路 1517 弄'
      }, {
        data: '2016-05-01',
        name: '王3虎',
        tarAddress: '上海市普陀区金沙江路 1519 弄'
      }, {
        data: '2016-05-03',
        name: '',
        tarAddress: '上海市普陀区金沙江路 1516 弄'
      }]
    }, 200);
  },
  methods: {
    getRule() {
      return [
        { required: true, message: '必填', trigger: 'blur' },
      ]
    },
    //将表格的属性和数据映射到表单中
    mapTableToForm(tableData, formData) {
      // const tempFormData = {};
      tableData.forEach((item, inx) => {
        for (const key in item) {
          const wrapKey = `${key}${inx}`;
          this.$set(formData, wrapKey, item[key]);
        }
      })
    },
    handleDelete(index) {
      this.tableData.splice(index, 1);
    },
    addFirstData() {
      this.tableData.unshift({
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      })
    },
    addLastData() {
      this.tableData.push({
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      })
    },
    isChange(newValue, oldValue) {
      return newValue !== oldValue;
    },
    updateValue(row,prop,newValue){
      const oldValue = row[prop];
      if(oldValue !== newValue){
        row[prop] = newValue;
      }
    },
    handleBlur(row, prop, index) {
      this.updateValue(row, prop, this.ruleForm[`${prop}${index}`])
    },
    submitForm(formName) {
      console.log(this.tableData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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
