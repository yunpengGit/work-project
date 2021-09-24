<!--
 * @Author: your name
 * @Date: 2021-07-07 16:13:18
 * @LastEditTime: 2021-09-10 01:34:04
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
-->
<template>
  <div class="add-attendee-container">
    <!-- 顶部tab -->
    <van-tabs v-model="tabIndex" v-if="tabsData.length > 1">
      <van-tab :title="ele.text" v-for="(ele, index) in tabsData" :key="index"></van-tab>
    </van-tabs>
    <div class="main-container" v-if="param" :style="{ 'padding-top': tabsData.length > 1 ? '54px' : '0' }">
      <!-- 基本信息 -->
      <div class="add-attendee" v-show="tabIndex === 0 && param">
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(1)" :key="index">
              <van-field
                :class="[ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone' ? 'read-only' : '']"
                :readonly="ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone'"
                v-if="ele.type === 1 && ele.fieldCode !== 'phone' && ele.fieldCode === 'cardNum'"
                :maxlength="18"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                :class="[ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone' ? 'read-only' : '']"
                :readonly="ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone'"
                v-if="ele.type === 1 && ele.fieldCode !== 'phone' && ele.fieldCode !== 'cardNum'"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                :class="[ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone' ? 'read-only' : '']"
                :readonly="ele.fieldCode === 'attendeeName' || ele.fieldCode === 'phone'"
                v-if="ele.type === 1 && ele.fieldCode === 'phone'"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                maxlength="11"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div class="pic-upload-list-title">
                  <span
                    >{{ ele.fieldLabel
                    }}<i style="color: #ee0a24; margin-left: 4px">{{ ele.requireFlag === 1 ? '*' : '' }}</i></span
                  >
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader
                    v-show="!fileList.length"
                    v-model="fileList"
                    :preview-image="false"
                    :before-read="beforeReadPic(ele, 'single')"
                  >
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" @click="basicPicPreview(ele)" alt="" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="ele.signFormFieldRuleVO?ele.signFormFieldRuleVO.titleMsessage?ele.signFormFieldRuleVO.titleMsessage:`请输入${ele.fieldLabel}`:`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
            </div>
            <div v-for="ele in basicSingleData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectSingleChange(ele)"
              />
            </div>
            <div v-for="ele in basicMultipleData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectMultipleChange(ele)"
              />
            </div>
            <div v-for="ele in basicOptionData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectOptionChange(ele)"
              />
            </div>
            <div v-for="(ele, index) in basicPicData(1)" :key="ele.id" class="upload-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomPic[0][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}张</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomPic[0][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-del-btn" @click="delUploadedPic(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[0][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomPic[0][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :before-read="beforeReadPic(ele, 0, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                  >
                    <div class="upload-btn-style">+</div>
                  </van-uploader>
                </div>
              </div>
            </div>
            <div v-for="(ele, index) in basicFileData(1)" :key="ele.id" class="upload-file-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomFile[0][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}个</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomFile[0][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-preview-detail">
                    <img :src="filePic(elePic)" alt="" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn" @click="delUploadedFile(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[0][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomFile[0][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
                    :before-read="beforeReadFile(ele, 0, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                    accept="*"
                  >
                    <van-button plain hairline type="info" class="upload-btn-style">上传附件</van-button>
                  </van-uploader>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-form>
      </div>
      <!-- 行程信息 -->
      <div v-show="tabIndex === 1 && param">
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(2)" :key="index">
              <van-field
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择${ele.fieldLabel}`"
                input-align="right"
                right-icon="arrow"
                @click="timeChoice(ele)"
              />
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div class="pic-upload-list-title">
                  <span
                    >{{ ele.fieldLabel
                    }}<i style="color: #ee0a24; margin-left: 4px">{{ ele.requireFlag === 1 ? '*' : '' }}</i></span
                  >
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader v-model="fileList" :preview-image="false" :before-read="beforeReadPic(ele, 'single')">
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" @click="basicPicPreview(ele)" alt="" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="ele.signFormFieldRuleVO?ele.signFormFieldRuleVO.titleMsessage?ele.signFormFieldRuleVO.titleMsessage:`请输入${ele.fieldLabel}`:`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
            </div>
            <div v-for="ele in basicSingleData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectSingleChange(ele)"
              />
            </div>
            <div v-for="ele in basicMultipleData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectMultipleChange(ele)"
              />
            </div>
            <div v-for="ele in basicOptionData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectOptionChange(ele)"
              />
            </div>
            <div v-for="(ele, index) in basicPicData(2)" :key="ele.id" class="upload-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomPic[1][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}张</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomPic[1][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-del-btn" @click="delUploadedPic(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[1][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomPic[1][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :before-read="beforeReadPic(ele, 1, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                  >
                    <div class="upload-btn-style">+</div>
                  </van-uploader>
                </div>
              </div>
            </div>
            <div v-for="(ele, index) in basicFileData(2)" :key="ele.id" class="upload-file-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomFile[1][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}个</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomFile[1][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-preview-detail">
                    <img :src="filePic(elePic)" alt="" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn" @click="delUploadedFile(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[1][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomFile[1][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
                    :before-read="beforeReadFile(ele, 1, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                    accept="*"
                  >
                    <van-button plain hairline type="info" class="upload-btn-style">上传附件</van-button>
                  </van-uploader>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-form>
        <!-- 去程信息 -->
        <div class="departure-info">去程信息</div>
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(3)" :key="index">
              <van-field
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择${ele.fieldLabel}`"
                input-align="right"
                right-icon="arrow"
                @click="timeChoice(ele)"
              />
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div class="pic-upload-list-title">
                  <span
                    >{{ ele.fieldLabel
                    }}<i style="color: #ee0a24; margin-left: 4px">{{ ele.requireFlag === 1 ? '*' : '' }}</i></span
                  >
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader v-model="fileList" :preview-image="false" :before-read="beforeReadPic(ele, 'single')">
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" @click="basicPicPreview(ele)" alt="" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="ele.signFormFieldRuleVO?ele.signFormFieldRuleVO.titleMsessage?ele.signFormFieldRuleVO.titleMsessage:`请输入${ele.fieldLabel}`:`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
            </div>
            <div v-for="ele in basicSingleData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectSingleChange(ele)"
              />
            </div>
            <div v-for="ele in basicMultipleData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectMultipleChange(ele)"
              />
            </div>
            <div v-for="ele in basicOptionData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectOptionChange(ele)"
              />
            </div>
            <div v-for="(ele, index) in basicPicData(3)" :key="ele.id" class="upload-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomPic[2][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}张</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomPic[2][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-del-btn" @click="delUploadedPic(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[2][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomPic[2][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :before-read="beforeReadPic(ele, 2, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                  >
                    <div class="upload-btn-style">+</div>
                  </van-uploader>
                </div>
              </div>
            </div>
            <div v-for="(ele, index) in basicFileData(3)" :key="ele.id" class="upload-file-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomFile[2][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}个</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomFile[2][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-preview-detail">
                    <img :src="filePic(elePic)" alt="" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn" @click="delUploadedFile(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[2][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomFile[2][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
                    :before-read="beforeReadFile(ele, 2, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                    accept="*"
                  >
                    <van-button plain hairline type="info" class="upload-btn-style">上传附件</van-button>
                  </van-uploader>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-form>
        <!-- 返程信息 -->
        <div class="departure-info">返程信息</div>
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(4)" :key="index">
              <van-field
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择${ele.fieldLabel}`"
                input-align="right"
                right-icon="arrow"
                @click="timeChoice(ele)"
              />
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div class="pic-upload-list-title">
                  <span
                    >{{ ele.fieldLabel
                    }}<i style="color: #ee0a24; margin-left: 4px">{{ ele.requireFlag === 1 ? '*' : '' }}</i></span
                  >
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader v-model="fileList" :preview-image="false" :before-read="beforeReadPic(ele, 'single')">
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" @click="basicPicPreview(ele)" alt="" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="ele.signFormFieldRuleVO?ele.signFormFieldRuleVO.titleMsessage?ele.signFormFieldRuleVO.titleMsessage:`请输入${ele.fieldLabel}`:`请输入${ele.fieldLabel}`"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
              />
            </div>
            <div v-for="ele in basicSingleData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectSingleChange(ele)"
              />
            </div>
            <div v-for="ele in basicMultipleData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectMultipleChange(ele)"
              />
            </div>
            <div v-for="ele in basicOptionData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectOptionChange(ele)"
              />
            </div>
            <div v-for="(ele, index) in basicPicData(4)" :key="ele.id" class="upload-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomPic[3][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}张</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomPic[3][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-del-btn" @click="delUploadedPic(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[3][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomPic[3][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :before-read="beforeReadPic(ele, 3, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                  >
                    <div class="upload-btn-style">+</div>
                  </van-uploader>
                </div>
              </div>
            </div>
            <div v-for="(ele, index) in basicFileData(4)" :key="ele.id" class="upload-file-custom">
              <h3>
                <div>
                  {{ ele.fieldLabel }}
                  <i v-if="ele.requireFlag">*</i>
                </div>
                <span>{{ uploadCustomFile[2][index].length }}/{{ ele.signFormFieldRuleVO.uploadCount }}个</span>
              </h3>
              <div class="upload-list">
                <div v-for="(elePic, keyIndex) in uploadCustomFile[3][index]" :key="keyIndex" class="upload-preview">
                  <div class="upload-preview-detail">
                    <img :src="filePic(elePic)" alt="" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn" @click="delUploadedFile(index, keyIndex, ele)">
                    <van-icon name="cross" />
                  </div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[3][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    v-model="uploadCustomFile[3][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
                    :before-read="beforeReadFile(ele, 3, index)"
                    :multiple="ele.signFormFieldRuleVO.uploadCount > 1 ? true : false"
                    accept="*"
                  >
                    <van-button plain hairline type="info" class="upload-btn-style">上传附件</van-button>
                  </van-uploader>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-form>
      </div>
      <!-- 议程信息 -->
      <div v-show="tabIndex === 2 && param">
        <van-notice-bar mode="closeable" color="#785900" wrapable background="#FFF8E4">
          请选择您要添加的议程
        </van-notice-bar>
        <div class="agenda-container" v-if="agendaData">
          <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
            <div class="title" @click="agendaShow(index)">
              {{ ele.date }} {{ getWeek(ele.date)
              }}<img v-if="ele.checked" src="@/assets/images/arrowDown.svg" alt="" /><img
                v-if="!ele.checked"
                src="@/assets/images/arrowRight.svg"
                alt=""
              />
            </div>
            <div class="detail-container" v-if="ele.checked">
              <div v-for="(eleChild, eleIndex) in ele.children" :key="eleIndex" class="detail">
                <div class="content">
                  <div class="time">
                    <span class="time-detail">{{ eleChild.startTime }} - {{ eleChild.endTime }}</span>
                    <div class="tips">
                      <div class="recom" v-if="eleChild.recommend">{{ eleChild.recommend }}</div>
                      <div class="freeFlag" v-if="!eleChild.freeFlag">必选议程</div>
                    </div>
                    <div class="choice" @click="choiceAgenda(ele, eleChild)" :class="eleChild._ban ? 'choice-ban' : ''">
                      <img v-if="!eleChild.freeFlag" :src="chooseForbid" alt="" />
                      <div v-else v-show="!eleChild._ban">
                        <img :src="eleChild._checked ? choose : chooseDefault" alt="" />
                      </div>
                    </div>
                  </div>
                  <h4>{{ eleChild.name }}</h4>
                  <div class="agenda-list" v-if="eleChild.children">
                    <div
                      v-for="(eleBrat, indexBrat) in eleChild.children"
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
                        <div
                          class="choice"
                          @click="choiceAgenda(ele, eleBrat)"
                          :class="eleBrat._ban ? 'choice-ban' : ''"
                        >
                          <img v-if="!eleBrat.freeFlag" :src="chooseForbid" alt="" />
                          <div v-else v-show="!eleBrat._ban">
                            <img :src="eleBrat._checked ? choose : chooseDefault" alt="" />
                          </div>
                        </div>
                      </div>
                      <h4>{{ eleBrat.name }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="page-bottom">
      <!-- <van-button type="default" @click="submitWhile">暂存</van-button> -->
      <van-button type="default" @click="prev" v-if="tabIndex !== 0">上一步</van-button>
      <van-button type="info" @click="submit">{{
        tabIndex === tabsData.length - 1 ? '确认提交' : '下一步'
      }}</van-button>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <van-popup
      v-model="popupShow"
      position="bottom"
      :style="{ width: '100%', minHeight: '40%', maxHeight: '60%' }"
      round
      @close="popupClose"
      v-if="param"
    >
      <div class="popup-choice-container">
        <div class="popup-choice">
          <van-radio-group v-for="(ele, index) in basicSingleData(groupIndex)" :key="index" v-model="ele.fieldValueStr">
            <van-cell-group v-if="ele._showFlag">
              <van-cell
                v-for="(eleChild, indexChild) in ele.signFormOptionVOs"
                :key="indexChild"
                :title="eleChild.optionText"
                @click="singleChoice(ele, eleChild)"
              >
                <template #right-icon>
                  <van-radio :name="eleChild.optionText" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <van-checkbox-group v-model="multipleResult" v-if="multipleSeq">
            <van-cell-group>
              <van-cell
                v-for="(eleChild, indexChild) in multipleData"
                :key="indexChild"
                clickable
                :title="eleChild.optionText"
                @click="toggle(indexChild)"
              >
                <template #right-icon>
                  <van-checkbox :name="eleChild.optionText" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
      <div class="popup-btn" @click="popupComfire"><van-button type="default">确认</van-button></div>
    </van-popup>
    <van-popup v-model="timeShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker
        show-toolbar
        :title="timeTitle"
        :columns="timeData"
        @confirm="timeComfire"
        @cancel="timeShow = false"
      />
    </van-popup>
    <van-overlay :show="imgPreviewShow" z-index="999">
      <div class="images-preview-container">
        <!-- @click.stop -->
        <div class="images-preview">
          <img :src="imagesPreview.src" alt="" />
        </div>
        <ul class="images-preview-btn">
          <li @click="imgPreviewShow = false">关闭</li>
          <li @click="delPic">删除</li>
        </ul>
      </div>
    </van-overlay>
    <van-popup
      v-model="attendantShow"
      position="bottom"
      :style="{ width: '100%', height: '40%' }"
      round
      @close="attendantClose"
    >
      <div class="attendant-container">
        <h3 @click="attendantShow = false">
          <div><van-icon name="arrow-left" /><span>返回</span></div>
        </h3>
        <van-search v-model="attendantVal" placeholder="请输入主宾人姓名" @search="attendantSearch" />
        <div class="attendant-result-container" v-if="attendantResult.length">
          <div
            class="attendant-result"
            v-for="(ele, index) in attendantResult"
            :key="index"
            @click="choiceAttendant(index)"
          >
            <div class="name">
              {{ ele.fixAttributeCommonVO.attendeeName }} - <span>{{ ele.fixAttributeCommonVO.organizationName }}</span>
            </div>
            <div class="phone">{{ ele.fixAttributeCommonVO.phone }}</div>
            <i />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
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

export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      web,
      video,
      voice,
      ppt,
      txt,
      folder,
      picture,
      excel,
      word,
      zip,
      unknow,
      pdf,
      chooseForbid,
      choose,
      chooseDefault,
      // 随员选择弹窗
      attendantShow: false,
      // 随员选择人
      attendantVal: '',
      // 随员搜索结果
      attendantResult: [],
      fileType: ['web', 'video', 'voice', 'ppt', 'txt', 'folder', 'picture', 'excel', 'word', 'zip', 'unknow', 'pdf'],
      fileIndex: 0,
      // 图片预览开关
      imgPreviewShow: false,
      // 图片预览
      imagesPreview: {
        index: null,
        indexChild: null,
        ele: null,
        src: '',
        // 是否通过自定义点击查看的
        customFlag: true
      },
      // 时间选择
      timeShow: false,
      timeTitle: '请选择',
      timeData: [],
      timeIndex: null,
      // 自定义上传文件
      uploadCustomFile: [],
      // 自定义上传图片
      uploadCustomPic: [],
      // 基本信息上传图片
      fileList: [],
      // 当前多选框所选的seq
      multipleSeq: null,
      // 当前选的是哪个 1 2 3 4
      groupIndex: null,
      // 当前所选的
      multipleResult: [],
      multipleData: [],
      // 当前打开的是否是自定义下拉框
      optionFlag: null,
      actionShow: false,
      popupShow: false,
      actions: [],
      // 当前选的tab项
      tabIndex: 0,
      // 性别选项
      sexData: [],
      // 级别选项
      positionLevelData: [],
      // 证件类型选项
      getCardTypeData: [],
      // 民族选项
      nationData: [],
      // 参会人类型
      honourFlagData: [
        { name: '主宾', dicCode: 'honourFlag', valCode: '1' },
        { name: '随员', dicCode: 'honourFlag', valCode: '0' }
      ],
      // 是否用餐
      bookDinnerFlagData: [
        { name: '是', dicCode: 'bookDinnerFlag', valCode: 1 },
        { name: '否', dicCode: 'bookDinnerFlag', valCode: 0 }
      ],
      // 是否住宿
      bookStayFlagData: [
        { name: '是', dicCode: 'bookStayFlag', valCode: 1 },
        { name: '否', dicCode: 'bookStayFlag', valCode: 0 }
      ],
      // 是否接站
      pickUpFlagData: [
        { name: '是', dicCode: 'pickUpFlag', valCode: 1 },
        { name: '否', dicCode: 'pickUpFlag', valCode: 0 }
      ],
      // 是否送站
      pickOutFlagData: [
        { name: '是', dicCode: 'pickOutFlag', valCode: 1 },
        { name: '否', dicCode: 'pickOutFlag', valCode: 0 }
      ],
      // 是否预定机票/车票/船票
      ticketFlagData: [
        { name: '去程', dicCode: 'ticketFlag', valCode: 1 },
        { name: '返程', dicCode: 'ticketFlag', valCode: 2 },
        { name: '往返', dicCode: 'ticketFlag', valCode: 3 }
      ],
      // 是否制证
      cardFlagData: [
        { name: '是', dicCode: 'cardFlag', valCode: 1 },
        { name: '否', dicCode: 'cardFlag', valCode: 0 }
      ],
      // 是否需要协助订票
      bookTicketFlagData: [
        { name: '是', dicCode: 'bookTicketFlag', valCode: 1 },
        { name: '否', dicCode: 'bookTicketFlag', valCode: 0 }
      ],
      // 当前弹窗选择的是哪个
      actionType: '',
      // 通过输入姓名和手机号验证参会状态
      userId: '',
      // 证件照
      photoUrl: '',
      param: null,
      params: {
        // 商密网内部用户标识 1 是 0 否
        innerFlag: '',
        userId: '',
        conferenceId: '',
        // 0 → 暂存 1 → 提交
        submitFlag: 0,
        // 1：后台录入，2：自主报名，3:企业联系人录入
        sourceType: '3',
        // 用户名
        attendeeName: '段子腾',
        // 手机号
        mobile: '18865310610',
        // 性别
        sex: '男',
        // 公司名称
        organizationName: '单位名称',
        // 公司简称
        organizationShortName: '',
        // 民族
        nation: '',
        // 职务
        position: '',
        // 参会人照片地址
        photoUrl: '',
        // 邮箱
        email: '',
        // 公司编码
        organizationCode: '',
        // 是否住宿 0 否 1 是
        bookStayFlag: '',
        // 是否用餐
        bookDinnerFlag: '',
        // 是否送站
        pickOutFlag: '',
        // 是否接站
        pickUpFlag: '',
        // 证件类型
        cardType: '',
        // 证件编号
        cardNum: '',
        // 参会人类型
        honourFlag: '',
        // 主宾id
        honour: '',
        // 是否制证
        cardFlag: '',
        // 是否订票
        bookTicketFlag: '',
        // 出发事件
        leaveTime: '',
        // 出发航班
        leaveFlight: '',
        // 出发机场
        leaveStation: '',
        // 到达时间
        arriveTime: '',
        // 到达航班
        arriveFlight: '',
        // 到达机场
        arriveStation: ''
      },
      // 必传参数
      paramsRequire: {
        // 2：信息变更  4 行程变更
        updateFlag: 2,
        conferenceId: '',
        // 0仅保存 1提交
        submitFlag: 0,
        // 用户id
        userId: '',
        // 数据来源（1：后台录入，2：自主报名，3：联系人代报名 4:会务组代报名）
        sourceType: 3,
        // 商密网内部用户标识 1 是 0 否
        innerFlag: 1,
        // 必填 会务组1 参会人2
        roleFlag: 2,
        // 议程信息
        agendaIds: []
      },
      password: '',
      // 获取会议报名设置 需要拿到是否允许非商网用户报名
      regSettingsData: null,
      // 获取会议详情
      detailData: null,
      timeFlag: true,
      agendaData: null,
      arriveTime: '',
      returnTime: ''
    }
  },
  computed: {
    getWeek() {
      return function(date) {
        const getDay = new Date(date).getDay()
        const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const week = weeks[getDay]
        const isToday = new Date().toString().substr(0, 15) === date.toString().substr(0, 15)
        return isToday ? '今天' : week
      }
    },
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
    },
    // 自定义文件根据上传文件自动加载对应图片
    filePic() {
      return function(type) {
        const name = type.file.type
        if (name.includes('image')) {
          return this.picture
        } else {
          const result = name.slice(name.indexOf('.') + 1, name.length)
          if (this.fileType.indexOf(result) !== -1) {
            return this[result]
          } else {
            return this.unknow
          }
        }
      }
    },
    // 处理图片可传类型
    picType() {
      return function(type) {
        let result = ''
        if (!type) {
          result = 'image/*'
        } else {
          const typeArr = type.split(',')
          for (let i = 0; i < typeArr.length; i++) {
            typeArr[i] = `image/${typeArr[i]}`
          }
          result = typeArr.join(',')
        }
        return result
      }
    },
    // 输入框
    basicInputData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  eleCustom._checked = false
                  if (eleCustom.type === 1 && eleCustom.showFlag) {
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 单选
    basicSingleData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  // eleCustom._checked = false
                  if (eleCustom.type === 6 && eleCustom.showFlag) {
                    // eleCustom._showFlag = false
                    if (eleCustom.fieldValue) {
                      const selectData = eleCustom.signFormOptionVOs
                      eleCustom.fieldValueStr = selectData.find(
                        eleFind => String(eleFind.optionValue) === String(eleCustom.fieldValue)
                      ).optionText
                    }
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 复选
    basicMultipleData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  eleCustom._checked = false
                  if (eleCustom.type === 7 && eleCustom.showFlag) {
                    eleCustom._showFlag = false
                    if (eleCustom.fieldValue) {
                      const fieldValue = Array.isArray(eleCustom.fieldValue) ? eleCustom.fieldValue : JSON.parse(eleCustom.fieldValue)
                      const selectData = eleCustom.signFormOptionVOs
                      const fieldValueStr = []
                      if (fieldValue) {
                        fieldValue.forEach(eleOption => {
                          const filterData = selectData.find(eleDetail => String(eleDetail.optionValue) === String(eleOption))
                          if (filterData) {
                            fieldValueStr.push(filterData.optionText)
                          }
                        })
                        eleCustom.fieldValueStr = fieldValueStr.join(',')
                        // eleCustom.fieldValue = selectData.find(eleFind => String(eleFind.optionValue) === eleCustom.fieldValue).optionText
                      }
                    }
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 下拉
    basicOptionData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  eleCustom._checked = false
                  if (eleCustom.type === 8 && eleCustom.showFlag) {
                    eleCustom._showFlag = false
                    if (eleCustom.fieldValue) {
                      const selectData = eleCustom.signFormOptionVOs
                      if (selectData && selectData.length) {
                        eleCustom.fieldValueStr = selectData.find(eleFind => String(eleFind.optionValue) === String(eleCustom.fieldValue)).optionText
                      }
                    }
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 图片
    basicPicData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  if (eleCustom.type === 9 && eleCustom.showFlag) {
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 附件
    basicFileData() {
      return function(index) {
        const choiceArr = ['baseInfos', 'reserveServices', 'pickUpServices', 'pickOutServices']
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (Array.isArray(data[ele])) {
              const dataCustom = data[ele]
              if (ele === choiceArr[index - 1]) {
                dataCustom.forEach(eleCustom => {
                  if (eleCustom.type === 10 && eleCustom.showFlag) {
                    result.push(eleCustom)
                  }
                })
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 基本信息
    basicData() {
      return function(index) {
        // index 1 基本信息 2 行程信息→需要服务 3 行程信息→去程信息 4 行程信息→返程信息
        const data = this.param.signFormConfigFormatVO
        const result = []
        Object.keys(data).forEach(ele => {
          if (data[ele]) {
            if (!Array.isArray(data[ele])) {
              if (data[ele] && data[ele].groupId === index && data[ele].showFlag === 1) {
                // 接口文档内写好的 type为1 的时候为输入框类型 不知为什么 民族的type为1 但是却是个select选择 只能手动更改了
                if (ele === 'nation') {
                  data[ele].type = 8
                }
                if (data[ele].type === 6) {
                  data[ele].type = 8
                }
                if (ele === 'sex') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.sexData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).valName
                  }
                }
                if (ele === 'nation') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.nationData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).valName
                  }
                }
                if (ele === 'positionLevel') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.positionLevelData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).valName
                  }
                }
                if (ele === 'cardType') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.cardTypeData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).valName
                  }
                }
                if (ele === 'honourFlag') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.honourFlagData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).name
                  }
                }
                // if (ele === 'arriveTime') {
                //   if (data[ele].fieldValue) {
                //     const hourMinutes = data[ele].fieldValue.slice(-8, -3)
                //     const hourMinutesArr = hourMinutes.split(':')
                //     data[ele].fieldValueStr = `${hourMinutesArr[0] < 10 ? hourMinutesArr[0][1] : hourMinutesArr[0]}时${
                //       hourMinutesArr[1]
                //     }分`
                //   }
                // }
                // if (ele === 'returnTime') {
                //   if (data[ele].fieldValue) {
                //     const hourMinutes = data[ele].fieldValue.slice(-8, -3)
                //     const hourMinutesArr = hourMinutes.split(':')
                //     data[ele].fieldValueStr = `${hourMinutesArr[0] < 10 ? hourMinutesArr[0][1] : hourMinutesArr[0]}时${
                //       hourMinutesArr[1]
                //     }分`
                //   }
                // }
                if (ele === 'bookDinnerFlag') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.bookDinnerFlagData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).name
                  }
                }
                if (ele === 'bookStayFlag') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.bookStayFlagData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).name
                  }
                }
                if (ele === 'pickUpFlag') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.pickUpFlagData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).name
                  }
                }
                if (ele === 'pickOutFlag') {
                  if (data[ele].fieldValue) {
                    data[ele].fieldValueStr = this.pickOutFlagData.find(
                      eleMultiple => String(eleMultiple.valCode) === String(data[ele].fieldValue)
                    ).name
                  }
                }
                result.push(data[ele])
              }
            }
          }
        })
        this.sortByKey(result, 'seq')
        return result
      }
    },
    // 顶部tabs展示 控制行程信息和议程信息是否显示
    tabsData() {
      const arr = [{ text: '基本信息', checked: true }]
      if (this.regSettingsData && this.regSettingsData.setRouteFlag === 1) {
        arr.push({ text: '行程信息', checked: false })
      }
      if (this.regSettingsData && this.regSettingsData.agendaFreeFlag === 1) {
        arr.push({ text: '议程安排', checked: false })
      }
      return arr
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    const attendeeId = this.routeParams.attendeeId
    // 根据 replaceIdent 判断是否是代他人报名
    const replaceIdent = this.routeParams.replaceIdent
    if (replaceIdent) {
      this.paramsRequire.sourceType = replaceIdent
    }
    this.params.conferenceId = conferenceId
    this.params.attendeeId = attendeeId
    this.paramsRequire.conferenceId = conferenceId
    const getData = async function() {
      // 查询参会人信息
      await this.getAttendeeOrRecord()
      // 获取性别
      await this.getSex()
      // 获取职位级别
      await this.getLevel()
      // 获取证件类型
      await this.getCardType()
      // 获取民族
      await this.getNation()
      // 获取会议报名设置
      // await this.getRegSettings()
      // 获取会议详情
      await this.getDetail()
      // this.$api({
      //   url: 'attendeeApi.getAttendeeDetail',
      //   data: {
      //     id: attendeeId
      //   }
      // }).then(res => {
      //   const data = res.result
      //   // 存在草稿
      //   this.param = this.paramHandler(data)
      //   this.isLoading = true
      //   // 获取议程
      //   this.getAddAgenda()
      //   console.log(data.signStatus, '报名状态')
      // })
    }.bind(this)
    getData()
    // 获取报名表单
    // this.getForms()
  },
  methods: {
    // 随员选择弹窗关闭
    attendantClose() {
      this.attendantResult = []
      this.attendantVal = ''
    },
    // 随员点击选择
    choiceAttendant(index) {
      const data = this.attendantResult[index].fixAttributeCommonVO
      this.findEle('honourFlagArr').fieldValueStr = data.attendeeName
      this.findEle('honourFlagArr').fieldValue = data.attendeeId
      this.findEle('honourId').fieldValue = data.attendeeId
      this.findEle('honourId').fieldValueStr = data.attendeeName
      // linkAttendeeList
      // this.paramsRequire.linkAttendeeList = []
      // if (!this.paramsRequire.linkAttendeeList.find(ele => ele.attendeeName === data.attendeeName)) {
      //   this.paramsRequire.linkAttendeeList.push(data)
      // }
      // const name = []
      // this.paramsRequire.linkAttendeeList.forEach(ele => {
      //   name.push(ele.attendeeName)
      // })
      this.attendantShow = false
    },
    // 随员搜索
    attendantSearch(val) {
      const data = {
        attendeeName: val,
        conferenceId: this.routeParams.conferenceId,
        honourFlag: 1
      }
      this.$api({
        url: 'attendeeApi.getAttendant',
        data
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.attendantResult = data
        }
      })
    },
    // 递归拿到所有的日程 放入数组内
    recursAgenda(data) {
      const ids = this.attendeeOrRecordData.agendaIds
      const result = []
      const recursFunc = data => {
        if (!data) {
          return
        }
        data.forEach(ele => {
          if (ele.id) {
            ele._checked = false
            // 是否不可选（同一分组内的只允许选择一个议程）true为不可选
            if (ele._ban === undefined) {
              ele._ban = false
            }
            result.push(ele)
            if (!ele.freeFlag) {
              if (ele.groupId) {
                setTimeout(() => {
                  this.recursAgendaGroup(this.agendaData, ele.groupId, true)
                  ele._ban = false
                })
              }
            }
            if (ids && ids.indexOf(ele.id) !== -1) {
              if (ele.groupId) {
                // 需要异步等待数据填充成功后再筛选出 属于同一组内的 并渲染其他不可选的
                setTimeout(() => {
                  this.recursAgendaGroup(this.agendaData, ele.groupId, true)
                  ele._ban = false
                })
              }
              ele._checked = true
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
    // 根据groupId 同步所有的选中项
    recursAgendaGroup(data, groupId, checkFlag) {
      // checkFlag 处理选中还是反选 true 选中 false 反选
      const result = []
      const recursFunc = (data, groupId, checkFlag) => {
        if (!data) {
          return
        }
        data.forEach(ele => {
          if (ele.id) {
            result.push(ele)
            if (ele.freeFlag) {
              if (ele.groupId === groupId) {
                ele._ban = checkFlag
              }
            }
          }
          if (ele.children) {
            recursFunc(ele.children, groupId, checkFlag)
          }
        })
      }
      recursFunc(data, groupId, checkFlag)
      return result
    },
    // 选择议程
    choiceAgenda(ele, eleChild) {
      // freeFlag 0 必选 1 非必选
      if (eleChild.freeFlag) {
        if (!eleChild._ban) {
          eleChild.groupId && this.recursAgendaGroup(this.agendaData, eleChild.groupId, !eleChild._ban)
          if (eleChild.groupId) {
            eleChild._ban = !eleChild._ban
          }
          eleChild._checked = !eleChild._checked
          if (eleChild._checked) {
            if (!this.paramsRequire.agendaIds.find(eleFind => eleFind === eleChild.id)) {
              this.paramsRequire.agendaIds.push(eleChild.id)
            }
          } else {
            const index = this.paramsRequire.agendaIds.findIndex(idEle => idEle === eleChild.id)
            this.paramsRequire.agendaIds.splice(index, 1)
            eleChild.groupId && this.recursAgendaGroup(this.agendaData, eleChild.groupId, false)
          }
        }
      }
    },
    agendaShow(index) {
      this.agendaData[index].checked = !this.agendaData[index].checked
    },
    // 时间确定
    timeComfire(val) {
      this.timeShow = false
      const key = this.timeIndex
      if (key === 'arriveTime') {
        const hour = val[0]
        const minutes = val[1]
        this.findEle(key).fieldValueStr = `${val[0]}${val[1]}`
        this.findEle(key).fieldValue = this.formatHourSymbol(hour, minutes)
        this.arriveTime = this.formatHourSymbol(hour, minutes)
        if (!this.findEle('arriveTimeCustom').fieldValueStr) {
          const today = new Date()
          const todayStr = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`
          this.findEle('arriveTimeCustom').fieldValueStr = this.formatCode(new Date(todayStr))
          this.findEle('arriveTimeCustom').fieldValue = todayStr
        }
      } else if (key === 'returnTime') {
        const hour = val[0]
        const minutes = val[1]
        this.findEle(key).fieldValueStr = `${val[0]}${val[1]}`
        this.findEle(key).fieldValue = this.formatHourSymbol(hour, minutes)
        this.returnTime = this.formatHourSymbol(hour, minutes)
        if (!this.findEle('returnTimeCustom').fieldValueStr) {
          const today = new Date()
          const todayStr = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`
          this.findEle('returnTimeCustom').fieldValueStr = this.formatCode(new Date(todayStr))
          this.findEle('returnTimeCustom').fieldValue = todayStr
        }
      } else if (key === 'arriveTimeCustom') {
        this.findEle(key).fieldValueStr = val[0]
        this.findEle(key).fieldValue = this.formatCodeSymbol(val[0])
      } else if (key === 'returnTimeCustom') {
        this.findEle(key).fieldValueStr = val[0]
        // this.findEle('returnTime').fieldValue = `${this.formatCodeSymbol(val[0])}`
        this.findEle(key).fieldValue = this.formatCodeSymbol(val[0])
      }
    },
    // 时间选择
    timeChoice(ele) {
      this.timeShow = true
      // 为时间确定时候做标记
      this.timeIndex = ele.fieldCode
      // this.timeData = []
      const type = ele.fieldCode
      // arriveTimeCustom 到达日期 2021-07-07
      // returnTimeCustom 返程日期 2021-07-07
      // arriveTime 到达时间 09:02
      // returnTime 返程时间 09:05
      const startTime = this.$format(this.detailData.startTime)
      const endTime = this.$format(this.detailData.endTime)
      if (type === 'arriveTimeCustom') {
        // 到达日期
        this.timeTitle = '到达日期'
        const startTimeSelected = this.findEle('arriveTimeCustom').fieldValueStr
          ? this.formatCodeSymbol(this.findEle('arriveTimeCustom').fieldValueStr)
          : this.findEle('arriveTimeCustom').fieldValueStr
        const startTimePrev = this.timeJump(startTime, -30)
        const endTimeNext = this.timeJump(endTime, 30)
        const values = this.timeArr(startTimePrev, endTimeNext)
        const now = new Date()
        let nowDay = this.formatCode(new Date(startTime))
        if (startTimeSelected) {
          // 如果之前选中过日期 则跳到之前选中的日期上
          nowDay = this.formatCode(new Date(startTimeSelected))
        } else {
          // 如果当前日期大于会议开始日期 将默认选中的选项设置为当天
          if (now.getTime() > new Date(startTime).getTime()) {
            nowDay = this.formatCode(now)
          }
        }
        const defaultIndex = values.findIndex(ele => ele === nowDay)
        this.timeData = [{ values, defaultIndex }]
      } else if (type === 'returnTimeCustom') {
        // 返程日期 2021-07-07
        this.timeTitle = '返程日期'
        // 如果已经选过到达日期 则当前选中的为开始日期为到达日期
        const startTimeSelected = this.findEle('arriveTimeCustom').fieldValueStr
          ? this.formatCodeSymbol(this.findEle('arriveTimeCustom').fieldValueStr)
          : this.findEle('arriveTimeCustom').fieldValueStr
        const endTimeSelected = this.findEle('returnTimeCustom').fieldValueStr
          ? this.formatCodeSymbol(this.findEle('returnTimeCustom').fieldValueStr)
          : this.findEle('returnTimeCustom').fieldValueStr
        const startTimePrev = this.timeJump(startTime, -30)
        const endTimeNext = this.timeJump(endTime, 30)
        let values = null
        if (startTimeSelected) {
          values = this.timeArr(startTimeSelected, endTimeNext)
        } else {
          values = this.timeArr(startTimePrev, endTimeNext)
        }
        const now = new Date()
        let nowDay = this.formatCode(new Date(startTime))
        if (endTimeSelected) {
          // 如果之前选中过日期 则跳到之前选中的日期上
          nowDay = this.formatCode(new Date(endTimeSelected))
        } else {
          // 如果当前日期大于会议开始日期 将默认选中的选项设置为当天
          if (now.getTime() > new Date(startTime).getTime()) {
            nowDay = this.formatCode(now)
          }
        }
        const defaultIndex = values.findIndex(ele => ele === nowDay)
        this.timeData = [{ values, defaultIndex }]
      } else if (type === 'arriveTime') {
        // 到达时间 09:02
        this.timeTitle = '到达时间'
        const startHour = this.findEle('arriveTime').fieldValueStr.slice(0, -3)
        const startMinutes = this.findEle('arriveTime').fieldValueStr.slice(-3)
        const hourValues = [
          '0时',
          '1时',
          '2时',
          '3时',
          '4时',
          '5时',
          '6时',
          '7时',
          '8时',
          '9时',
          '10时',
          '11时',
          '12时',
          '13时',
          '14时',
          '15时',
          '16时',
          '17时',
          '18时',
          '19时',
          '20时',
          '21时',
          '22时',
          '23时'
        ]
        const minutesValues = []
        for (let i = 0; i < 60; i++) {
          let minute = i
          if (i < 10) {
            minute = `0${i}`
          }
          minutesValues.push(`${minute}分`)
        }
        const now = new Date()
        const hour = `${now.getHours()}时`
        const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}分` : `${now.getMinutes()}分`
        let hourIndex = null
        let minutesIndex = null
        if (startHour) {
          hourIndex = hourValues.findIndex(ele => ele === startHour)
          minutesIndex = minutesValues.findIndex(ele => ele === startMinutes)
        } else {
          hourIndex = hourValues.findIndex(ele => ele === hour)
          minutesIndex = minutesValues.findIndex(ele => ele === minutes)
        }
        this.timeData = [
          {
            values: hourValues,
            defaultIndex: hourIndex
          },
          {
            values: minutesValues,
            defaultIndex: minutesIndex
          }
        ]
      } else if (type === 'returnTime') {
        // 返程时间 09:05
        this.timeTitle = '返程时间'
        const startHour = this.findEle('returnTime').fieldValueStr.slice(0, -3)
        const startMinutes = this.findEle('returnTime').fieldValueStr.slice(-3)
        const hourValues = [
          '0时',
          '1时',
          '2时',
          '3时',
          '4时',
          '5时',
          '6时',
          '7时',
          '8时',
          '9时',
          '10时',
          '11时',
          '12时',
          '13时',
          '14时',
          '15时',
          '16时',
          '17时',
          '18时',
          '19时',
          '20时',
          '21时',
          '22时',
          '23时'
        ]
        const minutesValues = []
        for (let i = 0; i < 60; i++) {
          let minute = i
          if (i < 10) {
            minute = `0${i}`
          }
          minutesValues.push(`${minute}分`)
        }
        const now = new Date()
        const hour = `${now.getHours()}时`
        const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}分` : `${now.getMinutes()}分`
        let hourIndex = null
        let minutesIndex = null
        if (startHour) {
          hourIndex = hourValues.findIndex(ele => ele === startHour)
          minutesIndex = minutesValues.findIndex(ele => ele === startMinutes)
        } else {
          hourIndex = hourValues.findIndex(ele => ele === hour)
          minutesIndex = minutesValues.findIndex(ele => ele === minutes)
        }
        this.timeData = [
          {
            values: hourValues,
            defaultIndex: hourIndex
          },
          {
            values: minutesValues,
            defaultIndex: minutesIndex
          }
        ]
      }
    },
    // 根据开始时间和结束时间将中间的日期处理成数组
    timeArr(startTime, endTime) {
      const result = []
      const differDay = this.getDaysBetween(startTime, endTime)
      for (let i = 0; i < differDay; i++) {
        const now = new Date(startTime)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        result.push(this.formatCode(tomorrow))
      }
      return result
    },
    // 根据时间向前推/向后推的天数 prevNum为正数向后推 为负数向前推
    timeJump(time, prevNum) {
      const now = new Date(time)
      return new Date(now.setDate(now.getDate() + prevNum))
    },
    // 将2021-02-02 03:00:00处理成{ date: 2020-01-01, time: 09:00} 格式
    timeSplit(time) {
      const timeArr = time.split(' ')
      return { date: timeArr[0], time: timeArr[1].slice(0, 5) }
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 将 2020年01月02日 转换为2020-01-02 如果传一个参数只格式化年月日 如果传1个以上参数格式化年月日分时秒
    formatCodeSymbol(yearMonthDay, hour, minute) {
      const choiceYearMonthDay = yearMonthDay.slice(0, -1).replace(/([^\u0000-\u00FF])/g, '-')
      const yearMonthDayArr = choiceYearMonthDay.split('-')
      yearMonthDayArr.forEach((ele, index) => {
        if (ele < 10) {
          yearMonthDayArr[index] = `0${ele}`
        }
      })
      const paramsYearMonthDay = yearMonthDayArr.join('-')
      if (arguments.length > 1) {
        // 将小时转换为两位数
        const choiceHour = hour.replace(/([^\u0000-\u00FF])/g, '')
        const paramsHour = choiceHour < 10 ? `0${choiceHour}` : choiceHour
        const choiceMinute = minute.replace(/([^\u0000-\u00FF])/g, '')
        const finalStartDate = `${paramsYearMonthDay} ${paramsHour}:${choiceMinute}:00`
        return finalStartDate
      } else {
        const finalStartDate = `${paramsYearMonthDay}`
        return finalStartDate
      }
    },
    // 将 2020年01月02日 转换为2020-01-02 如果传一个参数只格式化年月日 如果传1个以上参数格式化年月日分时秒
    formatHourSymbol(hour, minute) {
      // 将小时转换为两位数
      const choiceHour = hour.replace(/([^\u0000-\u00FF])/g, '')
      const paramsHour = choiceHour < 10 ? `0${choiceHour}` : choiceHour
      const choiceMinute = minute.replace(/([^\u0000-\u00FF])/g, '')
      let seconds = '00'
      if (hour === '0时' && minute === '00分') {
        // 如果用户没有选择到达/返程时间 则不应该回显 需要手动将00:00:00的秒替换为00:00:01 以区分用户是否选择了
        seconds = '01'
      }
      const finalStartDate = `${paramsHour}:${choiceMinute}:${seconds}`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return Math.ceil(days)
    },
    // 通过弹窗删除已选图片
    delPic() {
      this.imgPreviewShow = false
      const customFlag = this.imagesPreview.customFlag
      if (customFlag) {
        this.uploadCustomPic[this.fileIndex][this.imagesPreview.index].splice(this.imagesPreview.indexChild, 1)
        this.imagesPreview.ele.fieldValue.splice(this.imagesPreview.indexChild, 1)
      } else {
        this.imagesPreview.ele.fieldValue = ''
        this.fileList = []
      }
      this.$toast('删除图片成功')
    },
    // 删除自定义图片
    delUploadedPic(index, indexChild, ele) {
      this.fileIndex = ele.groupId - 1
      this.uploadCustomPic[this.fileIndex][index].splice(indexChild, 1)
      ele.fieldValue.splice(indexChild, 1)
      this.$toast('删除图片成功')
    },
    basicPicPreview(ele) {
      this.imgPreviewShow = true
      const url = this.fileList[0].content
      this.imagesPreview = {
        ele,
        src: url,
        customFlag: false
      }
    },
    // 点击上传的自定义图片查看详情
    showPic(index, indexChild, ele) {
      this.fileIndex = ele.groupId - 1
      const url = this.uploadCustomPic[this.fileIndex][index][indexChild].content
      this.imagesPreview = {
        index,
        indexChild,
        ele,
        src: url,
        customFlag: true
      }
      this.imgPreviewShow = true
    },
    // 上传图片- 读取文件之后
    afterReadPic(ele) {
      return file => {
        console.log(22, file)
        //   console.log(2, file)
        //   file = Array.isArray(file) ? file : [file]
        //   const conferenceId = this.routeParams.conferenceId
        //   const fileGroup = 7
        //   const pro = new Promise((resolve, reject) => {
        //     resolve()
        //     for (let i = 0; i < file.length; i++) {
        //       const fromData = new FormData()
        //       fromData.append('files', file[i].file)
        //       fromData.append('conferenceId', conferenceId)
        //       fromData.append('fileGroup', fileGroup)
        //       this.$api({
        //         url: 'attendeeApi.upload',
        //         data: fromData
        //       }).then(res => {
        //         if (res.code === 2000) {
        //           // const data = res.result[0].filePath
        //           const data = res.result[0]
        //           const submitData = {
        //             downloadUrl: data.downloadUrl,
        //             fileName: data.fileName,
        //             fileSuffix: data.fileType,
        //             fileUrl: data.filePath
        //           }
        //           if (!ele.fieldValue) {
        //             ele.fieldValue = []
        //           }
        //           Array.isArray(ele.fieldValue)
        //             ? ele.fieldValue.push(submitData)
        //             : JSON.parse(ele.fieldValue).push(submitData)
        //         }
        //       })
        //     }
        //   })
      }
    },
    uploadPic(file, conferenceId, fileGroup, ele, childIndex, index, arr, length) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true
      })
      const fromData = new FormData()
      fromData.append('files', file)
      fromData.append('conferenceId', conferenceId)
      fromData.append('fileGroup', fileGroup)
      this.$api({
        url: 'attendeeApi.upload',
        data: fromData
      })
        .then(res => {
          if (res.code === 2000) {
            arr.push('success')
            const data = res.result[0]
            const submitData = {
              downloadUrl: data.downloadUrl,
              fileName: data.fileName,
              fileSuffix: data.fileType,
              fileUrl: data.filePath
            }
            if (!ele.fieldValue) {
              ele.fieldValue = []
            }
            Array.isArray(ele.fieldValue)
              ? ele.fieldValue.push(submitData)
              : JSON.parse(ele.fieldValue).push(submitData)
            if (childIndex === 'single') {
              // 非自定义图片上传
              this.fileList.push({
                content: submitData.downloadUrl,
                file
              })
            } else {
              // 自定义图片上传
              this.uploadCustomPic[childIndex][index].push({
                content: submitData.downloadUrl,
                file
              })
            }
          }
        })
        .catch(() => {
          this.$toast({
            message: `图片上传失败`,
            duration: 2500
          })
        })
        .finally(() => {
          arr.length === length && this.$toast.clear()
        })
    },
    // 上传图片 - 读取文件之前判断图片格式是否合法
    beforeReadPic(ele, childIndex, index) {
      return file => {
        file = Array.isArray(file) ? file : [file]
        const sizeLimit = Number(ele.signFormFieldRuleVO.maxVal) * 1048576
        const acceptType = ele.signFormFieldRuleVO.accept

        const conferenceId = this.routeParams.conferenceId
        const fileGroup = 7
        const arr = []
        let length = file.length
        const maxLength = ele.signFormFieldRuleVO.uploadCount
        if (maxLength && (length > maxLength)) {
          length = maxLength
          file = file.slice(0, maxLength)
        }
        for (let i = 0; i < file.length; i++) {
          const size = file[i].size
          // 1M等于1048576字节
          const typeArr = file[i].type.split('/')
          const type = typeArr[0]
          const suffix = typeArr[1]
          if (acceptType) {
            let isAccept = acceptType.includes(suffix)
            // 需要对jpg格式额外处理
            if (suffix === 'jpeg' && acceptType.includes('jpg')) {
              isAccept = true
            }
            if (!isAccept) {
              length--
              file.splice(i, 1)
              this.$toast(`请上传${acceptType}格式图片`)
            } else {
              if (size > sizeLimit) {
                length--
                file.splice(i, 1)
                this.$toast(`图片大小不能超过${ele.signFormFieldRuleVO.maxVal}M`)
              } else {
                this.uploadPic(file[i], conferenceId, fileGroup, ele, childIndex, index, arr, length)
              }
            }
          } else {
            if (type === 'image') {
              if (size > sizeLimit) {
                length--
                file.splice(i, 1)
                this.$toast(`图片大小不能超过${ele.signFormFieldRuleVO.maxVal}M`)
                // this.$toast(`图片大小不能超过${ele.signFormFieldRuleVO.maxVal}M`)
              } else {
                this.uploadPic(file[i], conferenceId, fileGroup, ele, childIndex, index, arr, length)
              }
            } else {
              length--
              file.splice(i, 1)
              this.$toast(`请上传${acceptType}格式图片`)
            }
          }
        }
      }
    },
    // 删除自定义文件
    delUploadedFile(index, indexChild, ele) {
      this.fileIndex = ele.groupId - 1
      this.uploadCustomFile[this.fileIndex][index].splice(indexChild, 1)
      ele.fieldValue.splice(indexChild, 1)
    },
    // 上传文件- 读取文件之后
    afterReadFile(ele) {
      // return file => {
      //   console.log(this.uploadCustomFile)
      //   file = Array.isArray(file) ? file : [file]
      //   const conferenceId = this.routeParams.conferenceId
      //   const fileGroup = 7
      //   for (let i = 0; i < file.length; i++) {
      //     const fromData = new FormData()
      //     fromData.append('files', file[i].file)
      //     fromData.append('conferenceId', conferenceId)
      //     fromData.append('fileGroup', fileGroup)
      //     this.$api({
      //       url: 'attendeeApi.upload',
      //       data: fromData
      //     }).then(res => {
      //       if (res.code === 2000) {
      //         // const data = res.result[0].filePath
      //         const data = res.result[0]
      //         data.fileUrl = data.filePath
      //         if (!ele.fieldValue) {
      //           ele.fieldValue = []
      //         }
      //         Array.isArray(ele.fieldValue) ? ele.fieldValue.push(data) : JSON.parse(ele.fieldValue).push(data)
      //       }
      //     })
      //   }
      // }
    },
    uploadFile(file, conferenceId, fileGroup, ele, childIndex, index, arr, length) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true
      })
      const fromData = new FormData()
      fromData.append('files', file)
      fromData.append('conferenceId', conferenceId)
      fromData.append('fileGroup', fileGroup)
      this.$api({
        url: 'attendee.upload',
        data: fromData
      }).then(res => {
        if (res.code === 2000) {
          arr.push('success')
          const data = res.result[0]
          data.fileUrl = data.filePath
          if (!ele.fieldValue) {
            ele.fieldValue = []
          }
          Array.isArray(ele.fieldValue) ? ele.fieldValue.push(data) : (JSON.parse(ele.fieldValue)).push(data)
          this.uploadCustomFile[childIndex][index].push({
            content: data.downloadUrl,
            file
          })
        }
      }).catch(() => {
        this.$toast({
          message: `附件上传失败`,
          duration: 2500
        })
      }).finally(() => {
        arr.length === length && this.$toast.clear()
      })
    },
    // 上传文件 - 读取文件之前判断图片格式是否合法
    beforeReadFile(ele, childIndex, index) {
      return file => {
        file = Array.isArray(file) ? file : [file]
        const accept = ele.signFormFieldRuleVO.accept
        const acceptArr = accept.split(',')
        const conferenceId = this.routeParams.conferenceId
        const fileGroup = 7
        const arr = []
        let length = file.length
        const maxLength = ele.signFormFieldRuleVO.uploadCount
        if (maxLength && (length > maxLength)) {
          length = maxLength
          file = file.slice(0, maxLength)
        }
        if (accept.length) {
          const acceptType = ele.signFormFieldRuleVO.accept
          // if (acceptArr.find(eleFind => eleFind === 'doc')) {
          //   acceptArr.push('docx')
          // }
          for (let i = 0; i < file.length; i++) {
            const nameArr = file[i].name.split('.')
            const name = nameArr[nameArr.length - 1]
            if (acceptArr.findIndex(eleFind => eleFind.replace('.', '') === name) === -1) {
              length--
              file.splice(i, 1)
              this.$toast(`请上传${acceptType}格式文件`)
            }
          }
        }
        const sizeLimit = Number(ele.signFormFieldRuleVO.maxVal) * 1048576
        for (let i = 0; i < file.length; i++) {
          const size = file[i].size
          if (size > sizeLimit) {
            length--
            file.splice(i, 1)
            this.$toast(`文件大小不得大于${ele.signFormFieldRuleVO.maxVal}M`)
          } else {
            this.uploadFile(file[i], conferenceId, fileGroup, ele, childIndex, index, arr, length)
          }
        }
      }
    },
    // popup弹窗的确定事件
    popupComfire() {
      this.popupShow = false
    },
    // 单选框选择事件
    singleChoice(ele, eleChild) {
      ele.fieldValueStr = eleChild.optionText
      ele.fieldValue = eleChild.optionValue
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 对象排序 根据seq值排序表单
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        const x = a[key]
        const y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 根据key寻找对应的对象
    findEle(key) {
      const data = this.param.signFormConfigFormatVO
      const keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        const ele = data[keys[i]]
        if (ele) {
          if (Array.isArray(ele)) {
            for (let t = 0; t < ele.length; t++) {
              if (ele[t].fieldCode === key) {
                return ele[t]
              }
            }
          } else {
            if (ele.fieldCode === key) {
              return ele
            }
          }
        }
      }
    },
    // 对提交表单的必填项进行验证
    verify(tabIndex) {
      // 需要在每次切换tab 或者 点击上一步/下一步的时候对当前页进行表单验证
      // tabIndex 当前处于基本信息 还是形成信息 1 → group 1   、   2 → group 2 3 4 默认需要验证的是1基本信息 不传表示提交前对所有需要验证的消息进行验证
      const verifyObj = this.param.signFormConfigFormatVO
      const result = []
      if (tabIndex === 0) {
        Object.keys(verifyObj).forEach(ele => {
          const eleObj = verifyObj[ele]
          if (eleObj) {
            if (!Array.isArray(eleObj)) {
              if (eleObj.groupId === 1 && eleObj.showFlag && eleObj.requireFlag) {
                result.push(eleObj)
              }
            } else {
              // 扩展 基本信息：baseInfos   行程信息：reserveServices pickUpServices pickOutServices
              if (ele === 'baseInfos') {
                // 基本信息
                eleObj.forEach(eleArr => {
                  if (eleArr.requireFlag) {
                    // 图片和附件内容空时为 空数组
                    if (eleArr.type === 9 || eleArr.type === 10) {
                      if (!eleArr.fieldValue || !eleArr.fieldValue.length) {
                        eleArr.fieldValue = ''
                      }
                    }
                    result.push(eleArr)
                  }
                })
              }
            }
          }
        })
      } else if (tabIndex === 1) {
        Object.keys(verifyObj).forEach(ele => {
          const eleObj = verifyObj[ele]
          if (eleObj) {
            if (!Array.isArray(eleObj)) {
              if (
                (eleObj.groupId === 2 || eleObj.groupId === 3 || eleObj.groupId === 4) &&
                eleObj.showFlag &&
                eleObj.requireFlag
              ) {
                result.push(eleObj)
              }
            } else {
              // 扩展 基本信息：baseInfos   行程信息：reserveServices pickUpServices pickOutServices
              if (ele === 'pickOutServices' || ele === 'pickUpServices' || ele === 'reserveServices') {
                // 基本信息
                eleObj.forEach(eleArr => {
                  if (eleArr.requireFlag) {
                    // 图片和附件内容空时为 空数组
                    if (eleArr.type === 9 || eleArr.type === 10) {
                      if (!eleArr.fieldValue || !eleArr.fieldValue.length) {
                        eleArr.fieldValue = ''
                      } else {
                        eleArr.fieldValue = JSON.stringify(eleArr.fieldValue)
                      }
                    }
                    result.push(eleArr)
                  }
                })
              }
            }
          }
        })
      } else {
        Object.keys(verifyObj).forEach(ele => {
          const eleObj = verifyObj[ele]
          if (eleObj) {
            if (!Array.isArray(eleObj)) {
              if (eleObj.showFlag && eleObj.requireFlag) {
                result.push(eleObj)
              }
            } else {
              // 扩展 基本信息：baseInfos   行程信息：reserveServices pickUpServices pickOutServices
              eleObj.forEach(eleArr => {
                if (eleArr.requireFlag) {
                  // 图片和附件内容空时为 空数组
                  if (eleArr.type === 9 || eleArr.type === 10) {
                    if (!eleArr.fieldValue || !eleArr.fieldValue.length) {
                      eleArr.fieldValue = ''
                    }
                  }
                  result.push(eleArr)
                }
              })
            }
          }
        })
      }
      this.sortByKey(result, 'seq')
      const typeTips = [
        { type: 1, tips: '输入' },
        { type: 3, tips: '选择' },
        { type: 6, tips: '选择' },
        { type: 7, tips: '选择' },
        { type: 8, tips: '选择' },
        { type: 9, tips: '上传' },
        { type: 10, tips: '上传' }
      ]
      for (let i = 0; i < result.length; i++) {
        const fieldLabel = result[i].fieldLabel
        const fieldValue = result[i].fieldValue
        const showFlag = result[i].showFlag
        const titleMsessage = result[i].signFormFieldRuleVO ? result[i].signFormFieldRuleVO.titleMsessage ? result[i].signFormFieldRuleVO.titleMsessage : result[i].fieldLabel : result[i].fieldLabel
        // const id = result[i].id
        if (!fieldValue && showFlag) {
          console.log(result[i].fieldCode, fieldLabel, fieldValue, showFlag)
          const type = result[i].type
          const tips = typeTips.find(ele => ele.type === type).tips

          this.$toast(`请${tips}${titleMsessage}`)
          return false
        }
      }
      return true
    },
    // 对日期进行验证
    verifyTime() {
      // 当是否接站 和 是否送站都选择为是的时候 验证 如果到达日期和返程日期为同一天 则达到时间不得大于返程时间
      const startDate = this.findEle('arriveTimeCustom').fieldValue
      const endDate = this.findEle('returnTimeCustom').fieldValue
      const startTime = this.findEle('arriveTime').fieldValue
      const endTime = this.findEle('returnTime').fieldValue
      // if (startDate && !startTime) {
      //   this.$toast('请选择到达时间')
      //   return false
      // }
      // if (startTime && !startDate) {
      //   this.$toast('请选择到达日期')
      //   return false
      // }
      // if (endDate && !endTime) {
      //   this.$toast('请选选择返程时间')
      //   return false
      // }
      // if (endTime && !endDate) {
      //   this.$toast('请选选择返程日期')
      //   return false
      // }
      if (startDate && endDate) {
        if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
          this.$dialog
            .alert({
              message: '到达日期不得大于返程日期，请重新选择到达日期或调整返程日期',
              confirmButtonText: '确定',
              className: 'customDialog'
            })
            .then(() => {
              // this.findEle('arriveTimeCustom').fieldValue = ''
              // this.findEle('arriveTimeCustom').fieldValueStr = ''
              this.timeData = []
            })
          return false
        }
        if (startTime && endTime) {
          if (new Date(startDate).getTime() === new Date(endDate).getTime()) {
            const start = `${startDate} ${startTime}`
            const end = `${endDate} ${endTime}`
            // 如果开始日期和结束日期选择在了同一天 则将开始时间置空重新选择
            if (new Date(start).getTime() > new Date(end).getTime()) {
              this.$dialog
                .alert({
                  message: '到达时间不得大于返程时间，请重新选择到达时间或调整返程时间',
                  confirmButtonText: '确定',
                  className: 'customDialog'
                })
                .then(() => {
                  this.timeData = []
                })
              return false
            }
          }
        }
      }
      return true
    },
    // 暂存接口逻辑
    setKeep(toast = '') {
      // 处理到达日期 返程日期 为接口需要的格式 `年-月-日 分:时:秒`
      const startDate = this.findEle('arriveTimeCustom').fieldValue
      const endDate = this.findEle('returnTimeCustom').fieldValue
      const startTime = this.arriveTime ? this.arriveTime : '00:00:00'
      const endTime = this.returnTime ? this.returnTime : '00:00:00'
      if (startDate) {
        this.findEle('arriveTime').fieldValue = `${startDate} ${startTime}`
      }
      if (endDate) {
        this.findEle('returnTime').fieldValue = `${endDate} ${endTime}`
      }
      if (
        this.param.signFormConfigFormatVO.photoUrl.fieldValue &&
        Array.isArray(this.param.signFormConfigFormatVO.photoUrl.fieldValue)
      ) {
        this.param.signFormConfigFormatVO.photoUrl.fieldValue =
          this.param.signFormConfigFormatVO.photoUrl.fieldValue[0].fileUrl
        // this.param.signFormConfigFormatVO.photoUrl.fieldValue = this.param.signFormConfigFormatVO.photoUrl.fieldValue.join()
      }
      const data = this.param.signFormConfigFormatVO
      Object.keys(data).forEach(ele => {
        if (data[ele] && Array.isArray(data[ele])) {
          data[ele].forEach(eleChild => {
            if (eleChild.type === 9 || eleChild.type === 10) {
              if (eleChild.fieldValue && Array.isArray(eleChild.fieldValue)) {
                eleChild.fieldValue = JSON.stringify(eleChild.fieldValue)
              }
            }
          })
        }
      })
      const signFormConfigFormatPO = {
        signFormConfigFormatPO: Object.assign({}, this.param.signFormConfigFormatVO)
      }
      const param = Object.assign({}, this.param, this.paramsRequire, signFormConfigFormatPO)
      console.log(param, 'param-------')
      this.$api({
        url: 'attendeeApi.addInsert',
        data: param
      })
        .then(res => {
          if (res.code === 2000 && res.success) {
            if (toast) {
              this.$toast(toast)
              if (this.paramsRequire.submitFlag === 1 || toast === '报名变更成功') {
                // 添加成功后 刷新当前页面
                setTimeout(() => {
                  this.$router.replace({
                    name: 'conferenceHomePage',
                    query: {
                      [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
                    }
                  })
                  this.$router.go(-1)
                }, 500)
              }
            }
          }
        })
        .catch(err => {
          const msg = err.message
          this.$toast(msg)
        })
    },
    // 顶部tabs切换事件
    // tabsChange(index) {
    //   // tabs切换之前要对当前页进行验证
    //   const tabIndex = this.tabIndex
    //   if (tabIndex === 0) {
    //     // 只有在第一tab页的时候才进行验证
    //     const isVerify = this.verify(tabIndex)
    //     if (!isVerify) {
    //       return
    //     }
    //   }
    //   // this.uploadCustomPic = []
    //   this.tabsData.forEach(ele => {
    //     ele.checked = false
    //   })
    //   this.tabsData[index].checked = true
    //   // this.tabIndex = index
    //   // this.setKeep()
    // },
    // 暂存按钮事件
    submitWhile() {
      // bbbbbbbb
      // const tabIndex = this.tabIndex
      // const isVerify = this.verify(tabIndex)
      // if (!isVerify) {
      //   return
      // }
      if (!this.findEle('attendeeName').fieldValue) {
        this.$toast('请输入姓名')
        return
      } else if (!this.findEle('phone').fieldValue) {
        this.$toast('请输入手机号')
        return
      }
      this.paramsRequire.submitFlag = 0
      this.setKeep('暂存成功')
    },
    // 下一步 提交
    submit() {
      // 添加校验
      // // 到达日期
      // const arriveTimeCustom = this.findEle('arriveTimeCustom').fieldValue
      // // 返程日期
      // const returnTimeCustom = this.findEle('returnTimeCustom').fieldValue
      // /* 去程*/
      // // 是否接站
      // const pickUpFlag = this.findEle('pickUpFlag').fieldValue
      // // 到达时间
      // const arriveTime = this.findEle('arriveTime').fieldValue
      // // 到达地点
      // const arriveStation = this.findEle('arriveStation').fieldValue
      // // 到达班次/车次
      // const arriveFlight = this.findEle('arriveFlight').fieldValue
      // /* 返程 */
      // // 返程时间
      // const returnTime = this.findEle('returnTime').fieldValue
      // // 是否送站
      // const pickOutFlag = this.findEle('pickOutFlag').fieldValue
      // // 返程地点
      // const returnStation = this.findEle('returnStation').fieldValue
      // // 返程班次/车次
      // const returnFlight = this.findEle('returnFlight').fieldValue
      // if (!arriveTimeCustom && (pickUpFlag || arriveTime || arriveStation || arriveFlight)) {
      //   this.$toast('请选择到达日期')
      //   return
      // }
      // if (!returnTimeCustom && (returnTime || pickOutFlag || returnStation || returnFlight)) {
      //   this.$toast('请选择返程日期')
      //   return
      // }
      // 验证
      const tabIndex = this.tabIndex
      // 对日期选择进行验证
      if (tabIndex === 1) {
        const verifyTime = this.verifyTime()
        if (!verifyTime) {
          return
        }
      }
      let isVerify = null
      let toast = ''
      if (tabIndex !== 2) {
        isVerify = this.verify(tabIndex)
      } else {
        isVerify = this.verify()
      }
      if (!isVerify) {
        return
      }
      if (this.tabIndex !== this.tabsData.length - 1) {
        this.tabsData.forEach(ele => {
          ele.checked = false
        })
        this.tabsData[++this.tabIndex].checked = true
        // this.setKeep(toast)
      } else {
        this.$dialog
          .confirm({
            title: '提交信息',
            message: '是否提交修改？',
            confirmButtonText: '确认提交',
            cancelButtonText: '暂不提交',
            className: 'customDialog'
          })
          .then(() => {
            // signStatus 1审核中 2不通过 3审核通过
            // if (Number(this.param.signStatus) !== 3) {
            //   toast = '报名变更成功'
            //   // this.paramsRequire.submitFlag = 1
            //   // toast = '添加参会人成功'
            // } else {
            //   this.paramsRequire.submitFlag = 1
            //   toast = '报名变更成功'
            // }
            this.paramsRequire.submitFlag = 1
            toast = '报名变更成功'
            // if (String(this.paramsRequire.sourceType) === '4') {
            //   toast = '代他人报名成功'
            // }
            this.setKeep(toast)
          })
          .catch(() => {})
      }
    },
    prev() {
      const tabIndex = this.tabIndex
      // 对日期选择进行验证
      if (tabIndex === 1) {
        const verifyTime = this.verifyTime()
        if (!verifyTime) {
          return
        }
      }
      this.tabsData.forEach(ele => {
        ele.checked = false
      })
      this.tabsData[--this.tabIndex].checked = true
      // this.tabIndex = this.tabIndex - 1
    },
    // 自定义单选
    selectSingleChange(ele) {
      this.popupShow = true
      this.groupIndex = ele.groupId
      this.basicSingleData(this.groupIndex).forEach(eleChild => {
        eleChild._showFlag = false
      })
      ele._showFlag = true
      // setTimeout(() => {
      //   this.$set(ele, '_showFlag', true)
      // })
    },
    popupClose() {
      const multipleFlag = this.multipleSeq
      const groupIndex = this.groupIndex
      if (multipleFlag) {
        // 重置多选框
        const multipleResult = this.multipleResult
        // 提取的提交的id
        const valueId = []
        multipleResult.forEach(ele => {
          const optionValue = this.multipleData.find(eleFind => String(ele) === String(eleFind.optionText)).optionValue
          valueId.push(optionValue)
        })
        this.basicMultipleData(groupIndex).forEach(ele => {
          if (ele.seq === this.multipleSeq) {
            ele.fieldValue = JSON.stringify(valueId)
            ele.fieldValueStr = multipleResult.join(',')
          }
        })
      } else {
        // 重置单选框
        this.basicSingleData(groupIndex).forEach((ele, index) => {
          ele._showFlag = false
        })
      }
      this.multipleResult = []
      this.multipleData = []
      this.multipleSeq = null
    },
    // 自定义多选
    selectMultipleChange(ele) {
      this.popupShow = true
      this.groupIndex = ele.groupId
      this.multipleSeq = ele.seq
      this.multipleResult = ele.fieldValueStr ? ele.fieldValueStr.split(',') : []
      const multipleData = []
      ele.signFormOptionVOs.forEach(eleData => {
        eleData.checked = 'checked'
        multipleData.push(eleData)
      })
      this.multipleData = multipleData
    },
    // 自定义下拉框
    selectOptionChange(ele) {
      this.actionShow = true
      this.groupIndex = ele.groupId
      this.optionFlag = String(ele.seq)
      ele.signFormOptionVOs.forEach(eleChild => {
        eleChild.name = eleChild.optionText
      })
      this.actions = ele.signFormOptionVOs
    },
    // actionsheet 选择事件
    onSelect(item) {
      const data = this.param.signFormConfigFormatVO
      const optionFlag = this.optionFlag
      // 当前点击的是否为标签选择
      if (!this.labelFlag) {
        if (optionFlag) {
          // 当前打开的是否是自定义下拉框
          this.basicOptionData(this.groupIndex).forEach(ele => {
            if (ele.seq === Number(this.optionFlag)) {
              ele.fieldValue = item.optionValue
              ele.fieldValueStr = item.name
            }
          })
        } else {
          Object.keys(data).forEach(ele => {
            if (data[ele]) {
              if (!Array.isArray(data[ele])) {
                if (data[ele] && data[ele].showFlag === 1) {
                  if (item.dicCode === ele) {
                    data[ele].fieldValue = String(item.valCode)
                    data[ele].fieldValueStr = item.name
                  }
                  if (ele === 'honourFlag') {
                    if (data[ele].fieldValue === '0') {
                      data.honourFlagArr.showFlag = 1
                    } else {
                      // 当选择为主宾时 将要传的值 清空 展示内容清空
                      this.attendantVal = ''
                      this.paramsRequire.linkAttendeeList = []
                      this.findEle('honourId').fieldValueStr = ''
                      this.findEle('honourId').fieldValue = null
                      this.findEle('honourFlagArr').fieldValueStr = ''
                      this.findEle('honourFlagArr').fieldValue = null
                      data.honourFlagArr.showFlag = 0
                    }
                  }
                  if (ele === 'bookTicketFlag') {
                    if (data[ele].fieldValue === '1') {
                      this.findEle('ticketFlag').showFlag = 1
                    } else {
                      this.findEle('ticketFlag').showFlag = 0
                      this.findEle('ticketFlag').fieldValue = null
                      this.findEle('ticketFlag').fieldValueStr = ''
                    }
                  }
                }
              }
            }
          })
        }
      } else {
        // 添加标签
        const tagsChoiceIndex = this.param.tagVOs.findIndex(ele => ele.id === item.id)
        if (tagsChoiceIndex === -1) {
          this.param.tagIds.push(item.id)
          this.param.tagVOs.push(item)
        }
        this.labelFlag = false
      }
      this.optionFlag = null
    },
    // 下拉基本选择
    selectBasicChange(ele) {
      const key = ele.fieldCode
      // honourFlagArr不是接口获取的 是手动添加进去的 当参会人类型为随员的时候 当选择honourFlagArr的时候打开主宾人选择
      if (key === 'honourFlagArr') {
        this.attendantShow = true
        return
      }
      this.actionShow = true
      if (key === 'sex') {
        this.actions = this.sexData
      } else if (key === 'nation') {
        this.actions = this.nationData
      } else if (key === 'positionLevel') {
        // 职级
        this.actions = this.positionLevelData
      } else if (key === 'cardType') {
        // 证件类型
        this.actions = this.cardTypeData
      } else if (key === 'honourFlag') {
        // 参会人类型
        this.actions = this.honourFlagData
      } else if (key === 'bookDinnerFlag') {
        // 是否用餐
        this.actions = this.bookDinnerFlagData
      } else if (key === 'bookStayFlag') {
        // 是否住宿
        this.actions = this.bookStayFlagData
      } else if (key === 'pickUpFlag') {
        // 是否接站
        this.actions = this.pickUpFlagData
      } else if (key === 'pickOutFlag') {
        // 是否送站
        this.actions = this.pickOutFlagData
      } else if (key === 'ticketFlag') {
        // 是否预定机票/车票/船票
        this.actions = this.ticketFlagData
      } else if (key === 'cardFlag') {
        // 是否制证
        this.actions = this.cardFlagData
      } else if (key === 'bookTicketFlag') {
        // 是否需要协助订票
        this.actions = this.bookTicketFlagData
      }
    },
    getForms() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.getForms',
          data: {
            conferenceId,
            // 是否内部表单
            innerFlag: this.paramsRequire.innerFlag
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            // 根据当前参会人状态设置roleFlag值,用于区分报名待审核时不需要插入待办任务
            if (Number(data.signStatus) === 1 || Number(this.attendeeOrRecordData.signStatus) === 1) {
              this.paramsRequire.roleFlag = 1 // 不需要插入待办任务
              console.log('不需要插入待办任务')
              // this.paramsRequire.updateFlag = 1
              // this.paramsRequire.submitFlag = 0
            } else {
              this.paramsRequire.roleFlag = 2
              console.log('需要插入待办任务')
              // this.paramsRequire.updateFlag = 2
              // this.paramsRequire.submitFlag = 1
            }
            this.param = this.paramHandler(this.attendeeOrRecordData || data)
            // this.param = data
            resolve(true)

            // Object.keys(forms).forEach(ele => {
            // 1 输入框 type 6 单选框 type 7 复选框 type 8 下拉列表 type 9 图片 type 10 附件
            // 1输入框 2多行文本 textarea type3 日期框 typ 4 数值  5 地址 6 单选框 7 复选框 8 下拉列表 type 9 图片 type 10 附件
            // })
          }
        })
      })
    },
    // 行程信息中的需要服务中的到达时间和返程时间 需要从来程信息和返程信息中提取出来 再额外放到顶部信息中去
    paramHandler(data) {
      // return data
      this.uploadCustomPic = [[], [], [], []]
      this.uploadCustomFile = [[], [], [], []]
      const forms = data.signFormConfigFormatVO
      Object.keys(forms).forEach(ele => {
        const eleDetail = forms[ele]
        if (eleDetail) {
          if (!Array.isArray(eleDetail)) {
            if (eleDetail.showFlag === 1) {
              if (eleDetail.fieldCode === 'ticketFlag') {
                if (forms.bookTicketFlag && forms.bookTicketFlag.fieldValue === '1') {
                  eleDetail.showFlag = 1
                } else if (forms.bookTicketFlag && forms.bookTicketFlag.fieldValue === '0') {
                  eleDetail.showFlag = 0
                }
                // 订票类型 机票/车票/船票
                if (eleDetail.fieldValue === '1') {
                  eleDetail.fieldValueStr = '去程'
                } else if (eleDetail.fieldValue === '2') {
                  eleDetail.fieldValueStr = '返程'
                } else if (eleDetail.fieldValue === '3') {
                  eleDetail.fieldValueStr = '往返'
                }
              }
              if (eleDetail.fieldCode === 'bookTicketFlag') {
                // 是否需要协助订票
                if (eleDetail.fieldValue === '1') {
                  eleDetail.fieldValueStr = '是'
                  if (forms.bookTicketFlag) {
                    forms.bookTicketFlag.showFlag = 1
                  }
                } else if (eleDetail.fieldValue === '0') {
                  eleDetail.fieldValueStr = '否'
                }
              }
              if (eleDetail.fieldCode === 'cardFlag') {
                // 是否制证
                if (eleDetail.fieldValue === '1') {
                  eleDetail.fieldValueStr = '是'
                } else if (eleDetail.fieldValue === '0') {
                  eleDetail.fieldValueStr = '否'
                }
              }
              if (eleDetail.fieldCode === 'arriveTime') {
                forms.arriveTimeCustom = Object.assign({}, eleDetail)
                forms.arriveTimeCustom.seq = 1
                forms.arriveTimeCustom.groupId = 2
                forms.arriveTimeCustom.fieldCode = 'arriveTimeCustom'
                forms.arriveTimeCustom.fieldLabel = '到达日期'
                if (eleDetail.fieldValue) {
                  this.arriveTime = eleDetail.fieldValue.slice(-8)
                  forms.arriveTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
                  forms.arriveTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
                  forms.arriveTime.fieldValue = eleDetail.fieldValue.slice(-8)
                  if (this.arriveTime !== '00:00:00') {
                    // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
                    forms.arriveTime.fieldValueStr = `${eleDetail.fieldValue.slice(-8, -6)}时${eleDetail.fieldValue.slice(-5, -3)}分`
                  }
                }
              }
              if (eleDetail.fieldCode === 'returnTime') {
                forms.returnTimeCustom = Object.assign({}, eleDetail)
                forms.returnTimeCustom.seq = 2
                forms.returnTimeCustom.groupId = 2
                forms.returnTimeCustom.fieldCode = 'returnTimeCustom'
                forms.returnTimeCustom.fieldLabel = '返程日期'
                if (eleDetail.fieldValue) {
                  this.returnTime = eleDetail.fieldValue.slice(-8)
                  forms.returnTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
                  forms.returnTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
                  forms.returnTime.fieldValue = eleDetail.fieldValue.slice(-8)
                  if (this.returnTime !== '00:00:00') {
                    // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
                    forms.returnTime.fieldValueStr = `${eleDetail.fieldValue.slice(-8, -6)}时${eleDetail.fieldValue.slice(-5, -3)}分`
                  }
                }
              }
            }
            if (eleDetail.fieldCode === 'photoUrl') {
              if (eleDetail.downloadUrl) {
                this.fileList = [{ content: eleDetail.downloadUrl }]
                // eleDetail.fieldValue = eleDetail.downloadUrl
              }
            }
            if (eleDetail.fieldCode === 'honourFlag' && eleDetail.showFlag) {
              // this.findEle('honourId').fieldValueStr = ''
              // this.findEle('honourId').fieldValue = null
              // this.findEle('honourFlagArr').fieldValueStr = ''
              // this.findEle('honourFlagArr').fieldValue = null
              const linkAttendeeList = data.linkAttendeeList
              this.paramsRequire.linkAttendeeList = linkAttendeeList
              const name = []
              const id = []
              if (linkAttendeeList) {
                linkAttendeeList.forEach(ele => {
                  name.push(ele.attendeeName)
                  id.push(ele.attendeeId)
                })
              }
              // 参会人类型要默认选择主宾
              eleDetail.fieldValue = eleDetail.fieldValue ? eleDetail.fieldValue : (eleDetail.fieldValue = '1')
              eleDetail.fieldValueStr = eleDetail.fieldValue ? eleDetail.fieldValueStr : '主宾'
              const showFlag = eleDetail.fieldValue === '0' ? 1 : 0
              // eleDetail.field  aaaaaaaaa
              // 如果选择随员 随员选项下面要选择主宾人
              const honourFlagArr = {
                id: -1,
                fieldCode: 'honourFlagArr',
                requireFlag: 1,
                seq: eleDetail.seq,
                fieldValue: id.join(','),
                fieldValueStr: name.join(','),
                fieldLabel: '主宾',
                groupId: 1,
                showFlag,
                type: 8
              }
              forms.honourFlagArr = honourFlagArr
            }
          } else {
            eleDetail.forEach(eleArr => {
              const fileIndex = eleArr.groupId - 1
              eleArr._showFlag = false
              if (eleArr.type === 9) {
                if (eleArr.fieldValue) {
                  console.log(9, eleArr.fieldValue)
                  eleArr.fieldValue = JSON.parse(eleArr.fieldValue)
                  const picDefault = []
                  eleArr.fieldValue.forEach(elePic => {
                    picDefault.push({
                      // content: `https://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/${elePic.fileUrl}`
                      // content: `https://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/${elePic}`
                      content: `${elePic.downloadUrl}`
                    })
                  })
                  this.uploadCustomPic[fileIndex].push(picDefault)
                } else {
                  this.uploadCustomPic[fileIndex].push([])
                }
              } else if (eleArr.type === 10) {
                if (eleArr.fieldValue) {
                  console.log(10, eleArr.fieldValue)
                  eleArr.fieldValue = JSON.parse(eleArr.fieldValue)
                  const picDefault = []
                  eleArr.fieldValue.forEach(elePic => {
                    let name = ''
                    if (elePic instanceof Object) {
                      // 经过修改 上传附件的逻辑之后 上传成功拿到整个后台返回的对象 其中包含 fileName filePath fileSize fileType等字段
                      name = elePic.fileName
                    } else {
                      // 之所以存在这种方式属于历史遗留问题 上线之前尽可能将此行代码删除掉 但是为了稳定性及兼容性 也可以保留此行代码
                      // 凡是涉及到附件展示的 都需要使用两种逻辑判断区分
                      name = elePic.slice(elePic.indexOf('attendeePhoto/') + 'attendeePhoto/'.length, elePic.length)
                    }
                    picDefault.push({
                      file: {
                        name,
                        type: 'text/plain'
                      }
                    })
                  })
                  this.uploadCustomFile[fileIndex].push(picDefault)
                } else {
                  this.uploadCustomFile[fileIndex].push([])
                }
              }
            })
          }
        }
      })
      // 将来程/去程的时间 和 班次/车次 调换顺序
      Object.keys(forms).forEach(ele => {
        const eleDetail = forms[ele]
        if (eleDetail && !Array.isArray(eleDetail)) {
          if (eleDetail.fieldCode === 'arriveTime' || eleDetail.fieldCode === 'returnTime') {
            eleDetail.seq++
          }
          if (eleDetail.fieldCode === 'arriveFlight' || eleDetail.fieldCode === 'returnFlight') {
            eleDetail.seq--
          }
        }
      })
      return data
    },
    // 查询参会人信息
    getAttendeeOrRecord() {
      const attendeeId = this.routeParams.attendeeId
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getAttendeeOrRecord',
        data: {
          id: attendeeId
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          this.paramsRequire.innerFlag = res.result.innerFlag
          this.attendeeOrRecordData = data
          this.paramsRequire.agendaIds = this.attendeeOrRecordData.agendaIds || []
          this.$api({
            url: 'attendeeApi.getRegSettings',
            data: {
              conferenceId
            }
          }).then(res => {
            if (res.success) {
              const data = res.result
              this.regSettingsData = data
              // 获取报名表单
              this.getForms()
              // 获取议程
              this.getAddAgenda()
            }
          })
        }
      })
    },
    // 获取会议详情
    getDetail() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.getDetail',
          data: {
            id: conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            this.detailData = data
            resolve()
          }
        })
      })
    },
    // 获取议程
    getAddAgenda() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.getAddAgenda',
          data: {
            conferenceId,
            queryFlag: 2
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            for (let i = 0; i < data.length; i++) {
              data[i].checked = false
            }
            data[0].checked = true
            this.recursAgenda(data)
            this.agendaData = data
            resolve()
          }
        })
      })
    },
    // 获取会议报名设置
    getRegSettings() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendeeApi.getRegSettings',
          data: {
            conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            this.regSettingsData = data
            resolve()
          }
        })
      })
    },
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
    // 手机号码验证
    mobileReg(value) {
      if (value.length === 11) {
        return true
      } else {
        return false
      }
    },
    // 邮箱验证
    emailReg(value) {
      const pattern = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      return pattern.test(value)
    },
    // 身份证验证
    cardReg(value) {
      const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      return pattern.test(value)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-attendee-container::v-deep {
  // background-color: #f8f8f8;
  min-height: 100%;
  background-color: #f8f8f8;
  .attendant-container {
    width: 100%;
    height: 100%;

    h3 {
      height: 57px;
      padding: 0 16px;
      > div {
        float: left;
        height: 100%;
        @include list(row, flex-start, center);
        color: #1e89ff;
        font-size: 15px;
        > span {
          margin-left: 6px;
        }
      }
    }
    .van-search {
      padding-left: 16px;
      padding-right: 16px;
    }
    .attendant-result-container {
      width: 100%;
      height: calc(100% - 121px);
      position: absolute;
      left: 0;
      top: 121px;
      overflow-y: scroll;
    }
    .attendant-result {
      padding: 16px;
      position: relative;
      margin-bottom: 10px;
      background-color: #fff;
      overflow: hidden;
      .name {
        font-size: 17px;
        margin-bottom: 12px;
        span {
          font-size: 14px;
        }
      }
      .phone {
        font-size: 14px;
      }
      i {
        display: block;
        width: calc(100% + 32px);
        width: calc(100% + 32px);
        height: 10px;
        background-color: #efeff4;
        @include absolute('', '', -10px, 0);
      }
    }
  }
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.72);
  }
  .images-preview-container {
    width: 100%;
    height: 100%;
    position: absolute;
    @include absolute(0, '', '', 0);
    padding-bottom: 56px;
    @include list(row, center, center);
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
      @include absolute('', '', 0, 0);
      @include list(row, center, center);
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
            @include absolute(50%, 0, '', '');
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .upload-file-custom {
    width: 100%;
    border-radius: 8px;
    padding-bottom: 17px;
    > h3 {
      padding: 17px 16px;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
      @include list(row, space-between, center);
      div {
        @include list(row, flex-start, center);
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
      @include list(row, flex-end, center);
    }
    .upload-btn-style {
      width: 200px;
      height: 38px;
    }
    .upload-preview {
      width: 100%;
      padding: 10px 10px 16px;
      @include list(row, space-between, center);
      .upload-preview-detail {
        @include list(row, flex-start, center);
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
  .upload-custom {
    width: 100%;
    border-radius: 8px;
    padding-bottom: 17px;
    > h3 {
      padding: 17px 16px;
      font-size: 15px;
      color: rgba(25, 31, 36, 0.64);
      line-height: 20px;
      @include list(row, space-between, center);
      div {
        @include list(row, flex-start, center);
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
          background-color: #f6f6f6;
          text-align: center;
          line-height: 60px;
          font-weight: 500;
          color: #dadadb;
          font-size: 20px;
        }
      }
    }
  }
  .pic-upload-list {
    width: 100%;
    height: 120px;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f1;
    .pic-upload-list-title {
      min-height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: rgba(25, 31, 36, 0.64);
      margin-bottom: 10px;
    }
    .pic-upload-list-btn {
      width: 60px;
      height: 60px;
      border-radius: 3px;
      overflow: hidden;
      .pic-upload-list-style {
        display: block;
        width: 60px;
        height: 60px;
        background-color: #f6f6f6;
        text-align: center;
        line-height: 60px;
        font-weight: bold;
        color: #dadadb;
        font-size: 20px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .tabs-container {
    width: 100%;
    height: 60px;
    line-height: 60px;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    padding: 0 33px;
    z-index: 9;
    @include list(row, space-between, center);
    li {
      position: relative;
    }
    .tabs-checked {
      color: rgba(30, 137, 255, 1);
      &::after {
        content: '';
        display: block;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40beff 0%, #1e89ff 100%);
        @include absolute('', 50%, 10px, '');
        transform: translate(50%);
      }
    }
  }
  .main-container {
    padding: 54px 0 60px 0;
    .departure-info {
      padding: 20px 16px;
      height: 22px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191f24;
      line-height: 22px;
    }
  }
  .van-tabs {
    position: fixed;
    z-index: 100;
    width: 100%;
    .van-tabs__wrap {
      height: 54px;
    }

    .van-tabs__nav--line {
      padding-bottom: 8px;
    }

    .van-tabs__line {
      background: linear-gradient(270deg, #40beff 0%, #1e89ff 100%);
      width: 30px;
    }

    .van-tab {
      font-size: 15px;
      font-weight: 500;
      height: 54px;
      &--active {
        color: #1e89ff;
      }
    }
  }
  .van-form .van-cell-group .read-only .van-cell__value .van-field__control {
    color: rgba(25, 31, 36, 0.64);
  }
  .van-form {
    padding-top: 12px;
    .van-cell-group {
      overflow: hidden;
      background: #fff;
      .van-cell {
        height: 76px;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f1;
        flex-direction: column;
        .van-field__label {
          width: 100%;
          min-height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: rgba(25, 31, 36, 0.64);
        }
        .van-cell__value {
          font-size: 18px;
          height: 36px;
          line-height: 36px;
          .van-field__control--right {
            text-align: left;
          }
          input::-webkit-input-placeholder {
            color: rgba(25, 31, 36, 0.64);
            font-size: 18px;
          }
        }
      }
      .custom-msg {
        height: 112px;
        // line-height: 112px;
        display: block;
        .van-cell__title {
          width: 100%;
        }
        .van-field__body {
          input {
            text-align: left;
          }
          .van-icon-arrow {
            transform: translateY(-50%);
          }
        }
        .van-cell__value {
          height: 56px;
        }
      }
      &.middle {
        margin: 10px 0 16px 0;
      }
      &.upload-box {
        padding: 0 10px 24px 10px;
        .title {
          font-size: 15px;
          font-weight: 400;
          color: rgba(25, 31, 36, 0.64);
          line-height: 20px;
          margin: 17px 0 17px 6px;
        }
      }
    }
    .show-photo {
      position: relative;
      .van-field__body .van-field__control {
        font-size: 0;
      }
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        background: #d8d8d8;
        position: absolute;
        right: 30px;
        top: -5px;
      }
    }
    .van-cell {
      &--required {
        &::before {
          content: '';
        }
        .van-cell__title {
          width: auto;
          flex: none;
          span {
            position: relative;
            white-space: nowrap;
            &:before {
              position: absolute;
              right: -10px;
              color: #ee0a24;
              font-size: 14px;
              content: '*';
            }
          }
        }
      }
    }
  }
  .page-bottom {
    position: fixed;
    bottom: 0;
    padding: 6px 16px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);
    z-index: 2;
    .van-button {
      width: 100%;
      height: 38px;
      border-radius: 4px;
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
  .van-action-sheet {
    max-height: 40%;
  }
  .van-popup {
    background-color: #efeff4;
    .popup-choice-container {
      padding-bottom: 56px;
      overflow-y: scroll;
    }
    .popup-btn {
      width: 100%;
      height: 56px;
      line-height: 56px;
      position: fixed;
      left: 0;
      bottom: 0;
      button {
        width: 100%;
        height: 100%;
      }
    }
  }
  .agenda-container {
    width: 100%;
    .agenda-list {
      .title {
        width: 100%;
        height: 56px;
        @include list(row, flex-start, center);
        font-size: 16px;
        line-height: 56px;
        padding: 0 12px;
        img {
          width: 20px;
          margin-left: 5px;
        }
      }
      .detail {
        width: 100%;
        // padding: 0 12px;
        margin-bottom: 12px;
        .content {
          padding: 16px 20px;
          // border-radius: 16px;
          background-color: #fff;
          .time {
            font-size: 14px;
            color: #586e81;
            height: 18px;
            line-height: 18px;
            margin-bottom: 16px;
            @include list(row, flex-start, center);
            position: relative;
            .time-detail {
              margin-right: 5px;
            }
            .tips {
              font-size: 10px;
              line-height: 14px;
              font-weight: bold;
              // margin-left: 5px;
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
              @include absolute(0, 0, '', '');
              width: 24px;
              height: 24px;
            }
            .choice-ban {
              background-color: rgba(199, 200, 202, 0.5);
              border-radius: 50%;
            }
          }
          h4 {
            font-size: 16px;
            line-height: 21px;
            // margin-bottom: 8px;
          }
          .address {
            font-size: 13px;
            color: rgba(25, 31, 36, 0.56);
            line-height: 18px;
            @include list(row, flex-start, center);
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
                @include absolute(3px, '', '', 3px);
                background-color: rgba(236, 236, 236, 1);
              }
              &::before {
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                @include absolute(2px, '', '', 0, 2);
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
                @include absolute('', -16px, 16px, '');
              }
            }
          }
        }
      }
    }
  }
}
</style>
