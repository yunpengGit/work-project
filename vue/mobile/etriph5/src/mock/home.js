export default {
  parts: [
    {
      title: '机票',
      list: [
        {
          src: require('../image/home/xc_logo.jpg'),
          src0: require('../image/home/xc_logo_gray.png'),
          name: '携程',
          link: '/ctrip'
        },
        {
          src: require('../image/home/hz_logo.jpg'),
          src0: require('../image/home/hz_logo_gray.png'),
          name: '中航服'
        }
      ]
    },
    // {
    //   title: '国际机票',
    //   list: [
    //     {
    //       name: '国际机票'
    //     }
    //   ]
    // },
    {
      title: '酒店',
      list: [
        {
          name: '协议酒店'
        },
        {
          link: '/ctrip?type=hotel',
          name: '携程酒店'
        }
      ]
    }
  ]
}
