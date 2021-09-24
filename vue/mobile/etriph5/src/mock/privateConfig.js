const typeList = new Map([
  ['机票预订', { src: require('./../image/private/private_air_ticket.png'), src0: require('./../image/private/private_air_ticket_grey.png') }],
  ['机票订单', { src: require('./../image/private/private_air_order.png'), src0: require('./../image/private/private_air_order_grey.png') }],
  ['协议酒店', { src: require('./../image/private/private_xy_hotel.png') }],
  ['携程酒店', { src: require('./../image/private/private_xc_hotel.png'), src0: require('./../image/private/private_xc_hotel_grey.png'), link: '/ctrip?type=hotel&orderType=1' }],
  ['首汽约车', { src: require('./../image/private/private_sq_taxi.png'), src0: require('./../image/private/private_sq_taxi_grey.png') }],
  ['飞亚达', { src: require('./../image/private/private_fiyta.png'), src0: require('./../image/private/private_fiyta_grey.png') }]
])
const showList = ['因私出行-机票预订', '因私出行-机票订单', '因私出行-协议酒店', '因私出行-携程酒店', '因私-首汽约车', '因私专区-飞亚达']
const showGroup = ['因私出行-机票', '因私出行-酒店', '因私出行-用车', '因私专区']
const relationalMap = new Map([
  ['因私出行-机票', '机票'],
  ['因私出行-机票预订', '机票预订'],
  ['因私出行-机票订单', '机票订单'],
  ['因私出行-酒店', '酒店'],
  ['因私出行-协议酒店', '协议酒店'],
  ['因私出行-携程酒店', '携程酒店'],
  ['因私出行-用车', '用车'],
  ['因私-首汽约车', '首汽约车'],
  ['因私专区', '专区'],
  ['因私专区-飞亚达', '飞亚达']
])
const showTypeMap = new Map([
  ['机票预订', '机票'],
  ['机票订单', '机票'],
  ['协议酒店', '酒店'],
  ['携程酒店', '酒店'],
  ['首汽约车', '用车'],
  ['飞亚达', '专区']
])

export default {
  typeList,
  showList,
  showGroup,
  relationalMap,
  showTypeMap
}
