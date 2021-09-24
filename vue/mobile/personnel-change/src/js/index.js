/*
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-07 10:40:19
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-07 11:35:15
 */
// ! 修复引用问题 index.js:24 Uncaught TypeError: Cannot read property 'createElement' of undefined
Object.prototype.document = window.document;
Object.prototype.location = window.location;
var $ = require('zepto').$;
delete(Object.prototype.document);
delete(Object.prototype.location);

$(function(){
  // $('.name').on('focus',function(){
  //   $('.delete-icon').show();
  // })
  // $('.name').on('blur',function(){
  //   $('.delete-icon').hide();
  // })
  // $('.name').on('input',function(){
  //   // $('.delete-icon').show();
  // })
  $('.delete-icon').on('click',function(){
    $('.name').val('')
  })
  $('.nav-tab span').on('click',function(){
    $(this).siblings().removeClass('active')
    $(this).addClass('active')
  })
})