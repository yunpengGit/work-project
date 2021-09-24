<template>
  <div class="content">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'layout',
  data() {
    return {
      allCounts: '',
      readCounts: '',
      recallCounts: '',
      unreadCounts: '',
      tabs: {
        items: [
          {
            key: '1',
            title: '全部',
            badge: this.allBadge,
          },
          {
            key: '2',
            title: '未阅',
            badge: this.unreadCounts,
          },
          {
            key: '3',
            title: '已阅',
            badge: this.readBadge,
          },
          {
            key: '4',
            title: '已撤回',
            badge: this.revokedBadge,
          },
        ],
        active: () => {
          switch (this.$route.path) {
            case '/all':
              return 0;
            case '/unread':
              return 1;
            case '/read':
              return 2;
            case '/recall':
              return 3;
            default:
              return 0;
          }
        },
        callback: (key) => {
          // console.log(key, typeof key);
          switch (key) {
            case 0:
              this.$router.push('/all');
              break;
            case 1:
              this.$router.push('/unread');
              break;
            case 2:
              this.$router.push('/read');
              break;
            case 3:
              this.$router.push('/recall');
              break;
            default:
              this.$router.push('/');
          }
        },
      },
    };
  },
};
</script>

<style scoped lang="less">

</style>
