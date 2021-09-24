/*
 * @Description: 
 * @Author: peng
 * @Date: 2021-08-18 13:50:31
 * @LastEditors: peng
 * @LastEditTime: 2021-09-03 15:09:56
 */
// 公共数据缓存
// 配置
var config = {
  queryString:'',
  pageno: 1,
  rowsize: 10,
  total: 0,
  baseUrl: ''
}

// 单位
var unitData = []
// layui 组件对象
var form


var $ = layui.$
// 查询参数初始化
init()
$.support.cors = true;
function init(){
  var data={
    url:'parametersShow',
    cbName: 'cbParametersShow'
  }
  var cbParams=function(res){
    // console.log(123);
    // console.log(res.data);
    var list = res.data
    initParams(list)
  }
  ajaxJsonP(data,cbParams)
  // 有关键字参数查询
  var queryString = decodeURI(window.location.search&&window.location.search.split('=')[1])
  if(queryString){
    $('.layui-input').val(queryString)
    const params = {
      pageno: config.pageno,
      rowsize: config.rowsize,
      queryString,
    }
    config.queryString= queryString
    getData(params)
  }
}
function initParams(params){
  var html=''
  params.forEach(function(item){
    // console.log(item);
    if(item.list){
      html += paramsTemplate(item);
    }
  })
  // console.log(html);
  $('.submit-btn').before(html)
  form.render()
  // document.querySelector('.layui-form').innerHTML = html
}

// 筛选条件模板
function paramsTemplate(item){
  // console.log(item);
  item.list.unshift('不限')
  var optionStr=''
  item.list.forEach(function(option){
    optionStr += optionTemplate(option)
  })
  function optionTemplate(option){
    var name =item.field+'&&'+[option]
    // console.log(name);
    var title = option
    var optionStr = `
    <input type="radio" name="${item.field}" title="${title}" value="${title}">
    `
    return optionStr
  }
  var str=`
  <div class="section10 flex-row" lay-filter=${item.field}>
    <div class="layui-form-item">
      <label class="layui-form-label">${item.title}：</label>
      <div class="layui-input-block" lay-filter="year">
        ${optionStr}
      </div>
    </div>
  </div>
  `
  return str
}
layui.use('form', function(){
  form = layui.form
  // var $ = layui.$
  // form.on('input', function(data){
  //   console.log(1234)
  //   layer.alert(data.value+":"+data.elem.checked)
  // });
  //

  // 监听搜索输入
  var timer = null
  var keyword = null
  document.querySelector(".layui-input").addEventListener("keyup",function(e){
    if(!timer){
      timer=setTimeout(function (){
        // 缓存 关键字
        keyword = e.target.value
        // console.log(keyword)
        clickSubmit();
        timer = null;
      },1000)
    }
  },false)
  // 全文检索
  // $('.all-search').click(function(){
  //   // 跳转新页面
  //   window.location.href = window.location.origin+'/search.html'
  // })
  form.on('radio', function(data){
    // console.log(data.elem);
    // console.log(data,222);
    clickSubmit()
  });
  form.on('submit', function(data){
    // console.log(data.elem,1234)
    // console.log(data.form)
    // console.log(data.field)
    keyword = $('.layui-input').val()
    var params = {
      queryString:keyword,
      ...data.field,
      pageno: 1,
      rowsize: 10,
    }
    for(let key in params){
      if(params[key]==='不限'||!params[key]){
        delete params[key]
      }
    }
    // console.log(params);
    getData(params)
    return false;
  });
})
 // 查询
function getData(params){
  var data={
    url:'search',
    type: 'get',
    data:params,
    cbName: 'cbSearch'
  }
  var cbData= function (res){
    // console.log('end',new Date());
    // console.log(res);
    // 请求成功更新全局配置数据
    if(res.queryPage.totalrows>0){
      $('.empty').hide()
      $('#pagination').show()
    } else{
      $('.empty').show()
      $('#pagination').hide()
    }
    params.total = res.queryPage.totalrows
    updateConfig(params)
    // updateConfig(params,res.queryPage.totalrows)
    config.base = res.getContextPath
    // console.log(res.getContextPath);
    const list = res.queryPage.list
    // console.log(list,1111);
    renderList(list)
    if(config.pageno===1){
      initLaypage()
    }
  }
  // console.log('start',new Date());
  ajaxJsonP(data,cbData)
}
// 渲染查询列表
function renderList(list){
  var html=""
  list.forEach(function(item){
    html += template(item)
  })
  document.querySelector('.section-list-box').innerHTML = html
}
$('.section-list-box').on('click','.section-list-item',function(e){
  // console.log($(this).data('url'));
  window.open(config.baseUrl+$(this).data('url'))
})
// $('.box2').on('click','.txt1',function(e){
//   // 跳转首页
//   window.location.href = window.location.origin+'/pc/search.html'
// })
// 列表模板
function template(obj){
  // console.log(obj);
  var item = obj.lksFieldsMap
  var str=`
  <div class="section-list-item" data-url="${item.linkStr&&item.linkStr.value}">
        <div class="section-list-title">
          <span class="section-list-icon"></span>
          <span class="section-title-text">${item.extendField4&&item.extendField4.value}</span>
        </div>
        <div class="section-list-desc">${item.fullText&&item.fullText.value} </div>
        <div class="section-list-option">
          <span class="section-list-label">所属单位：</span>
          <span class="section-value-company">${item.extendField1&&item.extendField1.value}</span>
          <span class="section-list-label">获奖年份：</span>
          <span class="section-value-year">${item.extendField3&&item.extendField3.value}</span>
          <span class="section-list-label">获奖等级：</span>
          <span class="section-value-year">${item.extendField2&&item.extendField2.value}</span>
        </div>
      </div>
  `
  return str
}
// 触发 submit
function clickSubmit(){
  document.querySelector('.submit-btn').click()
}
//获奖单位
// var demo1 = xmSelect.render({
//   el: '#demo1',
//   theme: {
//     color: 'rgba(25, 31, 36, 0.04)',
//   },
//   filterable: true,
//   delay: 500,
//   success: function(val){
//     console.log(val)
//   },
//   filterMethod: function(val, item, index, prop){
//     if(val == item.value){//把value相同的搜索出来
//       return true;
//     }
//     if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
//       return true;
//     }
//     return false;//不知道的就不管了
//   },
//   data: [
//     {name: '水果', value: 1, selected: true},
//     {name: '蔬菜', value: 2, selected: true},
//     {name: '桌子', value: 3},
//     {name: '北京', value: 4},
//   ]
// })
function initLaypage(){
  // 分页
  var laypage
  layui.use('laypage', function(){
    laypage = layui.laypage;
    laypage.render({
      elem: 'pagination',
      layout: ['count','limit','prev', 'page', 'next','skip'],
      count: config.total,
      limit: config.rowsize,
      limits:[10,20,30,40,50],
      theme:'#1E89FF',
      jump: function(obj, first){
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        //首次不执行
        if(!first){
          config.pageno = obj.curr
          config.rowsize = obj.limit
          var {queryString,pageno,rowsize}= config
          const params = {
            queryString,pageno,rowsize
          }
          getData(params)
        }
      }
    });
  });
}

function updateConfig(params){
  // config.pageno = params.pageno
  // config.rowsize = params.rowsize
  // config.queryString = params.queryString
  // config.total = total
  config = {...config,...params}
}