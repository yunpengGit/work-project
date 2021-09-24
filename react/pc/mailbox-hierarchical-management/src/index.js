/*
 * @Author: your name
 * @Date: 2020-10-27 15:23:04
 * @LastEditTime: 2020-11-23 15:14:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/js/includes'
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Page from './layouts/Page.jsx'
// react 中的严格模式: StrictMode
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <ConfigProvider locale={zhCN}><Page /></ConfigProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
