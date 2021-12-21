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
export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      ruleForm: {},
      propArr: [],
      propMap: new Map(),
      diffObj: {
        diffArr: null,
        isIncrement: true,
      },
      editableOps: ['data', 'name'],
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
    tableData(newTable) {
      // 表单数据浅拷贝于数组，因此表单和数组共享子项数据。
      this.ruleForm = { ...newTable };
      // 同步属性绑定的状态
      this.updatePropState(newTable);
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
        this.tableData = srcData;
      }, 200);
    },
    // set prop diff state
    setDiffObj(diffArr, isIncrement) {
      diffArr = Array.isArray(diffArr) ? diffArr : [diffArr];
      Object.assign(this.diffObj, {
        diffArr,
        isIncrement,
      })
    },
    // create row prop State;
    createRowPropState(propObj) {
      const stateObj = {};
      for (const key in propObj) {
        if (Object.hasOwnProperty.call(propObj, key) && this.editableOps.includes(key)) {
          stateObj[key] = { edit: false }
        }
      }
      return stateObj;
    },
    /* 操作类 */
    // 同步属性绑定的状态
    updatePropState(tableData) {
      const { diffArr, isIncrement } = this.diffObj;
      const { propMap, propArr } = this;
      const tarArr = diffArr || tableData;
      tarArr.forEach(item => {
        if (isIncrement) { // 增
          const rowPropObj = this.createRowPropState(item);
          propMap.set(item, rowPropObj);
          propArr.push(rowPropObj);
        } else { // 删
          const rowPropObj = propMap.get(item);
          const index = propArr.findIndex(it => it === rowPropObj);
          propArr.splice(index, 1)
          propMap.delete(item);
        }
      })
    },
    // 
    getRowState(row) {
      return this.propMap.get(row);
    },
    // 
    cellClick(row, { property }, cell, event) {
      if (!this.editableOps.includes(property)) return;
      this.getRowState(row)[property].edit = true;
    },
    // 
    handlerClick() {

    },
    //删
    deleteData(index, row) {
      this.tableData.splice(index, 1);
      this.setDiffObj(row, false)
    },
    // 首部增加
    addFirstData() {
      const data = {
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      };
      this.tableData.unshift(data);
      this.setDiffObj(data, true)
    },
    // 尾部添加
    addLastData() {
      const data = {
        data: '2036-05-01',
        name: '王0虎',
        tarAddress: '上海市普陀区金沙江路 1518 弄'
      };
      this.tableData.push(data);
      this.setDiffObj(data, true)
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
