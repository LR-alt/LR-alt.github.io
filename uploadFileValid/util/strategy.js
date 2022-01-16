// 默认通用的校验规则
const rules = [
  { strategy: 'isJPGFile', errMsg: '上传头像图片只能是 JPG 格式!' },
  { strategy: 'validFileName', errMsg: '文件名长度超过8个字', args: 8 },
  { strategy: 'isOver2M', errMsg: '文件大小超过1M', args: 1 },
];

const strategies = {
  isJPGFile(file, errMsg) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) return errMsg;
  },
  isOver2M(file, errMsg, { args: length }) {
    const isLt2M = file.size / 1024 / 1024 < length;
    if (!isLt2M) return errMsg;
  },
  validFileName(file, errMsg, { args: length }) {
    const size = file.name.length;
    if (size > length) return errMsg;
  },
};

export {
  rules,
  strategies
}
