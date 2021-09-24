

<script>
export default {
methods:{
  
},
mounted(){
  const jsapi = new JsApi()
  jsapi.addressBook({
  appId: 'd11d727a3455427', // 必填，第三方的唯一标识
  type: 1, // 1 单选；2 多选，默认为1
  fromType: '1', // '1' 云会议-预约会议; '2' 会议室预约; '3' 活动邀约-发起活动 
  maxNum:100,// 最大支持选择人数
  toast: '提示语',
  members:'',//已选中人员 格式：userId@status||userId@status  userId为sso用户Id;status：1支持删除，2：不可删除
    success: function (res) {
      var content = res.content;
      var result = content. addressBookArray; //返回的结果
      console.log(res,"res1111")
    }
  });

  }
}
</script>

<style>

</style>
