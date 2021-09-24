<template>
  <div class="content">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'orderLayout',
  data () {
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '订单管理'
          },
          {
            key: '2',
            title: '错误订单'
          },
          {
            key: '3',
            title: '订单抓取'
          },
          {
            key: '4',
            title: '往期异常订单'
          },
          {
            key: '5',
            title: '账单管理'
          }
        ],
        active: () => {
          switch (this.$route.path) {
            case '/order/orderLayout/success':
              return '1'
            case '/order/orderLayout/failure':
              return '2'
            case '/order/orderLayout/fetch':
              return '3'
            case '/order/orderLayout/pastAbnormal':
              return '4'
            case '/order/orderLayout/billManagement':
              return '5'
            default:
              return '1'
          }
        },
        callback: (key) => {
          switch (key) {
            case '1':
              this.$router.push('/order/orderLayout/success')
              break
            case '2':
              this.$router.push('/order/orderLayout/failure')
              break
            case '3':
              this.$router.push('/order/orderLayout/fetch')
              break
            case '4':
              this.$router.push('/order/orderLayout/pastAbnormal')
              break
            case '5':
              this.$router.push('/order/orderLayout/billManagement')
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
