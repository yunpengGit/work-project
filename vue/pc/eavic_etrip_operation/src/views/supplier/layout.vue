<template>
  <div class="content">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'layout',
  data () {
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '订单设置'
          },
          {
            key: '2',
            title: '联系人'
          },
          {
            key: '3',
            title: '服务关系'
          },
          {
            key: '4',
            title: '模版绑定'
          }
        ],
        active: () => {
          switch (this.$route.path) {
            case '/supplier/layout/orderSettings':
              return '1'
            case '/supplier/layout/contact':
              return '2'
            case '/supplier/layout/serviceRelationship':
              return '3'
            case '/supplier/layout/templateBinding':
              return '4'
            default:
              return '1'
          }
        },
        callback: (key) => {
          switch (key) {
            case '1':
              this.$router.push('/supplier/layout/orderSettings')
              break
            case '2':
              this.$router.push('/supplier/layout/contact')
              break
            case '3':
              this.$router.push('/supplier/layout/serviceRelationship')
              break
            case '4':
              this.$router.push('/supplier/layout/templateBinding')
              break
            default:
              this.$router.push('/home')
          }
        }
      },
      TreeSearch: true
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>
