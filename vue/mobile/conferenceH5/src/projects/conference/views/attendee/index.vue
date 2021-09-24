<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 12:51:01
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-20 01:01:13
-->

<template>
  <div class="attendee-container" v-if="detailData">
    <div class="attendee-top">
      <div class="attendee-header">
        <div class="head-portrait">
          <img :src="headerPic(detailData)" alt="">
        </div>
        <dl>
          <dt>{{ detailData.fixAttributeCommonVO.attendeeName }}</dt>
          <dd>单位：{{ detailData.fixAttributeCommonVO.organizationName }}</dd>
          <dd>职务：{{ detailData.fixAttributeCommonVO.position ? detailData.fixAttributeCommonVO.position : '-' }}</dd>
          <dd>
            电话：{{ phoneShow? detailData.fixAttributeCommonVO.phone : phone }}
            <img :src="phoneShow ? hide :show" alt="" @click="phoneChange">
          </dd>
        </dl>
      </div>
      <div class="arrange-container">
        <div class="arrange">
          <div
            class="arrange-item"
            :class="!ele.isShow ? 'arrange-item-checked' : ''"
            v-for="(ele, index) in arrangeData"
            :key="index"
            @click="linkTo(ele)"
          >
            <img :src="ele.src" alt="">
            <span>{{ ele.text }}</span>
          </div>
        </div>
      </div>
      <div ref="mount">
        <ul class="info-container" :class="mount ? 'mount' : ''">
          <li
            v-for="(ele, index) in infoData"
            :key="index"
            :class="ele.checked ? 'info-item-checked' : ''"
            @click="infoTabsHandler(index)"
            v-show="ele.isShow"
          >
            {{ ele.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="subject-container" :class="buttonShow ? 'subject-container-checked' : ''">
      <div class="subject" v-if="infoIndex === 0">
        <div class="subject-item">
          <h3>基本信息</h3>
          <div class="subject-detail">
            <van-cell-group>
              <van-cell title="姓名" :value="detailData.fixAttributeCommonVO.attendeeName" border />
              <van-cell v-if="detailData.signFormConfigFormatVO.sex.showFlag" title="性别" :value="detailData.fixAttributeCommonVO.sexStr ? detailData.fixAttributeCommonVO.sexStr : '未选择'" border />
              <van-cell v-if="detailData.signFormConfigFormatVO.nation.showFlag" title="民族" :value="detailData.fixAttributeCommonVO.nationStr ? detailData.fixAttributeCommonVO.nationStr : '未选择'" border />
              <van-cell v-if="detailData.signFormConfigFormatVO.cardType.showFlag" title="证件类型" :value="detailData.fixAttributeCommonVO.cardTypeStr ? detailData.fixAttributeCommonVO.cardTypeStr : '未选择'" border />
              <van-cell v-if="detailData.signFormConfigFormatVO.cardNum.showFlag" title="证件号码" :value="detailData.fixAttributeCommonVO.cardNum ? detailData.fixAttributeCommonVO.cardNum : '未填写'" border />
              <van-cell title="手机号码" :value="detailData.fixAttributeCommonVO.phone" border />
            </van-cell-group>
          </div>
        </div>
        <div class="subject-item" v-if="detailData.signFormConfigFormatVO.photoUrl.showFlag">
          <div class="subject-detail id-photo">
            <dl>
              <dt>证件照</dt>
              <dd>
                证件要求：<br />电子版照片为近期免冠证件照，格式可以为jpg、png、bmp，大小为20k~200k，35x48毫米左右，相当于一寸照片。
              </dd>
            </dl>
            <div class="id-photo-detail">
              <img :src="detailData.signFormConfigFormatVO.photoUrl.downloadUrl" alt="" @click="showPic(detailData.signFormConfigFormatVO.photoUrl.downloadUrl)">
            </div>
          </div>
        </div>
        <div class="subject-item">
          <div class="subject-detail">
            <van-cell-group>
              <van-cell title="单位名称" v-if="detailData.signFormConfigFormatVO.organizationName.showFlag" :value="detailData.fixAttributeCommonVO.organizationName ? detailData.fixAttributeCommonVO.organizationName : '未填写'" border />
              <van-cell title="单位简称" v-if="detailData.signFormConfigFormatVO.organizationSortName.showFlag" :value="detailData.fixAttributeCommonVO.organizationSortName ? detailData.fixAttributeCommonVO.organizationSortName : '未填写'" border />
              <van-cell title="部门名称" v-if="detailData.signFormConfigFormatVO.deptName.showFlag" :value="detailData.fixAttributeCommonVO.deptName ? detailData.fixAttributeCommonVO.deptName : '未填写'" border />
              <van-cell title="部门简称" v-if="detailData.signFormConfigFormatVO.deptShortName.showFlag" :value="detailData.fixAttributeCommonVO.deptShortName ? detailData.fixAttributeCommonVO.deptShortName : '未填写'" border />
              <van-cell title="职务" v-if="detailData.signFormConfigFormatVO.position.showFlag" :value="detailData.fixAttributeCommonVO.position ? detailData.fixAttributeCommonVO.position : '未填写'" border />
              <van-cell title="职级" v-if="detailData.signFormConfigFormatVO.positionLevel.showFlag" :value="detailData.fixAttributeCommonVO.positionLevelStr ? detailData.fixAttributeCommonVO.positionLevelStr : '未选择'" border />
              <van-cell title="邮箱" v-if="detailData.signFormConfigFormatVO.email.showFlag" :value="detailData.fixAttributeCommonVO.email ? detailData.fixAttributeCommonVO.email : '未填写'" border />
              <van-cell title="参会人类型" v-if="detailData.signFormConfigFormatVO.honourFlag.showFlag" :value="detailData.fixAttributeCommonVO.honourFlag === 1 ? '主宾' : detailData.fixAttributeCommonVO.honourFlag === 0 ? '随员' : '未选择'" border />
              <div v-for="(eleChild, indexChild) in customInfos(detailData.signFormConfigFormatVO.baseInfos)" :key="indexChild">
                <div v-if="eleChild.type === 9" class="upload-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <img :src="elePic" alt="" @click="showPic(elePic)">
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="eleChild.type === 10" class="upload-file-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <a :href="elePic.downloadUrl" target="_blank">
                          <div class="upload-preview-detail">
                            <img :src="filePic(elePic.fileName)" alt="">
                            <span>{{ elePic.fileName }}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="custom-van-cell">
                  <van-cell
                    :title="eleChild.fieldLabel"
                    :value="eleChild.name ? eleChild.name : eleChild.type === 1 ? '未填写' : '未选择'"
                    border
                  />
                </div>
              </div>
            </van-cell-group>
          </div>
        </div>
        <div class="subject-item" v-if="detailData.tagVOs.length">
          <h3>标签</h3>
          <div class="tags">
            <ul class="tags-list">
              <li v-for="(ele, index) in detailData.tagVOs" :key="index">
                {{ ele.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="subject-item">
          <h3>会务安排</h3>
          <div class="subject-detail">
            <van-cell-group>
              <h4>需要服务</h4>
              <van-cell title="是否制证" v-if="detailData.signFormConfigFormatVO.cardFlag.showFlag" :value="detailData.signFormConfigFormatVO.cardFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.cardFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="是否用餐" v-if="detailData.signFormConfigFormatVO.bookDinnerFlag.showFlag" :value="detailData.signFormConfigFormatVO.bookDinnerFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.bookDinnerFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="是否住宿" v-if="detailData.signFormConfigFormatVO.bookStayFlag.showFlag" :value="detailData.signFormConfigFormatVO.bookStayFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.bookStayFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="是否需要协助订票" v-if="detailData.signFormConfigFormatVO.bookTicketFlag.showFlag" :value="detailData.signFormConfigFormatVO.bookTicketFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.bookTicketFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="预定类型" v-if="detailData.signFormConfigFormatVO.ticketFlag.showFlag" :value="detailData.signFormConfigFormatVO.ticketFlag.fieldValueStr ? detailData.signFormConfigFormatVO.ticketFlag.fieldValueStr : '未选择'" border />
              <div v-for="(eleChild, indexChild) in customInfos(detailData.signFormConfigFormatVO.reserveServices)" :key="indexChild">
                <div v-if="eleChild.type === 9" class="upload-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <img :src="elePic" alt="" @click="showPic(elePic)">
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="eleChild.type === 10" class="upload-file-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <a :href="elePic.downloadUrl" target="_blank">
                          <div class="upload-preview-detail">
                            <img :src="filePic(elePic.fileName)" alt="">
                            <span>{{ elePic.fileName }}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="custom-van-cell">
                  <van-cell
                    :title="eleChild.fieldLabel"
                    :value="eleChild.name ? eleChild.name : eleChild.type === 1 ? '未填写' : '未选择'"
                    border
                  />
                </div>
              </div>
            </van-cell-group>
          </div>
        </div>
        <div class="subject-item">
          <!-- <h3>行程信息</h3> -->
          <div class="subject-detail">
            <van-cell-group>
              <h4>往程信息</h4>
              <van-cell title="是否接站" v-if="detailData.signFormConfigFormatVO.pickUpFlag.showFlag" :value="detailData.signFormConfigFormatVO.pickUpFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.pickUpFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="到达时间" v-if="detailData.signFormConfigFormatVO.arriveTime.showFlag" :value="detailData.signFormConfigFormatVO.arriveTime.fieldValue ? detailData.signFormConfigFormatVO.arriveTime.fieldValue : '未选择'" border />
              <van-cell title="到达班次/车次" v-if="detailData.signFormConfigFormatVO.arriveFlight.showFlag" :value="detailData.signFormConfigFormatVO.arriveFlight.fieldValue ? detailData.signFormConfigFormatVO.arriveFlight.fieldValue : '未填写'" border />
              <van-cell title="达到地点" v-if="detailData.signFormConfigFormatVO.arriveStation.showFlag" :value="detailData.signFormConfigFormatVO.arriveStation.fieldValue ? detailData.signFormConfigFormatVO.arriveStation.fieldValue : '未填写'" border />
              <div v-for="(eleChild, indexChild) in customInfos(detailData.signFormConfigFormatVO.pickUpServices)" :key="indexChild">
                <div v-if="eleChild.type === 9" class="upload-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <img :src="elePic" alt="" @click="showPic(elePic)">
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="eleChild.type === 10" class="upload-file-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <a :href="elePic.downloadUrl" target="_blank">
                          <div class="upload-preview-detail">
                            <img :src="filePic(elePic.fileName)" alt="">
                            <span>{{ elePic.fileName }}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="custom-van-cell">
                  <van-cell
                    :title="eleChild.fieldLabel"
                    :value="eleChild.name ? eleChild.name : eleChild.type === 1 ? '未填写' : '未选择'"
                    border
                  />
                </div>
              </div>
            </van-cell-group>
          </div>
        </div>
        <div class="subject-item">
          <!-- <h3>行程信息</h3> -->
          <div class="subject-detail">
            <van-cell-group>
              <h4>返程信息</h4>
              <van-cell title="是否送站" v-if="detailData.signFormConfigFormatVO.pickOutFlag.showFlag" :value="detailData.signFormConfigFormatVO.pickOutFlag.fieldValue === '0' ? '否' : detailData.signFormConfigFormatVO.pickOutFlag.fieldValue === '1' ? '是' : '未选择'" border />
              <van-cell title="返程时间" v-if="detailData.signFormConfigFormatVO.returnTime.showFlag" :value="detailData.signFormConfigFormatVO.returnTime.fieldValue ? detailData.signFormConfigFormatVO.returnTime.fieldValue : '未选择'" border />
              <van-cell title="返程班次/车次" v-if="detailData.signFormConfigFormatVO.returnFlight.showFlag" :value="detailData.signFormConfigFormatVO.returnFlight.fieldValue ? detailData.signFormConfigFormatVO.returnFlight.fieldValue : '未填写'" border />
              <van-cell title="返程地点" v-if="detailData.signFormConfigFormatVO.returnStation.showFlag" :value="detailData.signFormConfigFormatVO.returnStation.fieldValue ? detailData.signFormConfigFormatVO.returnStation.fieldValue : '未填写'" border />
              <div v-for="(eleChild, indexChild) in customInfos(detailData.signFormConfigFormatVO.pickOutServices)" :key="indexChild">
                <div v-if="eleChild.type === 9" class="upload-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <img :src="elePic" alt="" @click="showPic(elePic)">
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="eleChild.type === 10" class="upload-file-custom">
                  <div v-if="typeof eleChild.name === 'undefined'">
                    <van-cell
                      :title="eleChild.fieldLabel"
                      :value="'未选择'"
                      border
                    />
                  </div>
                  <div v-else>
                    <h3>
                      {{ eleChild.fieldLabel }}
                    </h3>
                    <div class="upload-list">
                      <div v-for="(elePic,keyIndex) in eleChild.name" :key="keyIndex" class="upload-preview">
                        <a :href="elePic.downloadUrl" target="_blank">
                          <div class="upload-preview-detail">
                            <img :src="filePic(elePic.fileName)" alt="">
                            <span>{{ elePic.fileName }}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="custom-van-cell">
                  <van-cell
                    :title="eleChild.fieldLabel"
                    :value="eleChild.name ? eleChild.name : eleChild.type === 1 ? '未填写' : '未选择'"
                    border
                  />
                </div>
              </div>
            </van-cell-group>
          </div>
        </div>
      </div>
      <div class="agenda-container" v-if="agendaData && (infoIndex === 1)">
        <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
          <div class="title">{{ ele.date }} {{ getWeek(ele.date) }}</div>
          <div class="detail-container">
            <div
              v-for="(eleChild, eleIndex) in ele.children"
              :key="eleIndex"
              class="detail"
            >
              <div class="content" v-if="eleChild._checked">
                <div class="time">
                  <span class="time-detail">{{ eleChild.startTime }} - {{ eleChild.endTime }}</span>
                  <div class="tips">
                    <div class="recom" v-if="eleChild.recommend">{{ eleChild.recommend }}</div>
                    <div class="freeFlag" v-if="!eleChild.freeFlag">必选议程</div>
                  </div>
                  <!-- <div class="choice"><img :src="eleChild._checked ? chooseForbid : chooseDefault" alt=""></div> -->
                </div>
                <h4>{{ eleChild.name }}</h4>
                <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleChild.address }}</div>
                <div class="agenda-list" v-if="eleChild.children && agendaDataShowChild(eleChild.children)">
                  <div
                    v-for="(eleBrat, indexBrat) in agendaDataShow(eleChild.children)"
                    :key="indexBrat"
                    class="agenda-item"
                    :class="agendaChecked(ele.date, eleBrat.startTime, eleBrat.endTime, indexBrat)"
                  >
                    <div class="time">
                      <span class="time-detail">{{ eleBrat.startTime }} - {{ eleBrat.endTime }}</span>
                      <div class="tips">
                        <div class="recom" v-if="eleBrat.recommend">{{ eleBrat.recommend }}</div>
                        <div class="freeFlag" v-if="!eleBrat.freeFlag">必选议程</div>
                      </div>
                      <!-- <div class="choice"><img :src="eleBrat._checked ? chooseForbid : chooseDefault" alt=""></div> -->
                    </div>
                    <h4>{{ eleBrat.name }}</h4>
                    <div class="address"><img src="@/assets/images/place.svg" alt="">{{ eleBrat.address }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="locus-container" v-if="locusData && (infoIndex === 2)">
        <div v-for="(ele, index) in locusData" :key="index" class="agenda-list">
          <div class="title">{{ ele.date }}</div>
          <div class="detail-container">
            <div
              v-for="(eleChild, eleIndex) in ele.children"
              :key="eleIndex"
              class="detail"
            >
              <div class="content">
                <div class="agenda-list">
                  <div
                    class="agenda-item"
                  >
                    <div class="time">{{ eleChild.createTime.slice(-8,-3) }}</div>
                    <h4>{{ eleChild.title }}</h4>
                    <div class="address" v-html="locusContent(eleChild.changeContent)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!locusData.length">
          <van-empty
            v-if="!locusData.length"
            :image="dataNull"
            description="暂无活动轨迹"
          />
        </div>
      </div>
      <div class="accompany-container" v-if="infoIndex === 3">
        <div v-if="!attendeeData.length">
          <van-empty
            v-if="!attendeeData.length"
            :image="dataNull"
            description="暂无陪同人员"
          />
        </div>
        <div
          v-for="(ele, index) in attendeeData"
          :key="index"
          class="accompany-item"
        >
          <h4>{{ ele.name }}</h4>
          <ul>
            <li
              v-for="(eleChild, indexChild) in ele.attendeeAccompany"
              :key="indexChild"
            >
              <a :href="`tel:${eleChild.attendeeFixAttribute.phone}`">
                <div class="accompany-pic"><img :src="eleChild.ssoUserPhoto" alt=""></div>
                <dl>
                  <dt>{{ eleChild.attendeeFixAttribute.attendeeName }}</dt>
                  <dd>{{ eleChild.attendeeFixAttribute.organizationName }}</dd>
                  <dd class="pic"><img src="@/assets/images/attendeePhone.svg" alt=""></dd>
                </dl>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="single-btn-bottom" v-if="buttonShow">
      <van-button
        @click="$router.push({
          name: 'editAttendee',
          query: {
            [$enc('id')]: $enc(routeParams.conferenceId),
            [$enc('attendeeId')]: $enc(routeParams.attendeeId)
          }
        })"
      >修改</van-button>
      <van-button
        type="info"
        @click="$router.push({
          name: 'addLeave',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('attendeeId')]: $enc(routeParams.attendeeId),
            [$enc('attendeeName')]: $enc(detailData.fixAttributeCommonVO.attendeeName),

          }
        })"
      >请假</van-button>
    </div>
    <van-overlay :show="imgPreviewShow" z-index="999">
      <div class="images-preview-container">
        <!-- @click.stop -->
        <div class="images-preview">
          <img :src="imagesPreview.src" alt="">
        </div>
        <ul class="images-preview-btn">
          <li @click="imgPreviewShow = false" >关闭</li>
        </ul>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import show from '@/assets/images/show.svg'
import hide from '@/assets/images/hide.svg'
import attendeeCar from '@/assets/images/attendeeCar.svg'
import attendeeStay from '@/assets/images/attendeeStay.svg'
import attendeeMeal from '@/assets/images/attendeeMeal.svg'
import attendeeCard from '@/assets/images/attendeeCard.svg'
import web from '@/assets/images/Web.svg'
import video from '@/assets/images/video.svg'
import voice from '@/assets/images/voice.svg'
import ppt from '@/assets/images/ppt.svg'
import txt from '@/assets/images/txt.svg'
import folder from '@/assets/images/folder.svg'
import picture from '@/assets/images/picture.svg'
import excel from '@/assets/images/excel.svg'
import word from '@/assets/images/Word.svg'
import zip from '@/assets/images/Zip.svg'
import unknow from '@/assets/images/Unknow.svg'
import pdf from '@/assets/images/PDF.svg'
import chooseForbid from '@/assets/images/chooseForbid.svg'
import choose from '@/assets/images/choose.svg'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
import dataNull from '@/assets/images/dataNull.png'

export default {
  props: {
    routeParams: {
      Object
    }
  },
  data() {
    return {
      male, femaleSex, dataNull,
      mount: false,
      mountTop: 0,
      show, hide, attendeeCar, attendeeStay, attendeeMeal, attendeeCard, choose, chooseDefault, chooseForbid,
      web, video, voice, ppt, txt, folder, picture, excel, word, zip, unknow, pdf,
      fileType: [
        'web', 'video', 'voice', 'ppt', 'txt', 'folder', 'picture', 'excel', 'word', 'zip', 'unknow', 'pdf'
      ],
      // 图片预览开关
      imgPreviewShow: false,
      // 图片预览
      imagesPreview: {
        src: ''
      },
      // 详情数据
      detailData: null,
      // 电话号码是否全部显示
      phoneShow: false,
      arrangeData: [],
      infoData: [
        { text: '报名信息', checked: true, isShow: true },
        { text: '议程安排', checked: false, isShow: true },
        { text: '活动轨迹', checked: false, isShow: true },
        { text: '陪同人员', checked: false, isShow: false }
      ],
      // 选择的tab信息
      infoIndex: 0,
      // 议程信息
      agendaData: [],
      // 活动轨迹
      locusData: [],
      // 陪同列表
      attendeeData: [],
      // 标签
      labelData: [],
      // 性别
      sexData: [],
      // 职级
      levelData: [],
      // 证件类型
      cardTypeData: [],
      // 民族
      nationData: [],
      // 职级
      positionLevelData: [],
      // 底部按钮根据接口返回状态判断是否加载
      buttonShow: false
    }
  },
  computed: {
    headerPic() {
      return function(ele) {
        let result = ''
        if (ele.innerFlag === 1) {
          if (ele.ssoUserPhoto) {
            result = ele.ssoUserPhoto
          } else {
            result = ele.fixAttributeCommonVO.sex === '1' ? male : femaleSex
          }
        } else {
          result = ele.fixAttributeCommonVO.sex === '1' ? male : femaleSex
        }
        return result
      }
    },
    agendaDataShowChild() {
      return function(ele) {
        const res = this.recursAgendaChild(ele).length ? 'true' : false
        return res
      }
    },
    agendaDataShow() {
      return function(ele) {
        const data = []
        ele.forEach(eleChild => {
          if (eleChild._checked) {
            data.push(eleChild)
          }
        })
        return data
      }
    },
    // 处理自定义信息
    customInfos() {
      return function(data) {
        // console.log(22, data)
        const result = []
        data.map(ele => {
          if (ele.showFlag) {
            if (ele.type === 9) {
              if (ele.fieldValue) {
                const fieldValue = JSON.parse(ele.fieldValue)
                const name = []
                fieldValue.forEach(eleFile => {
                  name.push(`${eleFile.downloadUrl}`)
                  // name.push(`https://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/${eleFile.fileUrl}`)
                  // name.push(`${eleFile.downloadUrl}`)
                })
                ele.name = name
              }
            } else if (ele.type === 10) {
              if (ele.fieldValue) {
                const fieldValue = JSON.parse(ele.fieldValue)
                const name = []
                fieldValue.forEach(eleFile => {
                  // console.log(eleFile)
                  if (eleFile.fileName) {
                    name.push(eleFile)
                  } else {
                    name.push(eleFile.slice(eleFile.indexOf('attendeePhoto/') + 'attendeePhoto/'.length, eleFile.length))
                  }
                })
                ele.name = name
              }
            } else {
              if (ele.type === 6) {
                if (ele.fieldValue && ele.fieldValue !== 'null') {
                  const selectData = ele.signFormOptionVOs
                  ele.name = selectData.find(eleFind => String(eleFind.optionValue) === String(ele.fieldValue)).optionText
                }
              } else if (ele.type === 7) {
                if (ele.fieldValue && ele.fieldValue !== 'null') {
                  const fieldValue = Array.isArray(ele.fieldValue) ? ele.fieldValue : JSON.parse(ele.fieldValue)
                  const selectData = ele.signFormOptionVOs
                  const fieldValueStr = []
                  if (fieldValue) {
                    fieldValue.forEach(eleOption => {
                      const filterData = selectData.find(eleDetail => String(eleDetail.optionValue) === String(eleOption))
                      if (filterData) {
                        fieldValueStr.push(filterData.optionText)
                      }
                    })
                    ele.name = fieldValueStr.join(',')
                    // eleCustom.fieldValue = selectData.find(eleFind => String(eleFind.optionValue) === eleCustom.fieldValue).optionText
                  }
                }
              } else if (ele.type === 8) {
                if (ele.fieldValue && ele.fieldValue !== 'null') {
                  const selectData = ele.signFormOptionVOs
                  if (selectData && selectData.length) {
                    ele.name = selectData.find(eleFind => Number(eleFind.optionValue) === Number(ele.fieldValue)).optionText
                  }
                }
              } else {
                ele.name = Array.isArray(ele.fieldValue) ? ele.fieldValue.join() : ele.fieldValue
              }
            }
            result.push(ele)
          }
        })
        return result
      }
    },
    // 自定义文件根据上传文件自动加载对应图片
    filePic() {
      return function(type) {
        const nameArr = type.split('.')
        const name = nameArr[nameArr.length - 1]
        if (this.fileType.indexOf(name) !== -1) {
          return this[name]
          // this[name]
        } else {
          return this.unknow
        }
      }
    },
    // 活动轨迹详细内容处理
    locusContent() {
      return function(str) {
        let result = ''
        if (!str) {
          return result
        } else {
          const contentData = JSON.parse(str)
          contentData.forEach(ele => {
            if (ele.code === 'agenda') {
              if (ele.beforeValue) {
                result = `${result}${ele.attribute}变更 增加${ele.beforeValue.substr(0, ele.beforeValue.indexOf(';'))}<br />`
              }
              if (ele.afterValue) {
                result = `${result}${ele.attribute}变更 取消${ele.afterValue.substr(0, ele.afterValue.indexOf(';'))}<br />`
              }
            } else {
              result = `${result}${ele.attribute}变更 由${ele.beforeValue}变更为${ele.afterValue}<br />`
            }
            return result
          })
          return result
        }
      }
    },
    // 手机号码隐藏中间四位
    phone() {
      const phone = this.detailData.fixAttributeCommonVO.phone
      const result = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      return result
    },
    // 处理周信息
    getWeek() {
      return function(date) {
        const getDay = new Date(date).getDay()
        const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const week = weeks[getDay]
        const isToday = new Date().toString().substr(0, 15) === date.toString().substr(0, 15)
        return isToday ? '今天' : week
      }
    },
    // 根据时间线处理议程左侧线
    agendaChecked() {
      return function(date, startTime, endTime, index) {
        const nowTime = new Date().getTime()
        const sTime = new Date(`${date} ${startTime}`).getTime()
        const eTime = new Date(`${date} ${endTime}`).getTime()
        if (nowTime >= eTime) {
          return 'agenda-item-before agenda-item-after'
        } else if (nowTime >= sTime) {
          return 'agenda-item-before'
        } else {
          return ''
        }
      }
    }
  },
  created() {
    setTimeout(() => {
      window.addEventListener('scroll', this.scroll, false)
    })
    // console.log(this.routeParams)
    // const conferenceId = this.routeParams.conferenceId
    // const attendeeId = this.routeParams.attendeeId
    // 获取活动轨迹
    this.getLocus()
    // 获取陪同列表
    this.getAttendee()
    // 获取我的安排 ?
    // this.getMyPlan()
    // 查询当前用户审核状态
    this.getExamineStatus()
    const getData = async function() {
      // 获取标签列表
      await this.getLabel()
      // 获取性别
      await this.getSex()
      // 获取职位级别
      await this.getLevel()
      // 获取证件类型
      await this.getCardType()
      // 获取民族
      await this.getNation()
      // 获取参会人详情
      await this.getAttendeeDetail()
      // 获取议程
      this.getAddAgenda()
    }.bind(this)
    getData()
  },
  methods: {
    scroll(e) {
      e = e || window.e
      const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
      const top = this.$refs['mount'].offsetTop
      if (scrollTop >= top) {
        this.mount = true
      } else {
        this.mount = false
      }
      // console.log(scrollTop)
    },
    linkTo(ele) {
      if (ele.isShow) {
        this.$router.push({
          name: ele.link,
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
            [this.$enc('attendeeId')]: this.$enc(this.routeParams.attendeeId)
          }
        })
      }
    },
    // 图片查看详情
    showPic(pic) {
      this.imagesPreview = {
        src: pic
      }
      this.imgPreviewShow = true
    },
    // tab选项事件
    infoTabsHandler(index) {
      this.infoIndex = index
      this.infoData.forEach(ele => {
        ele.checked = false
      })
      this.infoData[index].checked = true
    },
    // agendaShow(index) {
    //   this.agendaData[index].checked = !this.agendaData[index].checked
    // },
    // 切换手机号码状态
    phoneChange() {
      this.phoneShow = !this.phoneShow
    },
    // 获取详情
    getAttendeeDetail() {
      return new Promise(resolve => {
        const attendeeId = this.routeParams.attendeeId
        this.$api({
          url: 'attendee.getAttendeeDetail',
          data: {
            id: attendeeId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            this.detailData = data
            // const detail = data.signFormConfigFormatVO
            // Object.keys(detail).forEach(ele => {
            //   if (detail[ele] && !Array.isArray(detail[ele])) {
            //     // console.log(detail[ele].showFlag, detail[ele].fieldLabel)
            //   }
            // })

            this.$nextTick(() => {
              this.mountTop = this.$refs['mount'].offsetTop
            })
            const cardType = data.fixAttributeCommonVO.cardType
            if (cardType) {
              data.fixAttributeCommonVO.cardTypeStr = this.cardTypeData.find(ele => ele.valCode === cardType).name
            }
            const nation = data.fixAttributeCommonVO.nation
            if (nation) {
              data.fixAttributeCommonVO.nationStr = this.nationData.find(ele => ele.valCode === nation).name
            }
            const positionLevel = data.fixAttributeCommonVO.positionLevel
            if (positionLevel) {
              data.fixAttributeCommonVO.positionLevelStr = this.positionLevelData.find(ele => ele.valCode === positionLevel).name
            }
            const sex = data.fixAttributeCommonVO.sex
            if (sex) {
              data.fixAttributeCommonVO.sexStr = this.sexData.find(ele => ele.valCode === sex).name
            }
            // if (data.vehicleStatus === 2) {
            const key = ['vehicleStatus', 'stayStatus', 'foodStatus', 'ticketStatus']
            const value = [{ text: '用车安排', src: attendeeCar, link: 'planCar', isShow: false },
              { text: '住宿安排', src: attendeeStay, link: 'planStay', isShow: false },
              { text: '用餐安排', src: attendeeMeal, link: 'planMeal', isShow: false },
              { text: '票证安排', src: attendeeCard, link: 'planCard', isShow: false }]
            for (let i = 0; i < key.length; i++) {
              if (this.detailData[key[i]] === 2) {
                value[i].isShow = true
              }
              this.arrangeData.push(value[i])
            }
            // }
            resolve()
          }
        })
      })
    },
    // 获取轨迹数据
    getLocus() {
      const conferenceId = this.routeParams.conferenceId
      const attendeeId = this.routeParams.attendeeId
      this.$api({
        url: 'attendee.getLocus',
        data: {
          conferenceId,
          attendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          for (let i = 0; i < data.length; i++) {
            data[i].checked = false
            data.changeContent = data.changeContent ? JSON.parse(data.changeContent) : ''
          }
          data[0].checked = true
          this.locusData = data
        }
      })
    },
    // 获取陪同列表
    getAttendee() {
      const attendeeId = this.routeParams.attendeeId
      this.$api({
        url: 'attendee.getAttendee',
        data: {
          attendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.attendeeData = data
          this.infoData[3].isShow = true
        }
      })
    },
    // 获取标签
    getLabel() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.id
        this.$api({
          url: 'dic.getLabel',
          data: {
            conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.list
            this.labelData = data
            resolve()
          }
        })
      })
    },
    // 获取性别
    getSex() {
      return new Promise(resolve => {
        this.$api({
          url: 'dic.getSex'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.name = ele.valName
            })
            this.sexData = data
            resolve()
          }
        })
      })
    },
    // 获取职位级别
    getLevel() {
      return new Promise(resolve => {
        this.$api({
          url: 'dic.getLevel'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.name = ele.valName
            })
            this.positionLevelData = data
            resolve()
          }
        })
      })
    },
    // 获取证件类型
    getCardType() {
      return new Promise(resolve => {
        this.$api({
          url: 'dic.getCardType'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.name = ele.valName
            })
            this.cardTypeData = data
            resolve()
          }
        })
      })
    },
    // 获取民族
    getNation() {
      return new Promise(resolve => {
        this.$api({
          url: 'dic.getNation'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.name = ele.valName
            })
            this.nationData = data
            resolve()
          }
        })
      })
    },
    recursAgendaChild(data) {
      const result = []
      const recursFunc = data => {
        if (!data) {
          return
        }
        data.forEach(ele => {
          if (ele.id) {
            if (this.detailData.agendaIds && this.detailData.agendaIds.find(eleFind => eleFind === ele.id)) {
              result.push(ele)
            }
          }
          if (ele.children) {
            recursFunc(ele.children)
          }
        })
      }
      recursFunc(data)
      return result
    },
    // 递归拿到所有的日程 放入数组内
    recursAgenda(data) {
      const result = []
      const recursFunc = data => {
        if (!data) {
          return
        }
        data.forEach(ele => {
          if (ele.id) {
            ele._checked = false
            result.push(ele)
            if (this.detailData.agendaIds && this.detailData.agendaIds.find(eleFind => eleFind === ele.id)) {
              ele._checked = true
            } else {
              delete data[ele]
            }
          }
          if (ele.children) {
            recursFunc(ele.children)
          }
        })
      }
      recursFunc(data)
      return result
    },
    // 获取议程
    getAddAgenda() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendee.getAddAgenda',
        data: {
          conferenceId,
          queryFlag: 1
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          // for (let i = 0; i < data.length; i++) {
          //   data[i].checked = false
          // }
          // data[0].checked = true
          this.recursAgenda(data)
          this.agendaData = data
        }
      })
    },
    // 查询当前用户审核状态
    getExamineStatus() {
      const attendeeId = this.routeParams.attendeeId
      this.$api({
        url: 'attendee.getExamineStatus',
        data: {
          // 1：报名审核，2：报名变更审核， 3：取消报名，4：行程变更，5：请假，50：用车资源分配，51：用餐资源分配，52：住宿资源分配，53：制证资源分配
          types: '1,2,3,4,5',
          attendeeIds: attendeeId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          if (data === 0) {
            /* 暂时将按钮隐藏 */
            this.buttonShow = true
          }
        }
      })
    }
    // getMyPlan() {
    //   const conferenceId = this.routeParams.conferenceId
    //   this.$api({
    //     url: 'attendee.getMyPlan',
    //     data: {
    //       conferenceId
    //     }
    //   }).then(res => {
    //     if (res.code === 2000) {
    //       const data = res.result
    //       // this.attendeeData = data
    //       // useVehicleFlag
    //       // arrangeData
    //     }
    //   })
    // }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scroll, false)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.attendee-container {
  height: 100%;
  background-color: #fff;
  .attendee-header {
    width: 100%;
    height: 182px;
    padding: 20px 16px 0;
    background: url('../../../../assets/images/attendeeHeaderBg.svg') repeat-x center;
    @include list(row,flex-start,initial);
    .head-portrait {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    dl {
      color: #fff;
      dt {
        font-size: 20px;
        font-weight: 500;
        line-height: 25px;
        margin-bottom: 10px;
      }
      dd {
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 4px;
        @include list(row,flex-start,center);
        img {
          margin-left: 12px;
        }
      }
    }
  }
  .arrange-container {
    width: 100%;
    padding: 0 16px;
    margin: -40px 0 16px;
    .arrange {
      width: 100%;
      height: 80px;
      background-color: #fff;
      border-radius: 12px;
      padding: 16px 10px 0;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
      .arrange-item {
        width: 25%;
        display: inline-block;
        text-align: center;
        color: rgba(25, 31, 36, 0.64);
        font-size: 13px;
        img {
          margin: 0 auto 10px;
        }
      }
      .arrange-item-checked {
        opacity: .3;
      }
    }
  }
  .info-container {
    width: 100%;
    height: 48px;
    padding: 21px 20px;
    @include list(row,space-around,center);
    border-bottom: 1px solid #e3e4e4;
    background-color: #fff;
    li {
      font-size: 15px;
    }
    .info-item-checked {
      font-size: 18px;
      font-weight: 500;
      color: rgba(30, 137, 255, 1);
      position: relative;
      &::after {
        content: '';
        display: block;
        width: calc(100% + 16px);
        height: 10px;
        position: absolute;
        left: -8px;
        bottom: -2px;
        background-color: rgba(30, 137, 255, 0.12);
      }
    }
  }
  .subject-container {
    width: 100%;
    // height: calc(100% - 286px);
    // position: fixed;
    // left: 0;
    // top: 286px;
    // overflow-y: scroll;
    background-color: #fff;
    padding-top: 10px;
    padding-bottom: 20px;
    .subject-item {
      padding: 0 12px;
      margin-bottom: 16px;
      > h3 {
        width: 100%;
        height: 54px;
        padding: 0 2px;
        font-size: 17px;
        font-weight: 500;
        @include list(row,flex-start,center);
        &::before {
          content: '';
          display: block;
          width: 3px;
          height: 16px;
          border-radius: 1px;
          background-color: rgba(16, 112, 255, 1);
          margin-right: 6px;
        }
      }
      .subject-detail {
        border-radius: 8px;
        .van-cell-group {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0px 1px 6px 0px rgb(0 0 0 / 12%);
          > h4 {
            font-weight: 500;
            font-size: 17px;
            line-height: 18px;
            padding: 15px 16px 4px;
          }
        }
        .van-cell {
          height: 53px;
          line-height: 53px;
          padding-top: 0;
          padding-bottom: 0;
          .van-cell__left-icon, .van-cell__right-icon {
            line-height: 53px;
          }
          .van-cell__title {
            font-size: 15px;
            color: rgba(25, 31, 36, 0.64);
            flex: inherit;
            margin-right: 10px;
            max-width: 40%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .van-cell__value {
            width: 100%;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              font-size: 15px;
              color: rgba(25, 31, 36, 1);
            }
          }
        }
      }
      .id-photo {
        width: 100%;
        height: 132px;
        box-shadow: 0px 1px 6px 0px rgb(0 0 0 / 12%);
        @include list(row,space-between,center);
        padding: 16px;
        dl {
          flex: 1;
        }
        dt {
          color: rgba(25, 31, 36, 0.64);
          margin-bottom: 18px;
          line-height: 18px;
        }
        dd {
          font-size: 12px;
          color: rgba(25, 31, 36, 0.48);
          line-height: 16px;
        }
        .id-photo-detail {
          width: 72px;
          height: 100px;
          overflow: hidden;
          margin-left: 20px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .subject-container-checked {
    padding-bottom: 64px;
  }
  .locus-container {
    width: 100%;
    .agenda-list {
      .title {
        width: 100%;
        height: 56px;
        @include list(row,flex-start,center);
        font-size: 16px;
        line-height: 56px;
        padding: 0 12px;
      }
      .detail {
        width: 100%;
        padding: 0 12px;
        margin-bottom: 12px;
        .content{
          padding: 16px;
          border-radius: 16px;
          background-color: #fff;
          .time {
            font-size: 13px;
            color: rgba(88, 110, 129, 1);
            line-height: 18px;
            margin-bottom: 16px;
          }
          h4 {
            font-size: 16px;
            line-height: 21px;
            margin-bottom: 8px;
          }
          .address {
            font-size: 13px;
            color: rgba(25, 31, 36, 0.56);
            line-height: 18px;
            @include list(row,flex-start,center);
            img {
              width: 10px;
              height: 12px;
              margin-right: 5px;
            }
          }
          .agenda-list {
            // padding-top: 28px;
            .agenda-item {
              padding: 0 0 32px 20px;
              position: relative;
              &::after {
                content: '';
                display: block;
                width: 2px;
                height: 100%;
                @include absolute(3px,'','',3px);
                background-color: rgba(236, 236, 236, 1);
              }
              &::before {
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                @include absolute(2px,'','',0,2);
                background-color: rgba(216, 216, 216, 1);
              }
              &:nth-last-of-type(1) {
                border-bottom: 0;
                padding-bottom: 0;
                &::after {
                  display: none;
                }
                .address::after {
                  display: none;
                }
              }
            }
            .agenda-item-before {
              &::before {
                background-color: rgba(3, 190, 28, 1);
              }
            }
            .agenda-item-after {
              &::after {
                background-color: rgba(3, 190, 28, 1);
              }
            }
            .address {
              &::after {
                content: '';
                display: block;
                width: 315px;
                height: 1px;
                background-color: rgba(25, 31, 36, 0.08);
                @include absolute('',-16px,16px,'');
              }
            }
          }
        }
      }
    }
  }
  .locus-container {
    .agenda-list {
      .detail-container {
        .detail {
          &:nth-last-of-type(1) {
            .content .agenda-list .agenda-item::after {
              display: none;
            }
          }
        }
        .content {
          padding: 0;
          .agenda-list {
            padding-top: 0;
            .agenda-item {
              &::before {
                background-color: #1e89ff;
              }
              &::after {
                content: '';
                display: block;
                width: 2px;
                height: 100%;
                @include absolute(6px,'','',3px);
                background-color: #1e89ff;
              }
              &:nth-last-of-type(1) {
                &::after {
                  display: block;
                }
              }
            }
          }
          .time {
            margin-bottom: 4px;
          }
        }
      }
      .detail {
        margin-bottom: 4px;
      }
    }
  }
  .agenda-container {
    width: 100%;
    .agenda-list {
      .title {
        width: 100%;
        height: 56px;
        @include list(row,flex-start,center);
        font-size: 16px;
        line-height: 56px;
        padding: 0 12px;
      }
      .detail {
        width: 100%;
        padding: 0 12px;
        margin-bottom: 12px;
        .content{
          padding: 16px;
          border-radius: 16px;
          background-color: #fff;
          .time {
            font-size: 13px;
            color: rgba(88, 110, 129, 1);
            line-height: 18px;
            margin-bottom: 16px;
            @include list(row, flex-start, center);
            position: relative;
            .tips {
              font-size: 10px;
              line-height: 14px;
              font-weight: 500;
              @include list(row, flex-start, center);
              div {
                border-radius: 3px;
                padding: 1px 3px;
              }
              .recom {
                color: rgba(255, 130, 0, 1);
                border: 1px solid rgba(255, 130, 0, 1);
                margin-left: 10px;
              }
              .freeFlag {
                color: rgba(159, 159, 159, 1);
                border: 1px solid rgba(159, 159, 159, 1);
                margin-left: 3px;
              }
            }
            .choice {
              @include absolute(0,0,'','');
            }
          }
          h4 {
            font-size: 16px;
            line-height: 21px;
            margin-bottom: 8px;
          }
          .address {
            font-size: 13px;
            color: rgba(25, 31, 36, 0.56);
            line-height: 18px;
            @include list(row,flex-start,center);
            img {
              width: 10px;
              height: 12px;
              margin-right: 5px;
            }
          }
          .agenda-list {
            padding-top: 28px;
            .agenda-item {
              padding: 0 0 32px 20px;
              position: relative;
              &::after {
                content: '';
                display: block;
                width: 2px;
                height: 100%;
                @include absolute(3px,'','',3px);
                background-color: rgba(236, 236, 236, 1);
              }
              &::before {
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                @include absolute(2px,'','',0,2);
                background-color: rgba(216, 216, 216, 1);
              }
              &:nth-last-of-type(1) {
                border-bottom: 0;
                padding-bottom: 0;
                &::after {
                  display: none;
                }
                .address::after {
                  display: none;
                }
              }
            }
            .agenda-item-before {
              &::before {
                background-color: rgba(3, 190, 28, 1);
              }
            }
            .agenda-item-after {
              &::after {
                background-color: rgba(3, 190, 28, 1);
              }
            }
            .address {
              &::after {
                content: '';
                display: block;
                width: 315px;
                height: 1px;
                background-color: rgba(25, 31, 36, 0.08);
                @include absolute('',-16px,16px,'');
              }
            }
          }
        }
      }
    }
  }
  .accompany-container {
    .accompany-item {
      h4 {
        padding: 13px 16px;
        font-size: 13px;
        color: rgba(25, 31, 36, 0.64);
      }
      li {
         width: 100%;
         height: 66px;
         padding: 12px 0 12px 16px;
         margin-bottom: 10px;
         a {
            color: rgba(25, 31, 36, 1);
            width: 100%;
            display: block;
            @include list(row, flex-start,center);
         }
         .accompany-pic {
           width: 40px;
           height: 40px;
           border-radius: 50%;
           overflow: hidden;
           margin-right: 16px;
           img {
             width: 100%;
             height: 100%;
           }
         }
         dl {
           width: 100%;
           position: relative;
          dt {
            font-size: 17px;
            font-weight: 500;
            line-height: 22px;
            margin-bottom: 2px;
          }
          dd {
            font-size: 14px;
            color: rgba(25, 31, 36, 0.56);
            line-height: 18px;
          }
          .pic {
            @include absolute(50%, 16px,'','');
            transform: translateY(-50%);
          }
          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            background-color: #e3e4e4;
            @include absolute('', 0,-14px,'');
          }
        }
      }
    }
  }
  .tags {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 10px 0;
    .tags-list {
      margin-left: -10px;
      li {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.8);
        display: inline-block;
        margin: 0 0 10px 10px;
        padding: 0 26px;
        background-color: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        position: relative;
        .van-icon {
          @include absolute(0,0,'','');
          font-weight: 500;
        }
      }
    }
    .tags-choice {
      width: 100%;
      height: 34px;
      border: 1px solid rgba(25, 31, 36, 0.12);
      @include list(row, center, center);
    }
  }
  .upload-custom {
    width: 100%;
    // padding-bottom: 17px;
    border-bottom: 1px solid #ebedf0;
    h3{
      padding: 17px 16px;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
      @include list(row,space-between,center);
      div {
        @include list(row,flex-start,center);
        flex: 1;
        margin-right: 10px;
      }
      i {
        display: block;
        color: red;
        margin-left: 4px;
      }
      span {
        font-size: 12px;
        line-height: 16px;
        color: rgba(25, 31, 36, 0.48);
      }
    }
    .upload-list {
      border-radius: 2px;
      overflow: hidden;
      padding-bottom: 17px;
      .upload-preview {
        float: left;
        width: 60px;
        height: 60px;
        border-radius: 2px;
        margin: 10px 0 0 10px;
        position: relative;
        .upload-del-btn {
          width: 20px;
          height: 20px;
          position: absolute;
          right: -5px;
          top: -5px;
          z-index: 2;
          border-radius: 50%;
          background-color: gainsboro;
          text-align: center;
          line-height: 20px;
          color: #666;
        }
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
        }
      }
      .upload-btn {
        float: left;
        width: 60px;
        height: 60px;
        margin: 10px 0 0 10px;
        .upload-btn-style {
          display: block;
          width: 60px;
          height: 60px;
          background-color: #F6F6F6;
          text-align: center;
          line-height: 60px;
          font-weight: 500;
          color: #DADADB;
          font-size: 20px;
        }
      }
    }
  }
  .upload-file-custom {
    width: 100%;
    // padding-bottom: 17px;
    border-bottom: 1px solid #ebedf0;
    h3{
      padding: 17px 16px;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
      @include list(row,space-between,center);
      div {
        @include list(row,flex-start,center);
        flex: 1;
        margin-right: 10px;
      }
      i {
        display: block;
        color: red;
        margin-left: 4px;
      }
      span {
        font-size: 12px;
        line-height: 16px;
        color: rgba(25, 31, 36, 0.48);
      }
    }
    .upload-btn {
      padding: 0 10px;
      @include list(row, flex-end,center);
    }
    .upload-btn-style {
      width: 200px;
      height: 38px;
    }
    a {
      color: #191f24;
    }
    .upload-preview {
      width: 100%;
      padding: 10px 10px 16px;
      @include list(row, space-between,center);
      .upload-preview-detail {
        @include list(row, flex-start,center);
        font-size: 16px;
        img {
          margin-right: 14px;
        }
      }
      .upload-del-btn {
        font-size: 18px;
      }
    }
  }
  .images-preview-container {
    width: 100%;
    height: 100%;
    position: absolute;
    @include absolute(0,'','',0);
    padding-bottom: 56px;
    @include list(row,center,center);
    .images-preview {
      width: 100%;
      max-height: 186px;
      img {
        width: 100%;
        max-height: 186px;
      }
    }
    .images-preview-btn {
      width: 100%;
      @include absolute('','',0,0);
      @include list(row,center,center);
      background-color: rgba(0, 0, 0, 0.8);
      li {
        width: 50%;
        line-height: 56px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        position: relative;
        &:nth-of-type(1) {
          &::after {
            content: '';
            display: block;
            width: 1px;
            height: 32px;
            background-color: rgba(255, 255, 255, 0.12);
            @include absolute(50%, 0,'','');
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .custom-van-cell {
    .van-cell {
      border-bottom: 1px solid #ebedf0;
    }
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
}
</style>
<style lang="scss" scoped>
.attendee-container::v-deep {
  .van-empty {
    position: inherit;
    transform: inherit;
    margin-top: 0;
    .van-empty__image {
      width: 176px;
      height: 103px;
    }
  }
}
</style>
