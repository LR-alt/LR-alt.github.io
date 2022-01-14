function usePropState(refArr, srcColumns, createRowState) {
  const storage = {
    refArr,
    propMap: new Map,
  }
  let diffObj = {
    diffArr: null, // 差值
    isAdd: true, // 是否增加
    isInitialize: false, // 是否初始化
  }

  const getRowState = (row) => {
    return storage.propMap.get(row);
  }
  const setPropState = (newDiff, columns = srcColumns, customRowState = createRowState) => {
    // 初始化
    diffObj = {
      ...diffObj,
      ...newDiff
    };
    if (diffObj.isInitialize) {
      storage.propMap.clear();
      storage.refArr.length = 0;
      diffObj.isInitialize = false;
    }
    // 更新
    return updatePropState(storage, diffObj, columns, customRowState);
  }
  return [
    getRowState,
    setPropState
  ]
}
// 更新
function updatePropState(storage, diffObj, columns, customRowState) {
  const { refArr, propMap } = storage;
  const { diffArr, isAdd } = diffObj;
  diffArr.forEach(item => {
    if (isAdd) { // 增
      const rowState = customRowState(item, columns);
      propMap.set(item, rowState);
      refArr.push(rowState);
    } else { // 删
      const rowState = propMap.get(item);
      const index = refArr.findIndex(it => it === rowState);
      propMap.delete(item);
      refArr.splice(index, 1);
    }
  })
  // 还原是否添加的初始值
  diffObj.isAdd = true;
  return propMap;
}

export default usePropState;
