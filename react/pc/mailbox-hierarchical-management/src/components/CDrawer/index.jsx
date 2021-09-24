import React, { useState, useImperativeHandle } from 'react'
import { Drawer, Button } from 'antd'
import Context from './context'

const CDrawer = (props) => {
  const [visible, setVisible] = useState()
  const { config, closeFn } = props
  const [title, setTitle] = useState(config.title)
  useImperativeHandle(props.cRef, () => ({
    showDrawer: (params) => {
      if (params) {
        setTitle(params.title)
      }
      showDrawer()
    },
    closeDrawer: () => {
      onClose()
    },
  }))
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    if (closeFn) {
      closeFn()
    }
    setVisible(false)
  }
  return (
    <Drawer
      forceRender={true}
      title={title}
      width={700}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <Context.Provider value={visible}>{props.children}</Context.Provider>
    </Drawer>
  )
}

export default CDrawer
