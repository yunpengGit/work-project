<template>
  <a-modal
      title="修改头像"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      :width="800"
      :footer="null"
      @cancel="cancelHandel">
      <a-row>
        <a-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :aspect-ratio="16 / 9"
            :src="imgSrc"
            preview=".preview"
          >
          </vue-cropper>
        </a-col>
        <a-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img"/>
          </div>
        </a-col>
      </a-row>
      <a-row>
      <input
        ref="input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      />
      <a-col :lg="2" :md="2">
        <a-button icon="upload" @click.prevent="showFileChooser">选择图片</a-button>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button @click="reset">reset</a-button>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="plus" @click="zoom(0.2)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="minus" @click="zoom(-0.2)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="undo" @click="rotate(-90)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="redo" @click="rotate(90)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="arrow-left" @click="move(-10, 0)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="arrow-right" @click="move(10, 0)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="arrow-up" @click="move(0, -10)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button icon="arrow-down" @click="move(0, 10)"/>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button ref="flipX" @click.prevent="flipX">翻转X</a-button>
      </a-col>
      <a-col :lg="2" :md="2">
        <a-button ref="flipY" @click.prevent="flipX">翻转Y</a-button>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'cropper',
  data () {
    return {
      imgSrc: require('./../../assets/head.jpg'),
      cropImg: '',
      data: null,
      visible: false,
      confirmLoading: false,
      previews: {},
      options: {}
    }
  },
  created () {

  },
  methods: {
    open (id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
    },
    beforeUpload (file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    },
    cancelHandel () {
      this.close()
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    flipX() {
      const dom = this.$refs.flipX
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleX(scale)
      dom.setAttribute('data-scale', scale)
    },
    flipY() {
      const dom = this.$refs.flipY
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleY(scale)
      dom.setAttribute('data-scale', scale)
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4)
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4)
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY)
    },
    reset() {
      this.$refs.cropper.reset()
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg)
    },
    setCropBoxData() {
      if (!this.data) return

      this.$refs.cropper.setCropBoxData(JSON.parse(this.data))
    },
    setData() {
      if (!this.data) return

      this.$refs.cropper.setData(JSON.parse(this.data))
    },
    setImage(e) {
      const file = e.target.files[0]

      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file')
        return
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = (event) => {
          this.imgSrc = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
        }

        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    showFileChooser() {
      this.$refs.input.click()
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent)
    }
  },
  components: { VueCropper }
}
</script>

<style scoped lang="less">
input[type="file"] {
  display: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}

.header h2 {
  margin: 0;
}

.header a {
  text-decoration: none;
  color: black;
}

.content {
  display: flex;
  justify-content: space-between;
}

.cropper-area {
  width: 614px;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062CC;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  height: 100px;
}

.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}

.cropped-image img {
  max-width: 100%;
}
.avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
