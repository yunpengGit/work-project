import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
} from 'antd'
import axios from 'axios'
import clonedeep from 'lodash.clonedeep'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'
import CModal from '../../components/CModal'
import CTree from '../../components/CTree'
import TreeContext from '../../components/CTree/context'
import { CreateMailGroupPage } from './style'
import { selectRootOrgList } from './service'
import { localStorageGet } from '../../utils/localStorageFn'
const { Option } = Select

const GB = 1024 * 1024 * 1024
const MB = 1024 * 1024
const POSITIVE_INTEGER = /^[1-9]\d*$/
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const CreateConfig = (props) => {
  const formRef = React.createRef()
  const modalTree = useRef()
  const { fn, current, showCreate, closeCDrawer } = props
  const { edit, create } = fn
  // 组织机构树
  const [treeData, setTreeData] = useState([])
  const [selectData, setSelectData] = useState({})
  // 编辑状态不允许修改公司
  const [companyNameBtnShow, setCompanyNameBtnShow] = useState(true)

  //默认参数map映射关系
  useImperativeHandle(props.cRef, () => ({
    resetForm: () => {
      onReset()
    },
  }))
  // modal配置参数
  const modalConfig = {
    title: '选择部门',
  }
  const onFinish = (values) => {
    const data = {
      companyDilatationId: values.companyDilatationId,
      companyId: values.companyId2,
      companyName: values.companyName2,
      emailDilatationStorage: values.emailDilatationStorage * GB,
      emailDilatationCount: values.emailDilatationCount,
      dilatationEffective: dayjs(values.dilatationEffective).format(
        'YYYY-MM-DD',
      ),
    }
    if (current.companyName) {
      edit(data)
    } else {
      create(data)
    }
  }
  const onReset = () => {
    setCompanyNameBtnShow(true)
    setSelectData({})
    formRef.current.resetFields()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (current.companyId) {
      onFill(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])
  const onFill = (data) => {
    const params = clonedeep(data)
    params.companyId2 = params.companyId
    params.companyName2 = params.companyName
    params.emailDilatationStorage = params.emailDilatationStorage / GB
    params.emailDilatationCount = params.emailDilatationCount
    params.dilatationEffective = moment(params.dilatationEffective)
    formRef.current.setFieldsValue(params)
    setCompanyNameBtnShow(false)
    setSelectData({
      title: params.companyName,
      key: params.companyId,
    })
  }
  const onCancel = () => {
    // onReset()
    closeCDrawer()
  }
  // 获取顶级公司列表
  const selectRootOrgListFn = () => {
    selectRootOrgList().then((res) => {
      let arr = []
      arr = res.data.map((item) => {
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
      setTreeData(arr)
    })
  }
  const getCompanyList = async (params) => {
    const res = await axios({
      url: `/api/org/${params.id}/getCompanyList`,
      method: 'get',
      headers: {
        Authorization: JSON.parse(localStorageGet('loginInfo')).token,
      },
    })
    let arr = []
    if (res.data.success) {
      arr = res.data.data.map((item) => {
        return {
          title: item.orgName,
          key: item.orgId,
        }
      })
    } else {
      message.error(res.data.message)
    }
    return arr
  }
  // 组织机构选中数据更新
  const selectDataTree = (params) => {
    setSelectData(params)
    formRef.current.setFieldsValue({
      companyId2: params.key,
      companyName2: params.title,
    })
  }
  // 展示机构数
  const showOrgTree = async () => {
    await selectRootOrgListFn()
    modalTree.current.showModal()
    modalTree.current.showModal()
  }
  // modal确认按钮
  const modalSubmit = () => [modalTree.current.closeModal()]
  const disabledDate = (current) => {
    return (
      current && current < dayjs(Date.now() - 24 * 60 * 60 * 1000).endOf('day')
    )
  }
  return (
    <CreateMailGroupPage>
      <Form {...layout} ref={formRef} onFinish={onFinish}>
        <Form.Item name="companyDilatationId" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item name="companyName2" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item noStyle>
          <Row>
            <Col span={12} className="hidden-input">
              <Form.Item
                name="companyId2"
                label="公司名称"
                rules={[
                  {
                    required: true,
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 9 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} pull={8} style={{ paddingTop: 5, marginLeft: -8 }}>
              {selectData.title ? (
                <span style={{ paddingLeft: 8 }}>{selectData.title}</span>
              ) : (
                ''
              )}
              {companyNameBtnShow ? (
                <a onClick={showOrgTree} style={{ paddingLeft: 8 }}>
                  通过组织架构选择
                </a>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form.Item>
        <div className="small-title">邮箱空间配置</div>
        <span className="tip">
          注: 邮箱空间扩容后,该账号的附件容量也将由30M自动扩大至100M
        </span>
        <Form.Item
          name="emailDilatationStorage"
          label="扩容空间"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="请选择扩容空间" allowClear>
            <Option value={10}>10GB</Option>
            <Option value={20}>20GB</Option>
            <Option value={50}>50GB</Option>
            <Option value={100}>100GB</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="emailDilatationCount"
          label="扩容账号数量"
          rules={[
            {
              required: true,
              pattern: POSITIVE_INTEGER,
              message: '请输入正整数',
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
					name="dilatationEffective"
					label="扩容生效日期"
				>
					<DatePicker disabledDate={disabledDate} locale={locale} />
				</Form.Item> */}
        <Form.Item
          name="dilatationEffective"
          label="扩容失效日期"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker disabledDate={disabledDate} locale={locale} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            保存
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
      <CModal cRef={modalTree} submit={modalSubmit} config={modalConfig}>
        <TreeContext.Provider value={{ treeData }}>
          <CTree
            parentFn={{ getOrgChildrenList: getCompanyList, selectDataTree }}
          />
        </TreeContext.Provider>
      </CModal>
    </CreateMailGroupPage>
  )
}
export default CreateConfig
