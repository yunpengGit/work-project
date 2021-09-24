<!--
 * @Author: your name
 * @Date: 2021-07-07 16:13:18
 * @LastEditTime: 2021-09-10 01:22:36
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\src\projects\conference\views\signUp\AgendaInfo.vue
-->
<template>
  <div class="add-attendee-container">
    <div class="main-container" v-if="isLoading">
      <div class="examine-status" v-if="param.signStatus === 2 && examineStatusShow">
        <dl>
          <dt>
            {{ param.signStatusStr }}
            <van-icon name="cross" @click="examineStatusShow = false" />
          </dt>
          <dd>{{ param.verifyReason }}</dd>
        </dl>
      </div>
      <div class="attendee-item">
        <div class="read-title">
          <span class="line"></span>
          <span class="text">基本信息</span>
        </div>
        <!-- <van-notice-bar mode="closeable" color="#785900" background="#FFF8E4">*标信息请填写完整，确认无误后点击下一步。</van-notice-bar> -->
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(1)" :key="index">
              <van-field
                readonly
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
              <!-- 6不可能出现了 因为将6统一都改成了8 -->
              <!-- <van-field
                v-if="ele.type === 6"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <!-- 基本信息暂时无复选框 -->
              <!-- <van-field
                v-if="ele.type === 7"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <van-field
                readonly
                v-if="ele.type === 8"
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div
                  class="pic-upload-list-title"
                  :class="ele.requireFlag === 1 ? 'pic-upload-list-title-checked' : ''"
                >
                  <span>{{ ele.fieldLabel }}<i style="color:#ee0a24;margin-left: 4px;">{{ele.requireFlag === 1?'*':''}}</i></span>
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader readonly disabled v-show="!fileList.length" v-model="fileList" :preview-image="false">
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" alt="" @click="basicPicPreview(ele)" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(1)" :key="ele.id">
              <van-field
                readonly
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
            </div>
            <div v-for="ele in basicSingleData(1)" :key="ele.id">
              <van-field
                readonly
                class="custom-msg"
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicMultipleData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicOptionData(1)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
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
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[0][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomPic[0][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
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
                    <img :src="filePic(elePic)" alt="" @click="showPic(index, keyIndex, ele)" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                </div>
              </div>
            </div>
          </van-cell-group>
        </van-form>
      </div>
      <div class="attendee-item">
        <div class="read-title">
          <span class="line"></span>
          <span class="text">行程信息</span>
        </div>
        <van-form>
          <van-cell-group>
            <div v-for="(ele, index) in basicData(2)" :key="index">
              <van-field
                readonly
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <!-- 6不可能出现了 因为将6统一都改成了8 -->
              <!-- <van-field
                v-if="ele.type === 6"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <!-- 基本信息暂时无复选框 -->
              <!-- <van-field
                v-if="ele.type === 7"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div
                  class="pic-upload-list-title"
                  :class="ele.requireFlag === 1 ? 'pic-upload-list-title-checked' : ''"
                >
                  <span>{{ ele.fieldLabel }}<i style="color:#ee0a24;margin-left: 4px;">{{ele.requireFlag === 1?'*':''}}</i></span>
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader
                    readonly
                    disabled
                    v-model="fileList"
                    :after-read="afterReadPic(ele)"
                    :before-read="beforeReadPic(ele)"
                  >
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" alt="" @click="basicPicPreview(ele)" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(2)" :key="ele.id">
              <van-field
                readonly
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
            </div>
            <div v-for="ele in basicSingleData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicMultipleData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicOptionData(2)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
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
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[1][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomPic[1][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
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
                    <img :src="filePic(elePic)" alt="" @click="showPic(index, keyIndex, ele)" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[1][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomFile[1][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
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
                readonly
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <!-- 6不可能出现了 因为将6统一都改成了8 -->
              <!-- <van-field
                v-if="ele.type === 6"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <!-- 基本信息暂时无复选框 -->
              <!-- <van-field
                v-if="ele.type === 7"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div
                  class="pic-upload-list-title"
                  :class="ele.requireFlag === 1 ? 'pic-upload-list-title-checked' : ''"
                >
                  <span>{{ ele.fieldLabel }}<i style="color:#ee0a24;margin-left: 4px;">{{ele.requireFlag === 1?'*':''}}</i></span>
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader readonly disabled v-model="fileList">
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" alt="" @click="basicPicPreview(ele)" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(3)" :key="ele.id">
              <van-field
                readonly
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
            </div>
            <div v-for="ele in basicSingleData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicMultipleData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicOptionData(3)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
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
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[2][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomPic[2][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
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
                    <img :src="filePic(elePic)" alt="" @click="showPic(index, keyIndex, ele)" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[2][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomFile[2][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
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
                readonly
                v-if="ele.type === 1"
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
              <van-field
                v-if="ele.type === 3"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <!-- 6不可能出现了 因为将6统一都改成了8 -->
              <!-- <van-field
                v-if="ele.type === 6"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <!-- 基本信息暂时无复选框 -->
              <!-- <van-field
                v-if="ele.type === 7"
                readonly
                v-model="ele.fieldValue"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                :placeholder="`请选择`"
                input-align="right"
                right-icon="arrow"
                @click="selectBasicChange(ele)"
              /> -->
              <van-field
                v-if="ele.type === 8"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
              <div v-if="ele.type === 9" class="pic-upload-list">
                <div
                  class="pic-upload-list-title"
                  :class="ele.requireFlag === 1 ? 'pic-upload-list-title-checked' : ''"
                >
                  <span>{{ ele.fieldLabel }}<i style="color:#ee0a24;margin-left: 4px;">{{ele.requireFlag === 1?'*':''}}</i></span>
                </div>
                <div class="pic-upload-list-btn">
                  <van-uploader
                    disabled
                    v-model="fileList"
                    :after-read="afterReadPic(ele)"
                    :before-read="beforeReadPic(ele)"
                  >
                    <div class="pic-upload-list-style">+</div>
                  </van-uploader>
                  <img :src="fileList.length ? fileList[0].content : ''" alt="" @click="basicPicPreview(ele)" />
                </div>
              </div>
            </div>
            <div v-for="ele in basicInputData(4)" :key="ele.id">
              <van-field
                readonly
                class="custom-msg"
                v-model="ele.fieldValue"
                :maxlength="ele.signFormFieldRuleVO.maxLength"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                :rules="[{ required: ele.requireFlag === 1 ? true : false, message: '' }]"
                placeholder="未填写"
              />
            </div>
            <div v-for="ele in basicSingleData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicMultipleData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
              />
            </div>
            <div v-for="ele in basicOptionData(4)" :key="ele.id">
              <van-field
                class="custom-msg"
                readonly
                v-model="ele.fieldValueStr"
                :required="ele.requireFlag === 1 ? true : false"
                :label="ele.fieldLabel"
                input-align="right"
                placeholder="未选择"
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
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                  <img :src="elePic.content" alt="" @click="showPic(index, keyIndex, ele)" />
                </div>
                <div class="upload-btn" v-if="uploadCustomPic[3][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    readonly
                    disabled
                    v-model="uploadCustomPic[3][index]"
                    :preview-image="false"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
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
                    <img :src="filePic(elePic)" alt="" @click="showPic(index, keyIndex, ele)" />
                    <span>{{ elePic.file.name }}</span>
                  </div>
                  <div class="upload-del-btn"><van-icon name="cross" /></div>
                </div>
                <div class="upload-btn" v-if="uploadCustomFile[3][index].length < ele.signFormFieldRuleVO.uploadCount">
                  <van-uploader
                    disabled
                    v-model="uploadCustomFile[3][index]"
                    :max-count="ele.signFormFieldRuleVO.uploadCount"
                    :preview-image="false"
                    :after-read="afterReadFile(ele)"
                    :before-read="beforeReadFile(ele)"
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
      <div class="agenda-container" v-if="agendaData && agendaData.length">
        <div class="read-title">
          <span class="line"></span>
          <span class="text">议程信息</span>
        </div>
        <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
          <div class="title" @click="agendaShow(index)">
            <img v-if="ele.checked" src="@/assets/images/arrowDown.svg" alt="" /><img
              v-if="!ele.checked"
              src="@/assets/images/arrowRight.svg"
              alt=""
            />
            {{ ele.date }}
            {{ getWeek(ele.date) }}
          </div>
          <div class="detail-container" v-if="ele.checked">
            <div
              v-for="(eleChild, eleIndex) in ele.children"
              :key="eleIndex"
              class="detail"
              :style="{ 'margin-bottom': eleIndex == ele.children.length - 1 ? '' : '12px' }"
            >
              <div class="content">
                <div class="time">
                  <span class="time-detail">{{ eleChild.startTime }}-{{ eleChild.endTime }}</span>
                  <div class="tips">
                    <div class="recom" v-if="eleChild.recommend">{{ eleChild.recommend }}</div>
                    <div class="freeFlag" v-if="!eleChild.freeFlag">必选议程</div>
                  </div>
                </div>
                <h4>{{ eleChild.name }}</h4>
                <div class="address"><img src="@/assets/images/place.svg" alt="" />{{ eleChild.address }}</div>
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
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
      @close="sheetClose"
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
              >
                <template #right-icon>
                  <van-checkbox :name="eleChild.optionText" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
      <div class="popup-btn"><van-button type="default">确认</van-button></div>
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
    <van-overlay :show="imgPreviewShow" z-index="998">
      <div class="images-preview-container">
        <!-- @click.stop -->
        <div class="images-preview">
          <img :src="imagesPreview.src" alt="" />
        </div>
        <ul class="images-preview-btn">
          <li @click="imgPreviewShow = false">关闭</li>
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
        <van-search v-model="attendantVal" @search="attendantSearch" />
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
    <van-action-sheet
      v-model="examine"
      :actions="actionsExamine"
      cancel-text="取消"
      description="选择审核意见"
      close-on-click-action
      @select="onSelectExamine"
      @close="sheetCloseExamine"
    />
    <van-overlay :show="examineShow" z-index="999" class-name="examine-container" v-if="examineData.length">
      <div class="examine">
        <h3>填写审核理由</h3>
        <div class="val">
          <van-field
            v-model="examineReason"
            rows="1"
            type="textarea"
            maxlength="300"
            show-word-limit
            placeholder="请填写审核理由"
            @input="examineChange"
          />
          <!-- <textarea name="" id="" cols="30" rows="10" v-model="examineReason"></textarea> -->
        </div>
        <ul class="oper">
          <li v-for="(ele, index) in examineData" :key="index" @click="examineClick(index)">
            <div class="item">
              <div v-if="ele.checked" class="item-icon"><img src="@/assets/images/checked.svg" alt="" /></div>
              {{ ele.title }}
              <!-- <span><img :src="ele.checked ? checked : ''" alt="">{{ ele.title }}</span> -->
            </div>
          </li>
          <li>
            <div class="examine-btn" @click="examineClose">关闭</div>
            <div class="examine-btn" @click="examineSubmit">确认</div>
          </li>
        </ul>
      </div>
    </van-overlay>
    <div class="bottom" v-if="showBottomBtn">
      <!-- 审核中-撤回报名申请+修改报名信息-signStatus=1 -->
      <!-- 审核通过-取消报名+修改报名信息-signStatus=3 -->
      <!-- 不通过-重新提交-signStatus=2 -->
      <van-button
        block
        type="default"
        @click="
          $router.push({
            name: 'cancelApply',
            query: {
              [$enc('conferenceId')]: $enc(routeParams.conferenceId),
              [$enc('attendeeId')]: $enc(routeParams.attendeeId),
              [$enc('attendeeName')]: $enc(routeParams.attendeeName),
              [$enc('signStatus')]: $enc(routeParams.signStatus)
            }
          })
        "
        v-if="routeParams.signStatus != 2"
        >{{ routeParams.signStatus == 1 ? '撤回报名申请' : '取消报名' }}</van-button
      >
      <van-button block type="info" @click="linkEditApply" v-if="routeParams.signStatus == 2">重新提交申请</van-button>
      <van-button
class="edit-btn"
block
type="info"
@click="linkEditApply"
v-if="routeParams.signStatus != 2"
        >修改报名信息</van-button
      >
    </div>
    <div class="bottom" v-if="!showBottomBtn">
      <van-button block type="info" disabled>{{noticeStr}}</van-button>
    </div>
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
import checked from '@/assets/images/checked.svg'

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
      checked,
      examineStatusShow: true,
      examineIndex: 0,
      // 审核原因
      examineData: [],
      // 审核弹窗
      examineShow: false,
      // 审核拒绝原因
      examineReason: '',
      examine: false,
      actionsExamine: [{ name: '通过' }, { name: '不通过' }],
      isLoading: false,
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
      tabsData: [
        { text: '基本信息', checked: true },
        { text: '行程信息', checked: false },
        { text: '议程安排', checked: false }
      ],
      actionShow: false,
      popupShow: false,
      actions: [],
      // 当前选的tab项
      tabIndex: 0,
      // 当前点击的是否为标签选择
      labelFlag: false,
      // 标签选项
      labelData: [],
      // 标签已选择
      labelChoiceData: [],
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
        { name: '是', dicCode: 'ticketFlag', valCode: 1 },
        { name: '否', dicCode: 'ticketFlag', valCode: 0 }
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
      // 必传参数
      paramsRequire: {
        conferenceId: '',
        // 0仅保存 1提交
        submitFlag: 0,
        // 用户id
        userId: '',
        // 数据来源（1：后台录入，2：自主报名，3：联系人代报名 4:会务组代报名）
        sourceType: 1,
        // 商密网内部用户标识 1 是 0 否
        innerFlag: 1,
        // 必填 会务组1 参会人2
        roleFlag: 1,
        // 议程信息
        agendaIds: [],
        // 标签
        tagIds: []
      },
      password: '',
      // 获取会议报名设置 需要拿到是否允许非商网用户报名
      regSettingsData: null,
      // 获取会议详情
      detailData: null,
      timeFlag: true,
      agendaData: null,
      showBottomBtn: true, // 当前参会人有待审核的报名信息变更、取消报名、行程变更、请假时不展示底部操作按钮
      noticeStr: ''
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
                      // console.log(11, eleCustom, 'aaaaaaaaaaaa')
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
                      const fieldValue = Array.isArray(eleCustom.fieldValue)
                        ? eleCustom.fieldValue
                        : JSON.parse(eleCustom.fieldValue)
                      const selectData = eleCustom.signFormOptionVOs
                      const fieldValueStr = []
                      if (fieldValue) {
                        fieldValue.forEach(eleOption => {
                          const filterData = selectData.find(
                            eleDetail => String(eleDetail.optionValue) === String(eleOption)
                          )
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
                        eleCustom.fieldValueStr = selectData.find(
                          eleFind => String(eleFind.optionValue) === String(eleCustom.fieldValue)
                        ).optionText
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
                  } else {
                    // data[ele].fieldValueStr = '未填写'
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
    }
  },
  created() {
    // 我作为参会人的申请
    this.mySelfapply()
    const conferenceId = this.routeParams.conferenceId
    const attendeeId = this.routeParams.attendeeId
    // 根据 replaceIdent 判断是否是代他人报名
    const replaceIdent = this.routeParams.replaceIdent
    if (replaceIdent) {
      this.paramsRequire.sourceType = replaceIdent
    }
    // this.params.conferenceId = conferenceId
    // this.params.attendeeId = attendeeId
    this.paramsRequire.conferenceId = conferenceId
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
      // 获取会议报名设置
      // await this.getRegSettings()
      // 获取会议详情
      await this.getDetail()
      this.$api({
        // getHandleRecord getAttendeeDetail
        url: 'attendeeApi.getAttendeeDetail',
        data: {
          id: attendeeId
        }
      }).then(res => {
        const data = res.result
        // 存在草稿
        this.param = this.paramHandler(data)
        this.isLoading = true
        console.log(data.signStatus, '报名状态', data.changeStatus)
        // 获取议程
        this.getAddAgenda()
      })
    }.bind(this)
    getData()
    // 获取报名表单
    // this.getForms()
  },
  methods: {
    // 我作为参会人的申请
    mySelfapply() {
      const conferenceId = this.routeParams.conferenceId
      const attendeeId = this.routeParams.attendeeId
      this.$api({
        url: 'attendeeApi.mySelfapply',
        data: {
          conferenceId,
          pageNum: 1, // 传入固定参数，本接口仅需验证有数据即可
          pageSize: 10, // 传入固定参数，本接口仅需验证有数据即可
          statusEqual: '1', // 状态为待办
          attendeeId
        }
      }).then(res => {
        if (res.success) {
          const data = res.result
          if (data.list.length > 0) {
            const applyType = Number(data.list[0].type)
            if (applyType !== 1) {
              let noticeStr = ''
              if (applyType === 2) {
                noticeStr = '报名信息变更'
              } else if (applyType === 3) {
                noticeStr = '取消报名'
              } else if (applyType === 4) {
                noticeStr = '行程变更'
              } else if (applyType === 5) {
                noticeStr = '请假'
              }
              noticeStr = noticeStr + '申请正在审核中...'
              this.noticeStr = noticeStr
              this.showBottomBtn = false
            }
          }
        }
      })
    },
    examineSubmit() {
      const index = this.examineIndex
      if (index === 0) {
        // 返回重填
        this.examineRefuse()
      } else if (index === 1) {
        // 禁止报名
        this.examineReject()
      }
    },
    // 审核textarea输入框变化事件
    examineChange(val) {
      const index = this.examineIndex
      this.examineData[index].auditMind = val
    },
    // 审核弹出框审核类型选择
    examineClick(index) {
      this.examineIndex = index
      this.examineData.forEach(ele => {
        ele.checked = false
      })
      this.examineData[index].checked = true
      this.examineReason = this.examineData[index].auditMind
    },
    // 禁止报名
    examineReject() {
      if (!this.examineReason.length) {
        this.$toast('请填写审核理由')
        return false
      }
      // reject
      this.$dialog
        .confirm({
          message: '请确认是否审核不通过该报名信息？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          className: 'customDialog'
        })
        .then(() => {
          const attendeeIds = this.routeParams.attendeeId
          // const now = new Date()
          // const attendeeModifyTime = `${now.getFullYear()}-${(now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${(now.getDate() + 1) < 10 ? `0${now.getDate() + 1}` : now.getDate() + 1} ${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}:${now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()}`
          const attendeeModifyTime = this.param.modifyTime
          const params = {
            attendeeIds: [attendeeIds],
            attendeeModifyTime,
            auditType: 1,
            signStatus: -3,
            verifyReason: this.examineReason
          }
          this.$api({
            url: 'attendee.reject',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              this.$api({
                url: 'attendee.editVerifyReason',
                data: {
                  conferenceId: this.examineData[this.examineIndex].conferenceId,
                  // attendeeId: this.examineData[this.examineIndex].attendeeId,
                  attendeeId: this.param.verifyUserId || this.detailData.createUserId,
                  auditMind: this.examineReason,
                  id: this.examineData[this.examineIndex].id,
                  type: this.examineIndex
                }
              }).then(reasonRes => {
                if (reasonRes.code === 2000) {
                  this.$toast('操作成功')
                  setTimeout(() => {
                    if (this.routeParams.taskType || this.routeParams.taskId) {
                      if (sessionStorage.getItem('isJumpToHome')) {
                        sessionStorage.removeItem('isJumpToHome')
                        this.$router.replace({
                          name: 'conferenceDesk',
                          query: {
                            [this.$enc('id')]: this.$enc(this.routeParams.conferenceId)
                          }
                        })
                      } else {
                        this.$router.go(-1)
                      }
                      // this.$router.go(-1)
                      // this.$router.replace({
                      //   name: 'backlog',
                      //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                      // })
                    } else {
                      this.$router.go(-1)
                    }
                  }, 300)
                }
              })
            }
          })
        })
        .catch(() => {})
    },
    // 退回重填
    examineRefuse() {
      if (!this.examineReason.length) {
        this.$toast('请填写审核理由')
        return false
      }
      this.$dialog
        .confirm({
          message: '请确认是否审核不通过该报名信息？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          className: 'customDialog'
        })
        .then(() => {
          const attendeeIds = this.routeParams.attendeeId
          const attendeeModifyTime = this.param.modifyTime
          const params = {
            attendeeIds: [attendeeIds],
            attendeeModifyTime,
            auditType: 1,
            signStatus: 2,
            verifyReason: this.examineReason
          }
          this.$api({
            url: 'attendee.reject',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              this.$api({
                url: 'attendee.editVerifyReason',
                data: {
                  conferenceId: this.examineData[this.examineIndex].conferenceId,
                  attendeeId: this.param.verifyUserId || this.detailData.createUserId,
                  // attendeeId: this.examineData[this.examineIndex].attendeeId,
                  auditMind: this.examineReason,
                  id: this.examineData[this.examineIndex].id,
                  type: this.examineIndex
                }
              }).then(reasonRes => {
                if (reasonRes.code === 2000) {
                  this.$toast('操作成功')
                  setTimeout(() => {
                    if (this.routeParams.taskType || this.routeParams.taskId) {
                      if (sessionStorage.getItem('isJumpToHome')) {
                        sessionStorage.removeItem('isJumpToHome')
                        this.$router.replace({
                          name: 'conferenceDesk',
                          query: {
                            [this.$enc('id')]: this.$enc(this.routeParams.conferenceId)
                          }
                        })
                      } else {
                        this.$router.go(-1)
                      }
                      // this.$router.go(-1)
                      // this.$router.replace({
                      //   name: 'backlog',
                      //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                      // })
                    } else {
                      this.$router.go(-1)
                    }
                  }, 300)
                }
              })
            }
          })
        })
        .catch(() => {})
    },
    // 审核通过
    approved(signStatus) {
      const attendeeIds = this.routeParams.attendeeId
      const attendeeModifyTime = this.param.modifyTime
      const updateFlag = {
        updateFlag: 1
      }
      Object.keys(this.param.signFormConfigFormatVO).forEach(ele => {
        if (ele.includes('Custom')) {
          delete this.param.signFormConfigFormatVO[ele]
        }
        if (ele === 'honourFlagArr') {
          delete this.param.signFormConfigFormatVO[ele]
        }
      })
      if (
        this.param.signFormConfigFormatVO.photoUrl.fieldValue &&
        Array.isArray(this.param.signFormConfigFormatVO.photoUrl.fieldValue)
      ) {
        this.param.signFormConfigFormatVO.photoUrl.fieldValue =
          this.param.signFormConfigFormatVO.photoUrl.fieldValue.join()
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
      const subParams = {
        attendeeCommonPO: Object.assign({}, this.param, signFormConfigFormatPO, updateFlag),
        attendeeIds: [Number(attendeeIds)],
        // 修改时间
        attendeeModifyTime,
        // 1：报名审核 2：报名变更审核 3取消参会 4行程变更 5请假
        auditType: signStatus,
        signStatus: 3,
        submitFlag: 0,
        verifyReason: null
      }
      this.$dialog
        .confirm({
          message: '请确认是否审核通过该报名信息？',
          confirmButtonText: '确定通过',
          cancelButtonText: '取消',
          className: 'customDialog'
        })
        .then(() => {
          this.$api({
            url: 'attendee.reject',
            data: subParams
          }).then(res => {
            if (res.code === 2000) {
              this.$toast('审核通过成功')
              setTimeout(() => {
                if (this.routeParams.taskType || this.routeParams.taskId) {
                  if (sessionStorage.getItem('isJumpToHome')) {
                    sessionStorage.removeItem('isJumpToHome')
                    this.$router.replace({
                      name: 'conferenceDesk',
                      query: {
                        [this.$enc('id')]: this.$enc(this.routeParams.conferenceId)
                      }
                    })
                  } else {
                    this.$router.go(-1)
                  }
                  // this.$router.replace({
                  //   name: 'backlog',
                  //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                  // })
                } else {
                  this.$router.go(-1)
                }
              }, 300)
            }
          })
        })
        .catch(() => {
          this.examine = true
        })
    },
    // 报名审核弹窗关闭
    examineClose() {
      this.examineShow = false
      this.examine = true
    },
    examineHandler(type) {
      this.examine = true
    },
    onSelectExamine(item) {
      const type = item.name
      // 参会状态（ -3 报名驳回 -2 失效 -1 取消参会 0草稿 1报名待审核 2 报名不通过  3成功报名   ）
      const signStatus = this.param.signStatus
      if (type === '通过') {
        this.approved(signStatus)
      } else if (type === '不通过') {
        this.examineShow = true
        const conferenceId = this.routeParams.conferenceId
        const attendeeId = this.param.verifyUserId || this.detailData.createUserId
        this.$api({
          url: 'attendee.getVerifyReason',
          data: {
            conferenceId,
            attendeeId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.checked = false
            })
            data[0].title = '返回重新填写'
            data[1].title = '取消报名资格'
            data[0].checked = true
            this.examineData = data
            this.examineReason = data[0].auditMind
            console.log(res)
          }
        })
      }
    },
    sheetCloseExamine() {
      console.log('关闭弹窗')
    },
    // 取消参会
    cacelSignUp() {
      this.$dialog
        .confirm({
          message: '取消参会后参会人需要重新申请，请确认是否继续？',
          confirmButtonText: '确定取消',
          cancelButtonText: '暂不取消',
          className: 'cacelSignUp'
        })
        .then(() => {
          const conferenceId = this.routeParams.conferenceId
          const attendeeIds = this.routeParams.attendeeId
          this.$api({
            url: 'attendee.cacelSignIP',
            data: {
              conferenceId,
              attendeeIds: [attendeeIds]
            }
          }).then(res => {
            if (res.code === 2000) {
              this.$toast('取消参会成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 300)
            }
          })
        })
        .catch(() => {})
    },
    // 随缘选择弹窗关闭
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
        url: 'attendee.getAttendant',
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
      const result = []
      const recursFunc = data => {
        if (!data) {
          return
        }
        data.forEach(ele => {
          if (ele.id) {
            ele._checked = false
            result.push(ele)
            if (!ele.freeFlag) {
              // 如果是必选就添加进入到日程数组内用作提交
              this.paramsRequire.agendaIds.push(ele.id)
            }
            if (this.param.agendaVOs.length && this.param.agendaVOs.find(eleFind => eleFind.id === ele.id)) {
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
    // 选择议程
    choiceAgenda(ele, eleChild) {
      if (eleChild.freeFlag) {
        eleChild._checked = !eleChild._checked
        if (eleChild._checked) {
          this.paramsRequire.agendaIds.push(eleChild.id)
        } else {
          const index = this.paramsRequire.agendaIds.findIndex(idEle => idEle === eleChild.id)
          this.paramsRequire.agendaIds.splice(index, 1)
        }
      }
    },
    // 议程展开与收起
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
        this.findEle(key).fieldValue = this.findEle('arriveTimeCustom').fieldValue
          ? `${this.findEle('arriveTimeCustom').fieldValue.slice(0, 10)} ${this.formatHourSymbol(hour, minutes)}`
          : this.formatHourSymbol(hour, minutes)
      } else if (key === 'returnTime') {
        const hour = val[0]
        const minutes = val[1]
        this.findEle(key).fieldValueStr = `${val[0]}${val[1]}`
        this.findEle(key).fieldValue = this.findEle('returnTimeCustom').fieldValue
          ? `${this.findEle('returnTimeCustom').fieldValue.slice(0, 10)} ${this.formatHourSymbol(hour, minutes)}`
          : this.formatHourSymbol(hour, minutes)
      } else if (key === 'arriveTimeCustom') {
        this.findEle(key).fieldValueStr = val[0]
        // this.findEle('arriveTime').fieldValue = this.findEle('arriveTime').fieldValue ? `${this.formatCodeSymbol(val[0])} ${this.findEle('arriveTime').fieldValue.slice(-8)}` : `${this.formatCodeSymbol(val[0])} 00:00:00`
        this.findEle('arriveTime').fieldValue = `${this.formatCodeSymbol(val[0])} 00:00:00`
        this.findEle(key).fieldValue = this.findEle('arriveTime').fieldValue
          ? `${this.formatCodeSymbol(val[0])} ${this.findEle('arriveTime').fieldValue.slice(-8)}`
          : `${this.formatCodeSymbol(val[0])} 00:00:00`
      } else if (key === 'returnTimeCustom') {
        this.findEle(key).fieldValueStr = val[0]
        // this.findEle('returnTime').fieldValue = this.findEle('returnTime').fieldValue ? `${this.formatCodeSymbol(val[0])} ${this.findEle('returnTime').fieldValue.slice(-8)}` : `${this.formatCodeSymbol(val[0])} 00:00:00`
        this.findEle('returnTime').fieldValue = `${this.formatCodeSymbol(val[0])} 00:00:00`
        this.findEle(key).fieldValue = this.findEle('returnTime').fieldValue
          ? `${this.formatCodeSymbol(val[0])} ${this.findEle('returnTime').fieldValue.slice(-8)}`
          : `${this.formatCodeSymbol(val[0])} 00:00:00`
      }
      setTimeout(() => {
        const startDate = this.findEle('arriveTimeCustom').fieldValue
        const endDate = this.findEle('returnTimeCustom').fieldValue
        if (startDate && endDate) {
          if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
            this.$dialog
              .alert({
                message: '到达日期不得大于返程日期，请重新选择到达日期或调整返程日期',
                confirmButtonText: '确定',
                className: 'customDialog'
              })
              .then(() => {
                this.findEle('arriveTimeCustom').fieldValue = ''
                this.findEle('arriveTimeCustom').fieldValueStr = ''
                this.timeData = []
              })
            return
          }
        }
        const startTime = this.findEle('arriveTime').fieldValue
        const endTime = this.findEle('returnTime').fieldValue
        const pickUpFlag = this.findEle('pickUpFlag').fieldValue
        const pickOutFlag = this.findEle('pickOutFlag').fieldValue
        if (startTime && endTime && Number(pickUpFlag) === 1 && Number(pickOutFlag) === 1) {
          if (new Date(startDate).getTime() === new Date(endDate).getTime()) {
            // 如果开始日期和结束日期选择在了同一天 则将开始时间置空重新选择
            if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
              this.$dialog
                .alert({
                  message: '到达日期不得大于返程日期，请重新选择到达时间或调整返程时间',
                  confirmButtonText: '确定',
                  className: 'customDialog'
                })
                .then(() => {
                  this.findEle('arriveTime').fieldValue = ''
                  this.findEle('arriveTime').fieldValueStr = ''
                  this.timeData = []
                })
            }
          }
        }
      })
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
      const startTime = this.detailData.startTime
      const endTime = this.detailData.endTime
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
      const finalStartDate = `${paramsHour}:${choiceMinute}:00`
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
        file = Array.isArray(file) ? file : [file]
        const conferenceId = this.routeParams.conferenceId
        const fileGroup = 7
        for (let i = 0; i < file.length; i++) {
          const fromData = new FormData()
          fromData.append('files', file[i].file)
          fromData.append('conferenceId', conferenceId)
          fromData.append('fileGroup', fileGroup)
          this.$api({
            url: 'attendee.upload',
            data: fromData
          }).then(res => {
            if (res.code === 2000) {
              const data = res.result[0].filePath
              if (!ele.fieldValue) {
                ele.fieldValue = []
              }
              Array.isArray(ele.fieldValue) ? ele.fieldValue.push(data) : JSON.parse(ele.fieldValue).push(data)
            }
          })
        }
      }
    },
    // 上传图片 - 读取文件之前判断图片格式是否合法
    beforeReadPic(ele) {
      return file => {
        file = Array.isArray(file) ? file : [file]
        const sizeLimit = Number(ele.signFormFieldRuleVO.maxVal) * 1048576
        let acceptType = ele.signFormFieldRuleVO.accept
        // jpg 和 jpeg是一个类型的
        if (acceptType.includes('jpg')) {
          if (!acceptType.includes('jpeg')) {
            acceptType += ',jpeg'
          }
        }
        if (acceptType.includes('jpeg')) {
          if (!acceptType.includes('jpg')) {
            acceptType += ',jpg'
          }
        }
        for (let i = 0; i < file.length; i++) {
          const size = file[i].size
          // 1M等于1048576字节
          const typeArr = file[i].type.split('/')
          const type = typeArr[0]
          const suffix = typeArr[1]
          if (acceptType) {
            const isAccept = acceptType.includes(suffix)
            if (!isAccept) {
              this.$toast(`请上传${acceptType}格式图片`)
            } else {
              if (size > sizeLimit) {
                this.$toast(`图片大小不能超过${ele.signFormFieldRuleVO.maxVal}M`)
              } else {
                return true
              }
            }
          } else {
            if (type === 'image') {
              if (size > sizeLimit) {
                this.$toast(`图片大小不能超过${ele.signFormFieldRuleVO.maxVal}M`)
              } else {
                return true
              }
            } else {
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
      return file => {
        file = Array.isArray(file) ? file : [file]
        const conferenceId = this.routeParams.conferenceId
        const fileGroup = 7
        for (let i = 0; i < file.length; i++) {
          const fromData = new FormData()
          fromData.append('files', file[i].file)
          fromData.append('conferenceId', conferenceId)
          fromData.append('fileGroup', fileGroup)
          this.$api({
            url: 'attendee.upload',
            data: fromData
          }).then(res => {
            if (res.code === 2000) {
              // const data = res.result[0].filePath
              const data = res.result[0]
              data.fileUrl = data.filePath
              if (!ele.fieldValue) {
                ele.fieldValue = []
              }
              Array.isArray(ele.fieldValue) ? ele.fieldValue.push(data) : JSON.parse(ele.fieldValue).push(data)
            }
          })
        }
        // const conferenceId = this.routeParams.id
        // const fileGroup = 7
        // const fromData = new FormData()
        // fromData.append('files', file.file)
        // fromData.append('conferenceId', conferenceId)
        // fromData.append('fileGroup', fileGroup)
        // this.$api({
        //   url: 'attendee.upload',
        //   data: fromData
        // }).then(res => {
        //   if (res.code === 2000) {
        //     const data = res.result[0].filePath
        //     ele.fieldValue = data
        //   }
        // })
      }
    },
    // 上传文件 - 读取文件之前判断图片格式是否合法
    beforeReadFile(ele) {
      return file => {
        file = Array.isArray(file) ? file : [file]
        const accept = ele.signFormFieldRuleVO.accept
        const acceptArr = accept.split(',')
        if (accept.length) {
          const acceptType = ele.signFormFieldRuleVO.accept
          // if (acceptArr.find(eleFind => eleFind === 'doc')) {
          //   acceptArr.push('docx')
          // }
          for (let i = 0; i < file.length; i++) {
            const nameArr = file[i].name.split('.')
            const name = nameArr[nameArr.length - 1]
            if (acceptArr.findIndex(eleFind => eleFind.replace('.', '') === name) === -1) {
              this.$toast(`请上传${acceptType}格式文件`)
              return false
            }
          }
        }
        const sizeLimit = Number(ele.signFormFieldRuleVO.maxVal) * 1048576
        for (let i = 0; i < file.length; i++) {
          const size = file[i].size
          if (size > sizeLimit) {
            this.$toast(`文件大小不得大于${ele.signFormFieldRuleVO.maxVal}M`)
          } else {
            return true
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
        // const id = result[i].id
        if (!fieldValue && showFlag) {
          // console.log(result[i].fieldCode, fieldLabel, fieldValue, showFlag)
          const type = result[i].type
          const tips = typeTips.find(ele => ele.type === type).tips
          this.$toast(`请${tips}${fieldLabel}`)
          return false
        }
      }
      return true
    },
    // 暂存接口逻辑
    setKeep(toast = '') {
      if (
        this.param.signFormConfigFormatVO.photoUrl.fieldValue &&
        Array.isArray(this.param.signFormConfigFormatVO.photoUrl.fieldValue)
      ) {
        this.param.signFormConfigFormatVO.photoUrl.fieldValue =
          this.param.signFormConfigFormatVO.photoUrl.fieldValue.join()
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
      this.$api({
        url: 'attendee.addInsert',
        data: param
      })
        .then(res => {
          if (res.code === 2000 && res.success) {
            if (toast) {
              this.$toast(toast)
              if (this.paramsRequire.submitFlag === 1) {
                // 添加成功后 刷新当前页面
                setTimeout(() => {
                  window.location.reload()
                }, 150)
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
    tabsChange(index) {
      // tabs切换之前要对当前页进行验证
      const tabIndex = this.tabIndex
      if (tabIndex === 0) {
        // 只有在第一tab页的时候才进行验证
        const isVerify = this.verify(tabIndex)
        if (!isVerify) {
          return
        }
      }
      // this.uploadCustomPic = []
      this.tabsData.forEach(ele => {
        ele.checked = false
      })
      this.tabsData[index].checked = true
      this.tabIndex = index
      this.setKeep()
    },
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
      this.setKeep('暂存成功')
    },
    // 下一步 提交
    submit() {
      // 验证
      const tabIndex = this.tabIndex
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
      if (tabIndex < 2) {
        this.tabsData.forEach(ele => {
          ele.checked = false
        })
        this.tabsData[++this.tabIndex].checked = true
        this.setKeep(toast)
      } else {
        this.$dialog
          .confirm({
            title: '提交信息',
            message: '是否提交报名？',
            confirmButtonText: '确认提交',
            cancelButtonText: '暂不提交',
            className: 'customDialog'
          })
          .then(() => {
            this.paramsRequire.submitFlag = 1
            toast = '添加参会人成功'
            if (String(this.paramsRequire.sourceType) === '4') {
              toast = '代他人报名成功'
            }
            this.setKeep(toast)
          })
          .catch(() => {})
      }
    },
    prev() {
      this.tabsData.forEach(ele => {
        ele.checked = false
      })
      this.tabsData[--this.tabIndex].checked = true
      // this.tabIndex = this.tabIndex - 1
    },
    // 用户名 / 手机号码失焦判断是否已经报名
    userInfoBlur(ele) {
      // 只有在手机号处聚焦时候才请求接口
      const fieldCode = ele.fieldCode
      if (fieldCode === 'phone' || fieldCode === 'attendeeName') {
        // 手机号验证及接口获取
        const attendeeName = this.param.signFormConfigFormatVO.attendeeName.fieldValue
        const mobile = this.param.signFormConfigFormatVO.phone.fieldValue
        if (mobile) {
          if (!this.mobileReg(mobile)) {
            this.$toast('请输入正确的手机号')
            return
          }
        }
        if (attendeeName && mobile) {
          const conferenceId = this.routeParams.conferenceId
          // 获取是否存在草稿
          this.$api({
            url: 'attendee.isSignUp',
            data: {
              conferenceId,
              attendeeName,
              phone: mobile
            }
          })
            .then(res => {
              const data = res.result
              if (data) {
                // 存在草稿
                this.param = this.paramHandler(data)
              } else {
                // 如果草稿中没有内容则根据用户名和手机号获取参会人员信息
                this.$api({
                  url: 'attendee.getUserInfo',
                  data: {
                    userName: attendeeName,
                    mobile
                  }
                })
                  .then(resMsg => {
                    const data = resMsg.result
                    const innerFlag = data ? (data.user.innerFlag ? data.user.innerFlag : 0) : 0
                    const externalVisibaleFlag = this.regSettingsData.externalVisibaleFlag
                    this.paramsRequire.innerFlag = innerFlag
                    if (!data) {
                      // 如果data内容为空 表示非商网用户 如果不允许非商网用户报名 直接弹窗提示且清空用户名和手机内容
                      if (externalVisibaleFlag === 0) {
                        this.$dialog
                          .alert({
                            message: '会议暂未对外部参会人开放',
                            confirmButtonText: '确定',
                            className: 'customDialog'
                          })
                          .then(() => {
                            this.findEle('attendeeName').fieldValue = ''
                            this.findEle('phone').fieldValue = ''
                          })
                      } else {
                        // 如果允许非商网用户报名 则获取非商网用户表单项
                        const attendeeName = this.findEle('attendeeName').fieldValue
                        const phone = this.findEle('phone').fieldValue
                        this.getForms().then(resolve => {
                          if (resolve) {
                            this.findEle('attendeeName').fieldValue = attendeeName
                            this.findEle('phone').fieldValue = phone
                          }
                        })
                      }
                    } else {
                      if (innerFlag === 0) {
                        // 如果是非商网用户 且 不允许非商网用户报名 则弹窗提示 并清空用户名和手机号内容
                        if (externalVisibaleFlag === 0) {
                          this.$dialog
                            .alert({
                              message: '会议暂未对外部参会人开放',
                              confirmButtonText: '确定',
                              className: 'customDialog'
                            })
                            .then(() => {
                              this.findEle('attendeeName').fieldValue = ''
                              this.findEle('phone').fieldValue = ''
                            })
                        } else {
                          // 如果是非商网用户 且允许非商网用户报名 则获取非商网用户表单
                          const attendeeName = this.findEle('attendeeName').fieldValue
                          const phone = this.findEle('phone').fieldValue
                          this.getForms().then(resolve => {
                            if (resolve) {
                              this.findEle('attendeeName').fieldValue = attendeeName
                              this.findEle('phone').fieldValue = phone
                            }
                          })
                        }
                      } else {
                        // 如果是商网内部用户 则将内容填充至现有的form表单项中
                        if (data.user.ssoUserName) {
                          this.findEle('attendeeName').fieldValue = data.user.ssoUserName
                        }
                        if (data.user.mobile) {
                          this.findEle('phone').fieldValue = data.user.mobile
                        }
                        if (data.user.sex) {
                          this.findEle('sex').fieldValue = String(data.user.sex)
                          this.findEle('sex').fieldValueStr = String(data.user.sex) === '1' ? '男' : '女'
                        }
                        if (data.sex) {
                          this.findEle('sex').fieldValue = String(data.sex)
                          this.findEle('sex').fieldValueStr = String(data.sex) === '1' ? '男' : '女'
                        }
                        if (data.mainJobOrg) {
                          if (data.mainJobOrg.companyName) {
                            this.findEle('organizationName').fieldValue = data.mainJobOrg.companyName
                          }
                        }
                        if (data.user.mobile) {
                          this.findEle('phoneForMsg').fieldValue = data.user.mobile
                        }
                        if (data.user.organizationName) {
                          this.findEle('organizationName').fieldValue = data.user.organizationName
                        }
                        if (data.user.sex) {
                          this.findEle('sex').fieldValue = Number(data.user.sex)
                          this.findEle('sex').fieldValueStr = Number(data.user.sex) === 1 ? '男' : '女'
                        }
                        if (data.user.mobile) {
                          this.findEle('phoneForMsg').fieldValue = data.user.mobile
                        }
                        if (data.user.organizationName) {
                          this.findEle('organizationName').fieldValue = data.user.organizationName
                        }
                        if (data.user.ssoUserName) {
                          this.findEle('attendeeName').fieldValue = data.user.ssoUserName
                        }
                        if (data.user.mobile) {
                          this.findEle('phone').fieldValue = data.user.mobile
                        }
                        if (data.user.sex) {
                          this.findEle('sex').fieldValue = String(data.user.sex)
                          this.findEle('sex').fieldValueStr = String(data.user.sex) === '1' ? '男' : '女'
                        }
                        if (data.sex) {
                          this.findEle('sex').fieldValue = String(data.sex)
                          this.findEle('sex').fieldValueStr = String(data.sex) === '1' ? '男' : '女'
                        }
                        if (data.mainJobOrg) {
                          if (data.mainJobOrg.companyName) {
                            this.findEle('organizationName').fieldValue = data.mainJobOrg.companyName
                          }
                        }
                        if (data.user.mobile) {
                          this.findEle('phoneForMsg').fieldValue = data.user.mobile
                        }
                        if (data.user.organizationName) {
                          this.findEle('organizationName').fieldValue = data.user.organizationName
                        }
                      }
                    }
                  })
                  .catch(err => {
                    const msg = err.message
                    this.$dialog
                      .alert({
                        message: msg,
                        confirmButtonText: '确定',
                        className: 'customDialog'
                      })
                      .then(() => {
                        this.findEle('attendeeName').fieldValue = ''
                        this.findEle('phone').fieldValue = ''
                      })
                  })
              }
            })
            .catch(err => {
              if (err.code === 3000) {
                const msg = err.message
                this.$dialog
                  .alert({
                    message: msg,
                    confirmButtonText: '确定',
                    className: 'customDialog'
                  })
                  .then(() => {
                    this.findEle('attendeeName').fieldValue = ''
                    this.findEle('phone').fieldValue = ''
                  })
              }
            })
        }
      }
    },
    // 标签选择
    tagsChoice() {
      if (this.labelData.length) {
        this.labelFlag = true
        this.actionShow = true
        this.actions = this.labelData
      } else {
        this.$toast('该场会议暂无会议标签')
      }
    },
    // 标签删除
    labelDelete(index) {
      const id = this.labelChoiceData[index].id
      this.labelChoiceData.splice(index, 1)
      const choiceIndex = this.paramsRequire.tagIds.findIndex(ele => ele === id)
      this.paramsRequire.tagIds.splice(choiceIndex, 1)
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
                    // aaaaaaa
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
                }
              }
            }
          })
        }
      } else {
        // 添加标签
        const tagsChoiceIndex = this.labelChoiceData.findIndex(ele => ele.id === item.id)
        if (tagsChoiceIndex === -1) {
          this.paramsRequire.tagIds.push(item.id)
          this.labelChoiceData.push(item)
        }
        this.labelFlag = false
      }
      this.optionFlag = null
      // 当是否接站 和 是否送站都选择为是的时候 验证 如果到达日期和返程日期为同一天 则达到时间不得大于返程时间
      const startDate = this.findEle('arriveTimeCustom').fieldValue
      const endDate = this.findEle('returnTimeCustom').fieldValue
      const startTime = this.findEle('arriveTime').fieldValue
      const endTime = this.findEle('returnTime').fieldValue
      const pickUpFlag = this.findEle('pickUpFlag').fieldValue
      const pickOutFlag = this.findEle('pickOutFlag').fieldValue
      if (startTime && endTime && Number(pickUpFlag) === 1 && Number(pickOutFlag) === 1) {
        if (new Date(startDate).getTime() === new Date(endDate).getTime()) {
          // 如果开始日期和结束日期选择在了同一天 则将开始时间置空重新选择
          if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
            this.$dialog
              .alert({
                message: '到达时间不得大于返程时间，请重新选择到达时间或调整返程时间',
                confirmButtonText: '确定',
                className: 'customDialog'
              })
              .then(() => {
                this.findEle('arriveTime').fieldValue = ''
                this.findEle('arriveTime').fieldValueStr = ''
                this.timeData = []
              })
          }
        }
      }
    },
    // 每次弹窗关闭都将tabs标签开关关闭
    sheetClose() {
      setTimeout(() => {
        this.labelFlag = false
      })
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
          url: 'attendee.getForms',
          data: {
            conferenceId,
            // 是否内部表单
            innerFlag: this.paramsRequire.innerFlag
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            this.param = this.paramHandler(data)
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
                  // forms.arriveTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
                  forms.arriveTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
                  // forms.arriveTime.fieldValue = eleDetail.fieldValue.slice(-8)
                  if (this.arriveTime !== '00:00:00') {
                    // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
                    forms.arriveTime.fieldValueStr = `${eleDetail.fieldValue.slice(
                      -8,
                      -6
                    )}时${eleDetail.fieldValue.slice(-5, -3)}分`
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
                  // forms.returnTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
                  forms.returnTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
                  // forms.returnTime.fieldValue = eleDetail.fieldValue.slice(-8)
                  if (this.returnTime !== '00:00:00') {
                    // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
                    forms.returnTime.fieldValueStr = `${eleDetail.fieldValue.slice(
                      -8,
                      -6
                    )}时${eleDetail.fieldValue.slice(-5, -3)}分`
                  }
                }
              }
            }
            // if (eleDetail.fieldCode === 'ticketFlag') {
            //   eleDetail.showFlag = 0
            // }
            // if (eleDetail.fieldCode === 'arriveTime' && eleDetail.showFlag === 1) {
            //   forms.arriveTimeCustom = Object.assign({}, eleDetail)
            //   forms.arriveTimeCustom.seq = 1
            //   forms.arriveTimeCustom.groupId = 2
            //   forms.arriveTimeCustom.fieldCode = 'arriveTimeCustom'
            //   forms.arriveTimeCustom.fieldLabel = '到达日期'
            //   if (eleDetail.fieldValue) {
            //     // forms.arriveTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
            //     // forms.arriveTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
            //     forms.arriveTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
            //     forms.arriveTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
            //     forms.arriveTime.fieldValue = eleDetail.fieldValue.slice(-8)
            //     if (eleDetail.fieldValue.slice(-8) !== '00:00:00') {
            //       // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
            //       forms.arriveTime.fieldValueStr = `${eleDetail.fieldValue.slice(-8, -6)}时${eleDetail.fieldValue.slice(-5, -3)}分`
            //     }
            //   }
            // }
            // if (eleDetail.fieldCode === 'returnTime' && eleDetail.showFlag === 1) {
            //   forms.returnTimeCustom = Object.assign({}, eleDetail)
            //   forms.returnTimeCustom.seq = 2
            //   forms.returnTimeCustom.groupId = 2
            //   forms.returnTimeCustom.fieldCode = 'returnTimeCustom'
            //   forms.returnTimeCustom.fieldLabel = '返程日期'
            //   if (eleDetail.fieldValue) {
            //     // forms.returnTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
            //     // forms.returnTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
            //     forms.returnTimeCustom.fieldValue = eleDetail.fieldValue.slice(0, 10)
            //     forms.returnTimeCustom.fieldValueStr = this.formatCode(new Date(eleDetail.fieldValue.slice(0, 10)))
            //     forms.returnTime.fieldValue = eleDetail.fieldValue.slice(-8)
            //     if (eleDetail.fieldValue.slice(-8) !== '00:00:00') {
            //       // 如果时间为00:00:00 说明在添加参会人/代报名的时候没有选择到达/返程时间 如果没选择时间则不应回显 如果碰巧选择了0时0分 则会手动提交为00:00:01
            //       forms.returnTime.fieldValueStr = `${eleDetail.fieldValue.slice(-8, -6)}时${eleDetail.fieldValue.slice(-5, -3)}分`
            //     }
            //   }
            // }
            if (eleDetail.fieldCode === 'photoUrl') {
              if (eleDetail.downloadUrl) {
                this.fileList = [{ content: eleDetail.downloadUrl }]
                // eleDetail.fieldValue = eleDetail.downloadUrl
              }
            }
            if (eleDetail.fieldCode === 'honourFlag' && eleDetail.showFlag) {
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
              // console.log(name.join(','),111)
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
                      content: `${elePic.downloadUrl}`
                      // content: `https://sw-huiwu-test.oss-cn-beijing.aliyuncs.com/${elePic.fileUrl}`
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
    // 获取会议详情
    getDetail() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'attendee.getDetail',
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
          url: 'attendee.getAddAgenda',
          data: {
            conferenceId,
            queryFlag: 1
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
            console.log('议程', this.agendaData)
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
          url: 'attendee.getRegSettings',
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
    getLabel() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
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
      // const reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      // return reg.test(value)
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
    },
    // 报名变更
    linkEditApply() {
      const conferenceId = this.routeParams.conferenceId
      const attendeeId = this.routeParams.attendeeId
      this.$router.push({
        name: 'editApply',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId),
          [this.$enc('attendeeId')]: this.$enc(attendeeId)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-attendee-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  .attendee-item {
    > h3 {
      padding: 0 16px;
      line-height: 44px;
      font-size: 17px;
      font-weight: 500;
      @include list(row, flex-start, center);
      &::before {
        content: '';
        display: block;
        width: 3px;
        height: 16px;
        background-color: #1070ff;
        margin-right: 10px;
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
        display: none;
        font-size: 18px;
      }
    }
    .upload-list {
      padding-left: 6px;
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
      padding-left: 6px;
      overflow: hidden;
      .upload-preview {
        float: left;
        width: 60px;
        height: 60px;
        border-radius: 2px;
        margin: 10px 0 0 10px;
        position: relative;
        .upload-del-btn {
          display: none;
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
        display: none;
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
  .main-container {
    padding: 0 0 74px;
    .read-title {
      padding: 16px;
      .line {
        width: 3px;
        height: 18px;
        background: #1070ff;
        border-radius: 1px;
        display: inline-block;
      }
      .text {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191f24;
        display: inline-block;
        padding: 0px 6px;
        vertical-align: top;
        line-height: 17px;
      }
    }
    .departure-info {
      margin-top: 12px;
      background-color: #fff;
      padding: 12px 16px;
      height: 40px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191f24;
    }
  }
  .van-form {
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
      background: #fff;
      .title {
        width: 100%;
        height: 56px;
        @include list(row, flex-start, center);
        font-size: 16px;
        line-height: 56px;
        padding: 0 12px;
        img {
          width: 20px;
          margin-right: 8px;
        }
      }
      .detail {
        width: 100%;
        // padding: 0 12px;
        // margin-bottom: 12px;
        .content {
          padding: 16px 20px;
          // margin-bottom: 12px;S
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
  .van-field__label {
    white-space: nowrap;
  }
  .bottom {
    z-index: 1;
    padding: 10px 16px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-button {
      border-radius: 4px;
      font-size: 18px;
    }
    .edit-btn {
      margin-left: 8px;
    }
  }
  .examine-container {
    .examine {
      width: 284px;
      @include absolute(50%, 50%, '', '');
      transform: translate(50%, -50%);
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      > h3 {
        height: 54px;
        line-height: 54px;
        font-size: 17px;
        padding: 0 20px;
        font-weight: 500;
      }
      .val {
        width: 100%;
        padding: 0 16px 16px;
        .van-cell {
          padding: 0;
          height: 100px;
          background-color: rgba(25, 31, 36, 0.04);
        }
        textarea {
          width: 100%;
          height: 74px;
          line-height: 20px;
          border-radius: 6px;
          resize: none;
          padding: 8px 10px;
        }
      }
      .oper {
        li {
          width: 100%;
          height: 56px;
          line-height: 56px;
          font-size: 17px;
          text-align: center;
          position: relative;
          &::after {
            content: '';
            display: block;
            width: 100%;
            border-top: 1px solid #ebedf0;
            transform: scaleY(0.5);
            @include absolute(0, '', '', 0);
          }
          .item {
            position: relative;
            .item-icon {
              width: 16px;
              height: 16px;
              @include absolute(50%, '', '', 50px);
              // @include absolute(50%,'','',-32px);
              transform: translateY(-50%);
            }
          }
          .examine-btn {
            width: 50%;
            display: inline-block;
            position: relative;
            color: rgba(30, 137, 255, 1);
            &:nth-of-type(1) {
              color: rgba(25, 31, 36, 1);
              &::after {
                content: '';
                display: block;
                width: 1px;
                height: 100%;
                @include absolute(0, 0, '', '');
                border-right: 1px solid #ebedf0;
                transform: scaleY(0.5);
              }
            }
          }
        }
      }
    }
  }
  .examine-status {
    width: 100%;
    padding: 12px 12px 12px 16px;
    background-color: rgba(255, 248, 228, 1);
    dt {
      @include list(row, space-between, center);
      // color: rgba(120, 89, 0, 1);
      color: rgba(253, 60, 52, 1);
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      margin-bottom: 4px;
      .van-icon {
        font-size: 16px;
      }
    }
    dd {
      font-size: 14px;
      color: rgba(150, 127, 63, 1);
      line-height: 20px;
    }
  }
  .custom-msg {
    .van-cell__title {
      flex: inherit;
      margin-right: 10px;
      // max-width: 40%;
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
    }
  }
}
</style>
<style lang="scss">
.cacelSignUp {
  .van-dialog__cancel {
    color: #1e89ff;
  }
  .van-dialog__confirm {
    color: rgba(25, 31, 36, 0.56);
  }
}
</style>
