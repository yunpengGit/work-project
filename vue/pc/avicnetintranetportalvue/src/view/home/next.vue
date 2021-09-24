<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-27 11:01:15
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-28 18:01:41
-->
<template>
  <div class="next-home">
    <div class="main">
      <div class="top clearfix">
        <div class="left">
          <div class="todo">
            <Todo />
          </div>
          <div class="email">
            <Email />
          </div>
          <div class="application">
            <Application :height="ApplicationHeight" />
          </div>
        </div>
        <div class="right">
          <div class="notice">
            <Notice :type="type" />
          </div>
          <div class="schedule">
            <Schedule />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="information">
          <Information />
        </div>
      </div>
    </div>
    <Copyright />
  </div>
</template>

<script>
import Todo from './components/Todo'
import Email from './components/Email'
import Application from './components/Application'
import Notice from './components/Notice'
import Schedule from './components/Schedule'
import Information from './components/Information'
import Copyright from '@/components/copyright'
export default {
  name: 'Next',
  components: {
    Todo,
    Email,
    Notice,
    Schedule,
    Application,
    Information,
    Copyright
  },
  data () {
    return {
      type: 'noChange',
      ApplicationHeight: 133
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 1560px;
  margin:25px auto 52px;
  & > .top {
    & > div {
      float: left;
    }
    & > .left {
      width: 1034px;
      margin-right: 16px;
    }
    & > .right {
      width: 510px;
    }
  }
}
.email,
.application,
.schedule,
.information{
  margin-top: 16px;
}
</style>
<style lang="scss">
  /* 整体不变的字体大小重置 */
.next-home{
  .todo .home-todo{
    .focusWork{
      padding-top: 4px !important;
      .item {
        height: 69px;
        padding: 0 22px 0 20px !important;
        &:hover{
          background: rgba(73, 156, 248, 0.06);
        }
        .work {
          border-bottom: 1px solid rgba($color: #191F24, $alpha: 0.08);
          height: 100%;
          & > .left {
            padding-top: 14px;
            .info{
              margin-top: 6px !important;
            }
          }
          & > .right {
            width: 64px !important;
            padding-top: 0;
            text-align: right;
            span{
              display: inline-block;
              line-height: 69px;
            }
          }
        }
      }
    }
  }
  .notice .home-notice .notice-cont .item {
    display: flex;
    align-items: center;
    .title{
      flex: 1;
    }
  }
  .email .home-email .email-cont ul li:hover{
    background: rgba(73, 156, 248, 0.08);
  }
  .continer-box{
    font-size: 16px;
  }
  .information .home-information{
    .information-fix{
      &.continer-box-title{
        border: 0;
        &::before{
          top: 14px !important;
        }
      }
      height: 54px !important;
      line-height: 54px !important;
      .info-btn-notext,.info-btn{
        height: 54px !important;
      }
    }
    .information-cont .info-item{
      padding: 0 20px !important;
      padding-right: 35px !important;
      &:nth-child(3n){
        padding-right: 20px !important;
      }
    }
  }
}
.schedule .home-schedule{
  .schedule-cont{
    padding-top: 22px;
    height: calc(100% - 69px) !important;
    .calendar-box{
      height: 89px;
    }
    .schedule-list-box{
      height: calc(100% - 98px) !important;
    }
    .schedule-list .list .item {
      .left{
        font-family: "Helvetica";
      }
      .right .tip{
      justify-content: flex-end;
    }
    }
  }
  .content{
    padding: 0px !important;
    .day-list .item{
      margin: 7px 6px !important;
      .solar{
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
      }
    }
    .week-list {
      justify-content: space-around !important;
      .item{
        width: 36px !important;
      }
    }
  }
}
.todo,.notice{
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
}
.todo,.notice,.email,.application,.schedule,.information{
    border-radius: 4px;
    overflow: hidden;
}
/* 重置样式 */
.data-theme--mini{
  .todo,
  .notice{
    height: 480px;
  }
  .email{
    height: 176px;
  }
  .application{
    height: 187px;
  }
  .schedule{
    height: 380px;
  }
  .information{
    height: auto;
  }
  .todo .home-todo {
    .upcoming{
      padding-top: 10px !important;
      & > .item{
        height: 40px !important;
        line-height: 40px !important;
        .right{
          span{
            margin-left: 36px !important;
            &:first-child{
              margin-left: 0;
            }
          }
          .type{
            width: 70px !important;
          }
          .date{
            width: 82px !important;
          }
          .hide{
            width: 28px !important;
          }
        }
      }
    }
    .focusWork{
      .item {
        .work {
          & > .left {
            padding-top: 14px;
            .info {
              .date{
                width: 164px !important;
              }
              .doc{
                width: 568px;
              }
            }
          }
        }
      }
    }
  }
  .todo .home-todo .toBeRead > .item .right .date, .todo  .home-todo .done > .item .right .date {
    width: 146px !important;
  }
  .email .home-email .email-cont{
    box-sizing: border-box;
    padding-top: 9px;
    ul li{
      height: 34px !important;
      line-height: 34px !important;
      .right{
        span{
          margin-left: 36px !important;
          &:first-child{
            margin-left: 0;
          }
        }
        .name{
          width: 70px !important;
        }
        .date{
          width: 82px !important;
        }
        .readed{
          width: 28px !important;
        }
      }
    }
  }
  .application .home-application .cont .el-carousel .el-carousel__container .el-carousel__item .item{
    padding-top: 16px !important;
    .text{
      margin-top: 5px !important;
    }
  }
  .notice .home-notice .notice-cont{
    padding-top: 10px !important;
  }
  .schedule .home-schedule{
    .schedule-cont .schedule-list-box .schedule-list .list .item .right{
    .info{
      padding-top: 10px;
      justify-content: flex-start !important;
    }
  }
  }
  .information {
    overflow-y: hidden;
    .home-information .information-cont {
      padding-top: 15px;
      .info-item{
        padding-bottom: 34px !important;
        .info-item-title{
          background: #F9F9F9;
          margin-bottom: 11px;
        }
        .info-item-cont-list{
          margin-top: 10px !important;
          li{
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }

  }
}
.el-tooltip__popper{
  font-size: 14px !important;
  padding: 4px 6px !important;
}
.data-theme--small{
  /* 整体字体重置 */
  .next-home{
    /* 占位提示文字 */
    .home-application-empty,
    .home-todo .upcoming .empty,
    .home-todo .focusWork .empty,
    .home-email .email-cont .empty{
      font-size: 14px !important;
    }
    .application .home-application .cont .el-carousel .el-carousel__container .el-carousel__item .item{
      font-size: 14px !important;
    }
    .home-schedule .schedule-cont .schedule-list-box .schedule-list .empty .current{
      font-size: 14px !important;
    }
    .schedule .home-calendar{
      .content {
        .week-list,
        .day-list .item .solar{
          font-size: 14px !important;
        }
        .day-list .item .lunar{
          font-size: 12px !important;
        }
      }
      .schedule-cont .schedule-list-box .schedule-list .list .item{
        .left{
          font-size: 16px !important;
        }
        .right {
          .info{
            .name-address{
              font-size: 14px !important;
            }
          }
        }
      }
    }
    .information .home-information .information-cont .info-item{
      font-size: 14px !important;
    }
  }

  /*  */
  .todo,
  .notice{
    height: 499px;
  }
  .email{
    height: 188px;
  }
  .application{
    height: 187px;
  }
  .schedule{
    height: 391px;
  }
  .information{
    height: auto;
  }
  .todo .home-todo {
    .upcoming{
      padding-top: 12px !important;
      & > .item{
        height: 42px !important;
        line-height: 42px !important;
        .right{
          span{
            margin-left: 36px !important;
            &:first-child{
              margin-left: 0;
            }
          }
          .type{
            width: 80px !important;
          }
          .date{
            width: 94px !important;
          }
          .hide{
            width: 32px !important;
          }
        }
      }
    }
    .focusWork{
      .item {
        .work {
          & > .left {
            padding-top: 12px;
            .info {
              .date{
                width: 186px !important;
              }
              .doc{
                flex-basis: auto;
                flex-grow: 0;
                flex-shrink: 1;
                width: 568px;
              }
            }
          }
        }
      }
    }
  }
  .todo .home-todo .toBeRead > .item .right .date, .todo  .home-todo .done > .item .right .date {
    width: 162px !important;
  }
  .email .home-email .email-cont{
    box-sizing: border-box;
    padding-top: 9px;
    ul li{
      height: 38px !important;
      line-height: 38px !important;
      .right{
        span{
          margin-left: 36px !important;
          &:first-child{
            margin-left: 0;
          }
        }
        .name{
          width: 80px !important;
        }
        .date{
          width: 94px !important;
        }
        .readed{
          width: 32px !important;
        }
      }
    }
  }
  .application .home-application .cont .el-carousel .el-carousel__container .el-carousel__item .item{
    padding-top: 16px !important;
    .text{
      margin-top: 5px !important;
    }
  }
  .notice .home-notice .notice-cont{
    padding-top: 12px !important;
    .item .title{
      height: 42px;
      line-height: 42px;
    }
  }
  .schedule .home-schedule .schedule-cont .schedule-list-box .schedule-list .list .item .right{
    height: 74px;
    .info{
      display: block !important;
      padding-top: 12px !important;
      .title{
        height: 21px;
        line-height: 21px;
      }
      .name-address{
        margin-top: 10px !important;
      }
    }
    .tip{
      font-size: 14px !important;
    }
  }
  .information {
    overflow-y: hidden;
    .home-information .information-cont {
      padding-top: 15px;
      .info-item{
        padding-bottom: 34px !important;
        .info-item-title{
          background: #F9F9F9;
          margin-bottom: 11px;
        }
        .info-item-cont-list{
          margin-top: 10px !important;
          li{
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
  }
}
</style>

