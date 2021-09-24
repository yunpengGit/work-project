/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/27 11:23
 */

// 枚举型静态数据表
const staticDataMaps = {
  // 行程状态对应图片
  ticketstateIconMap: new Map([
    [1, 'iconzhengpiao'],
    [2, 'icongaiqian'],
    [3, 'icontuipiao']
  ]),
  // 行程状态对应文案
  ticketstateMap: new Map([
    [1, '正票'],
    [2, '改签'],
    [3, '退票']
  ]),
  // 行程确认状态
  ticketConfirmStateMap: new Map([
    [0, '未确认'],
    [1, '已确认'],
    [2, '部分确认']
  ]),
  // 行程报销状态
  journeyExpenseStateMap: new Map([
    [0, '未报销'],
    [1, '已报销']
  ]),
  // 评价状态对应功能
  journeyCommentMap: new Map([
    [0, '评价'],
    [1, '查看评价']
  ]),
  // 品牌logo
  logoMap: new Map([
    ['携程', 'iconicon-test'],
    ['国际机票', 'iconguojijipiao'],
    ['协议酒店', 'iconhotel-'],
    ['携程酒店', 'iconxiechengjiudian']
  ]),
  // 服务商logo
  serviceLogoMap: new Map([
    ['携程', require('../image/service/xc_special_icon.png')],
    ['中航服', require('../image/service/zhf_special_icon.png')],
    ['空港嘉华', require('../image/service/kgjh_special_icon.png')],
    ['阳光之旅', require('../image/service/ygzl_special_icon.png')],
    ['华宇航服', require('../image/service/hyhf_special_icon.png')]
  ]),
  // 服务商简介
  serviceInfoMap: new Map([
    [
      '中航服',
      {
        logo: require('../image/service/zhf_intro_icon.png'),
        title: '中航服',
        infos: [
          {
            title: '服务优势',
            list: [
              {
                logo: 'iconfeiji1',
                title:
                  '拥有国航、东航、南航、海航等中国民航授权的要客客票直售资质。'
              },
              {
                logo: 'iconguoji',
                title:
                  '拥有120余家国内外航空公司的代理销售授权，是国航、东航、南航、海航的一类代理商。'
              }
            ]
          },
          {
            title: '服务团队',
            list: [
              {
                text:
                  '中航服共有员工超过800人，其中北京总部现有正式员工200人，所有服务人员均具备良好的职业操守和沟通能力，其中，为航空工业集团配备专业服务团队，包括客户经理、业务专员、技术主管、财务结算等服务人员在内共18名。'
              }
            ]
          },
          {
            title: '公司概况',
            list: [
              {
                text:
                  '中国航空服务有限公司（以下简称“中航服”）成立于1987年，总部设在北京，注册资金6000万元人民币，是中国大陆第一家航空客运代理企业。业务范围包括国内、国际机票、国际铁路客票、国内外酒店、保险以及团组出行等。'
              }
            ]
          }
        ]
      }
    ],
    [
      '携程',
      {
        logo: require('../image/service/xc_intro_icon.png'),
        title: '携程',
        infos: [
          {
            title: '服务优势',
            list: [
              {
                logo: 'iconfeiji1',
                title: '国内机票4种产品类型',
                text: '1.协议价：<br>&nbsp;&nbsp;&nbsp;&nbsp;航空工业与航司签署的大客户协议类产品。<br>2.商务推荐：<br>&nbsp;&nbsp;&nbsp;&nbsp;航空公司对外公布的价格。<br>3.航司直连：<br>&nbsp;&nbsp;&nbsp;&nbsp;国内18家航空公司官网直销机票联网预订。<br>4.旅行套餐：<br>&nbsp;&nbsp;&nbsp;&nbsp;携程商旅代理商特价产品，携程商旅独家优惠，价格有一定优势。'
              },
              {
                logo: 'iconguoji',
                title: '国际机票产品资源丰富'
              }
            ]
          },
          {
            title: '服务团队',
            list: [
              {
                text: '携程商旅现有员工1900人，为航空工业集团配备专业服务团队，包括运营、实施、技术、财务等服务人员在内共9名。'
              }
            ]
          },
          {
            title: '公司概况',
            list: [
              {
                text: '上海携程宏睿国际旅行社有限公司即原携程集团商旅事业部（以下简称“携程商旅”），隶属于携程集团，成立于2015年，注册资金1000万元人民币。业务范围涉及国内国际机票、旅行保险、全球酒店、火车票、汽车票、签证、会议会展、全球各大城市用车等。'
              }
            ]
          }
        ]
      }
    ],
    [
      '空港嘉华',
      {
        logo: require('../image/service/kgjh_intro_icon.png'),
        title: '空港嘉华',
        infos: [
          {
            title: '服务优势',
            list: [
              {
                logo: 'iconzuowei-',
                title: '优选座位',
                text: '免费为乘机人优选座位，提高旅途舒适度（仅限已开通办事处机场：北京、上海、西安、厦门、乌鲁木齐、成都、长春）。'
              },
              {
                logo: 'icondengjipai',
                title: '提前换取登机牌',
                text: '免费为乘机人提供提前换取登机牌服务，节省出行时间，减少误机率（仅限已开通办事处机场：北京、上海、西安、厦门、乌鲁木齐、成都、长春）。'
              },
              {
                logo: 'iconhangli',
                title: '协助托运行李',
                text: '免费为乘机人协助办理行李托运，如托运行李超重，可协调减免相应费用，并免费提供行李寄存服务仅限已开通办事处机场：北京、上海、西安、厦门、乌鲁木齐、成都、长春）。'
              },
              {
                logo: 'iconhoubu',
                title: '优先候补',
                text: '驻机场办事处人员会在航空公司售票柜台申请候补座位仅限已开通办事处机场：北京、上海、西安、厦门、乌鲁木齐、成都、长春）。'
              },
              {
                logo: 'iconliwu-',
                title: '国际出行赠送精美旅行四件套',
                text: '为飞行时间5小时以上的员工免费提供脖枕、拖鞋、转换插头以及打包带四件套，提高出行体验仅限已开通办事处机场：北京、上海、西安、厦门、乌鲁木齐、成都、长春）。'
              }
            ]
          },
          {
            title: '服务团队',
            list: [
              {
                text: '空港嘉华目前现有员工300人，80%员工有着丰富的机场及航空公司相关服务经验，能够专业的处理机场的各种突发情况。空港嘉华为航空工业集团提供28人专业差旅团队，并根据预订量的增长及时增加团队成员，所有保障人员均有5年以上的相关工作经验。'
              }
            ]
          },
          {
            title: '公司概况',
            list: [
              {
                text: '北京空港嘉华航空服务有限公司（以下简称“空港嘉华”）成立于2010年，注册资金2000万，可提供产品范围：国内、国际机票、保险、全球酒店、火车票、汽车票、旅游度假咨询、签证、会议会展、用车、境外WIFI、旅游接待，机场VIP停车位等便于您差旅出行的产品。'
              }
            ]
          }
        ]
      }
    ],
    [
      '阳光之旅',
      {
        logo: require('../image/service/ygzl_intro_icon.png'),
        title: '阳光之旅',
        infos: [
          {
            title: '服务优势',
            list: [
              {
                logo: 'iconxin',
                title: '国航各项特殊服务，如：婴儿摇篮申请、无成人陪伴儿童办理、机上或机下轮椅申请。小动物运输申请等等。'
              }
            ]
          },
          {
            title: '服务团队',
            list: [
              {
                text: '公司由从事多年航空票务及旅游工作的资深团队组成，从业经验在5-20年，其中机票组80%以上的操作人员已为航空工业集团公司总部及部分下属企业服务十余年，航空工业集团专属服务团队由机票组、结算组、送票组等组成，团队成员12名。'
              }
            ]
          },
          {
            title: '公司概况',
            list: [
              {
                text: '北京阳光之旅国际旅行社有限公司（以下简称“阳光之旅”）成立于2014年9月，注册资金500万，公司现有人数50人，主要业务范围包括国际、国内机票、旅游产品、签证、酒店、用车、保险等。'
              }
            ]
          }
        ]
      }
    ],
    [
      '华宇航服',
      {
        logo: require('../image/service/hyhf_intro_icon.png'),
        title: '华宇航服',
        infos: [
          {
            title: '服务优势',
            list: [
              {
                logo: 'iconxin',
                title: '我公司是政府采购机票订单单位。'
              },
              {
                logo: 'iconhoubu',
                title: '免费赠送境外WIFI。'
              }
            ]
          },
          {
            title: '服务团队',
            list: [
              {
                text: '华宇国际现有员工100多人，航空工业专属服务团队由预定组、出票组、财务组等组成，团队成员20名。'
              }
            ]
          },
          {
            title: '公司概况',
            list: [
              {
                text: '北京华宇国际航空服务有限公司（以下简称“华宇航服”）是2005年经中国民航总局批准的一家专门从事航空服务的涉外企业，隶属于中国民航华北管理局，公司总部设在北京，注册资金300万元，业务范围包括国内、国际机票、国内外酒店、签证及境外商务考察地接接待等。'
              }
            ]
          }
        ]
      }
    ]
  ])
}

export default staticDataMaps
