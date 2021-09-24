<!--
 * @Author: aq.hu
 * @Date: 2021-07-27 10:46:45
 * @LastEditTime: 2021-08-07 19:26:25
 * @LastEditors: zhaohx
 * @Description: 添加用证人员
-->
<template>
  <div>
    <choose-person :routeParams="routeParams" @comfirm="peopleComfirm" />
  </div>
</template>

<script>
import choosePerson from '@/components/choosePerson'
import { Toast } from 'vant'
export default {
  components: { choosePerson },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      params: {
        attendeeVOList: [],
        card: {
          cardStatus: 1,
          id: ''
        }
      },
      peopleNum: ''
    }
  },
  created() {
    const { cardId } = this.routeParams
    this.params.card.id = Number(cardId)
  },
  methods: {
    peopleComfirm(data) {
      this.params.attendeeVOList = []
      this.peopleNum = data.length
      data.map(t => {
        const obj = {
          fixAttributeVO: {
            organizationName: t.fixAttributeCommonVO.organizationName,
            organizationSortName: t.fixAttributeCommonVO.organizationSortName
          },
          id: t.id
        }
        this.params.attendeeVOList.push(obj)
      })
      this.$dialog.confirm({
        title: `将添加${this.peopleNum}名人员为参会人员`,
        message: '确认添加',
        className: 'customDialog'
      }).then(() => {
        this.$api({
          url: 'manage.addCardPerson',
          data: this.params
        }).then(res => {
          if (res.code === 2000) {
            this.$router.go(-1)
          }
        }).catch(err => {
          Toast(err.message)
        })
      }).catch(() => {})
    }
  }
}
</script>
