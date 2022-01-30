// 使用校验器
function useValidator(strategies, rules) {
  const cache = [];
  // 定义目标值、外层入参
  const outArgs = {
    file: undefined,
  };
  // 添加规则
  const add = (rules) => {
    rules.forEach(rule => {
      const { strategy, errMsg, ruleArgs, validator } = rule;
      cache.push(() => {
        if (typeof validator === 'function') {
          return validator(outArgs.file, outArgs);
        } else {
          return strategies[strategy](outArgs.file, errMsg, { ruleArgs, outArgs });
        }
      });
    })
  }
  // 开启验证
  const start = (argObj) => {
    // 初始化
    Object.assign(outArgs, argObj);
    // 遍历调用
    for (const validFn of cache) {
      const errMsg = validFn();
      if (errMsg) {
        return errMsg;
      }
    }
  }
  // 添加
  add(rules);
  return start;
}
// 设置表格参数
function useTableParams(tableData, uploadStateFns) {
  if (!Array.isArray(tableData)) { return; }
  let defItem = {};
  // 添加表格项
  const addItem = function (item) {
    defItem = item;
    tableData.push(defItem);
    return this;
  }
  // 设置表格项入参
  const setEffect = function (stateType, fileObj, cb) {
    if (!Object.hasOwnProperty.call(uploadStateFns, stateType)) return this;
    if (typeof cb === 'function') cb(defItem);
    const tarItem = uploadStateFns[stateType](fileObj);
    if(Object.prototype.toString.call(tarItem) === '[object Object]') {
      Object.assign(defItem, tarItem);
    };
    return this;
  }

  return {
    addItem,
    setEffect,
  }
}

export {
  useValidator,
  useTableParams,
}
