<template>
  <div class="attachment">
    <AttachmentInfo :customRules="rules" :exclude="['isJPGFile']" />
  </div>
</template>
<script>
import AttachmentInfo from './AttachmentInfo.vue';
export default {
  name: 'uploadAttachment',
  components: {
    AttachmentInfo,
  },
  data() {
    const checkRepeatFile = (file, [tableData]) => {
      if (tableData.some(item => item.name === file.name)) {
        return '文件名又又又又重复';
      }
    };
    return {
      fileList: [],
      tableData: [],
      rules: [
        { validator: checkRepeatFile }
      ],
    };
  },
  created() {

  },
  methods: {

  }
}
</script>