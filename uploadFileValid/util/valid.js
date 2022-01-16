export default function useValidator(strategies) {
  const cache = [];
  // 定义目标值、外层入参
  let target;
  const outArgs = [];
  // 添加规则
  const add = (rules) => {
    rules.forEach(rule => {
      const { strategy, errMsg, args, validator } = rule;
      cache.push(() => {
        if (typeof validator === 'function') {
          return validator(target, outArgs);
        } else {
          return strategies[strategy](target, errMsg, { args, outArgs });
        }
      });
    })
  }
  // 开启验证
  const start = (file, ...restArgs) => {
    // 初始化
    target = file;
    outArgs.length = 0;
    outArgs.push(...restArgs);
    // 遍历调用
    for (const validFn of cache) {
      const errMsg = validFn();
      if (errMsg) {
        return errMsg;
      }
    }
  }
  // 返回操作
  return [add, start];
}