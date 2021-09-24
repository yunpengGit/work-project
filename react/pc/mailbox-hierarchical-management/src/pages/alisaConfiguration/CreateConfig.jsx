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
      domainAlias: values.domainAlias,
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
        {/* <div className="small-title">邮箱空间配置</div> */}
        <Form.Item
          name="domainAlias"
          label="域别名"
          rules={[
            {
              required: true,
              message: '请输入',
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
