/*
 * @Author: your name
 * @Date: 2020-11-06 10:08:38
 * @LastEditTime: 2021-07-05 15:01:44
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\layouts\stylePage.js
 */
import styled from 'styled-components'
export const StylePage = styled.div`
  width: 100vw;
  height: 100vh;
  & > {
    .ant-layout {
      width: 100vw;
      min-height: 100vh;
      background-color: #fff;
      .ant-layout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px 0 10px;
        background-color: #fff;
        .logo {
          img {
            width: 192px;
            height: 56px;
          }
        }
        .userInfo {
          display: flex;
          align-items: center;
          .header {
            margin-right: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .info {
            display: flex;
            flex-direction: column;
            .nameEmail {
              font-size: 14px;
              color: #808695;
              line-height: 20px;
              text-shadow: 0px 2px 4px rgba(241, 241, 241, 0.5);
            }
            .company {
              font-size: 14px;
              font-weight: 400;
              color: #515a6e;
              line-height: 20px;
              text-shadow: 0px 2px 4px rgba(241, 241, 241, 0.5);
            }
          }
        }
      }
      .ant-layout-has-sider {
        height: calc(100vh - 64px);
        .ant-layout-content {
          overflow: auto;
        }
        .ant-layout-sider {
          overflow: hidden;
          &:hover {
            overflow-y: auto;
            overflow-x: hidden;
          }
        }
      }
    }
  }
`
