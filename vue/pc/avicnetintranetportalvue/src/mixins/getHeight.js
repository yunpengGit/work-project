const getHeightPX = {
  data () {
    return {
      heightObj: {
        table: '400px',
        page: '400px'
      }
    }
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    window.addEventListener('message', this.getHeight)
    this.getHeight()
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
    window.removeEventListener('message', this.getHeight)
  },
  methods: {
    getHeight (e) {
      setTimeout(() => {
        const contentHeight = document.querySelector('.page-frame-content').clientHeight
        const conFormHeight = document.querySelector('.sp-form-box') ? document.querySelector('.sp-form-box').clientHeight : 0
        const handleHeight = document.querySelector('.sp-handle') ? document.querySelector('.sp-handle').clientHeight : 0
        const paginationHeight = document.querySelector('.sp-pagination') ? document.querySelector('.sp-pagination').clientHeight : 0
        const heightObj = {}
        heightObj.table = contentHeight - conFormHeight - handleHeight - paginationHeight - 20 + 'px'
        heightObj.page = contentHeight - 20 + 'px'
        this.heightObj = heightObj
      }, 100)
    }
  }
}
export default getHeightPX
