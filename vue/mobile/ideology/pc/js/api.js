/*
 * @Description: 
 * @Author: peng
 * @Date: 2021-08-23 16:18:56
 * @LastEditors: peng
 * @LastEditTime: 2021-09-01 10:47:20
 */
var baseUrl= 'http://xts.natapp1.cc';
var api={
  info:'/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeIndex.do?method=info',
  parametersShow:'/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeIndex.do?method=parametersShow',
  search:'/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeSearchBuilder.do?method=search&searchAll=true&resultType=json&modelName=KmSizzcKnowledge'
}
function ajaxJsonP(params,cb){
  // console.log(params);
  $.ajax({
    url:baseUrl+api[params.url],
    data:params.data,
    type:params.type||"get",
    dataType:"jsonp",
    jsonpCallback:params.cbName||'cb',
    crossDomain: true,
    headers : {'Content-Type' : 'application/json;charset=utf-8'}, //接口json格式
    success:function(res){
        cb(res)
    },
    error:function(data){
        layer.alert(JSON.stringify(data), {
            title: '请求错误'
        });
    }
  });
}