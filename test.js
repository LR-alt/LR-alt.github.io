 const arr = [{
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
        c: 'ccc',
        list: [{
          e: 'eee1',
          f: 'fff1',
          g: 'ggg1',
        }, ]
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

    ];
    const ajaxData = [{
      a: 'aaaa',
      b: 'bbbb',
      c: 'cccc',
      list: [{
        e: 'eeee1',
        f: 'ffff1',
        g: 'gggg1',
      }, {
        e: 'eeee2',
        f: 'ffff2',
        g: 'gggg2',
      }, ]
    }]
    const mergeCache = {
      mergeIndexArr: [],
      mergeTarArr: [],
    }

    const getMergeSingleInxArr = list => {
      const len = (list || []).length;
      if (!len) return [1];
      const singleIndexArr = new Array(len).fill(0);
      singleIndexArr[0] = len;
      return singleIndexArr
    }
    // 生成表格子项
    const createTableItems = (firstItem, list, cb) => {
      const itemArr = []
      list = list || [{
        e: '',
        f: '',
        g: ''
      }];
      if (typeof cb === 'function') {
        const singleIndexArr = getMergeSingleInxArr(list);
        cb(singleIndexArr)
      }
      list.forEach(tailItem => {
        itemArr.push({
          ...firstItem,
          ...tailItem
        })
      })
      return itemArr;
    };
    // 对原始表格数据做格式化
    const formatTable = (srcArr) => {
      const tableData = [];
      const mergeIndexArr = [];
      srcArr.forEach(item => {
        const tailList = item.list;
        item.list = null;
        const singleIndexArr = getMergeSingleInxArr(tailList);
        mergeIndexArr.push(singleIndexArr);
        tableData.push(...createTableItems(item, tailList));
      })
      return {
        tableData,
        mergeIndexArr
      }
    }
    // 由 原始索引 获取 合并数组的索引
    const mapIndexToMergeIndex = (indexArr, index) => {
      let sumIndex = 0;
      for (let i = 0; i < indexArr.length; i++) {
        const curItem = indexArr[i];
        sumIndex += curItem.length;
        if (sumIndex - 1 === index) {
          return i;
        }
      }
    }
    // 设置 mergeCache
    const setMergeCache = (mergeInxArr, singleIndexArr, index) => {
      if (singleIndexArr) {
        const curIndex = mapIndexToMergeIndex(mergeInxArr, index);
        mergeInxArr.splice(curIndex, 1, singleIndexArr)
      }
      mergeCache.mergeIndexArr = mergeIndexArr;
      mergeCache.mergeTarArr = mergeIndexArr.flat();
    }
    
    // test result
    const { tableData, mergeIndexArr } = formatTable(arr);
    setMergeCache(mergeIndexArr);

    // 后续 点击重新创建后
    const recreate = (index) => {
      const [ajaxDataItem] = ajaxData;
      const tailList = ajaxDataItem.list;
      ajaxDataItem.list = null;
      const singleTableData = createTableItems(ajaxDataItem, tailList, (singleIndexArr) => {
        setMergeCache(mergeCache.mergeIndexArr, singleIndexArr, index);
      });
      tableData.splice(index, 1, ...singleTableData);
    }

    recreate(3)
    console.log(tableData);
    console.log(mergeCache);
