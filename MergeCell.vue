<template>
  <div class="hello">
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="a" label="a-head" width="180"></el-table-column>
      <el-table-column prop="b" label="b-head"></el-table-column>
      <el-table-column prop="c" label="c-head"></el-table-column>
      <el-table-column prop="e" label="e-head"></el-table-column>
      <el-table-column prop="f" label="f-head"></el-table-column>
      <el-table-column prop="g" label="g-head"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row,$index }">
          <i v-if="row.c === 'fail'" class="el-icon-refresh-left" @click="recreate($index)"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      originData: [{
        a: 'a',
        b: 'b',
        c: 'c',
        list: [{
          e: 'e0',
          f: 'f0',
          g: 'g0',
        },
        {
          e: 'e1',
          f: 'f1',
          g: 'g1',
        },
        {
          e: 'e2',
          f: 'f2',
          g: 'g2'
        }
        ]
      },
      {
        a: 'aaa',
        b: 'bbb',
        c: 'fail',
        list: [{
          e: 'eee1',
          f: 'fff1',
          g: 'ggg1',
        },]
      },
      {
        a: 'aa',
        b: 'bb',
        c: 'cc',
        list: [{
          e: 'ee1',
          f: 'ff1',
          g: 'gg1',
        },
        {
          e: 'ee2',
          f: 'ff2',
          g: 'gg2'
        }
        ]
      },

      ],
      tableData: [],
      ajaxData: [{
        a: 'aaaa',
        b: 'bbbb',
        c: 'cccc',
        list: [{
          e: 'gseeee1',
          f: 'sdffff1',
          g: 'sdgggg1',
        }, {
          e:'dfdgg',
          f:'ffcgb',
          g:'gggg434'
        }]
      }],
      mergeColumns: ['a', 'b', 'c'],
      mergeCache: {
        mergeIndexArr: [],
        mergeTarArr: [],
      }
    };
  },
  created() {
    const { tableData, mergeIndexArr } = this.formatTable(this.originData);
    this.tableData = tableData;
    this.setMergeCache(mergeIndexArr);
    console.log(tableData);
    console.log(this.mergeCache);
  },
  methods: {
    // 
    createTableItems(firstItem, list, cb) {
      const itemArr = []
      list = list || [{
        e: '',
        f: '',
        g: ''
      }];
      if (typeof cb === 'function') {
        const singleIndexArr = this.getMergeSingleInxArr(list);
        cb(singleIndexArr)
      }
      list.forEach(tailItem => {
        itemArr.push({
          ...firstItem,
          ...tailItem
        })
      })
      return itemArr;
    },
    // 
    getMergeSingleInxArr(list) {
      const len = (list || []).length;
      if (!len) return [1];
      const singleIndexArr = new Array(len).fill(0);
      singleIndexArr[0] = len;
      return singleIndexArr
    },
    // 对原始表格数据做格式化
    formatTable(srcArr) {
      const tableData = [];
      const mergeIndexArr = [];
      srcArr.forEach(item => {
        const tailList = item.list;
        item.list = null;
        const singleIndexArr = this.getMergeSingleInxArr(tailList);
        mergeIndexArr.push(singleIndexArr);
        tableData.push(...this.createTableItems(item, tailList));
      })
      return {
        tableData,
        mergeIndexArr
      }
    },
    // 
    mapIndexToMergeIndex(indexArr, index) {
      let sumIndex = 0;
      return indexArr.findIndex(item => {
        sumIndex += item.length;
        return sumIndex - 1 === index;
      })
    },
    // 
    setMergeCache(mergeIndexArr, singleIndexArr, index) {
      if (singleIndexArr) {
        const curIndex = this.mapIndexToMergeIndex(mergeIndexArr, index);
        console.log(curIndex);
        mergeIndexArr.splice(curIndex, 1, singleIndexArr)
      }
      this.mergeCache.mergeIndexArr = mergeIndexArr;
      this.mergeCache.mergeTarArr = mergeIndexArr.flat();
    },
    // 
    recreate(index) {
      // 获得请求的数据
      const [ajaxDataItem] = this.ajaxData;
      const tailList = ajaxDataItem.list;
      ajaxDataItem.list = null;
      // 设置mergeCache和tableData
      const singleTableData = this.createTableItems(ajaxDataItem, tailList, (singleIndexArr) => {
        this.setMergeCache(this.mergeCache.mergeIndexArr, singleIndexArr, index);
      });
      this.tableData.splice(index, 1, ...singleTableData);
    },
    // span-method
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.mergeColumns.includes(column.property)) {
        return {
          rowspan: this.mergeCache.mergeTarArr[rowIndex],
          colspan: 1
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form-item {
  margin-bottom: 0px;
}
</style>
