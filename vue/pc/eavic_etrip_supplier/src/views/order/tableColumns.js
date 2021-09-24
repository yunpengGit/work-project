const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    width: 60,
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '票号',
    dataIndex: 'ticketId',
    scopedSlots: { customRender: 'ticketId' }
  },
  {
    title: '乘机人',
    width: 80,
    dataIndex: 'passengerName'
  },
  {
    title: '出发地',
    dataIndex: 'placeOfDeparture'
  },
  {
    title: '目的地',
    dataIndex: 'destination'
  },
  {
    title: '起飞时间',
    dataIndex: 'departureTime'
  },
  {
    title: '录入时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'operating',
    width: 240,
    scopedSlots: { customRender: 'operating' }
  }
]
export default columns
