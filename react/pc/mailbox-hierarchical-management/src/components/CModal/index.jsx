import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Modal, Button } from 'antd';
const CModal = (props) => {
  const [state, setState] = useState({ visible: false });
  const {cRef} = props
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    // showModal 就是暴露给父组件的方法
    showModal: () => {
      setState({
        visible: true,
      })
    },
    closeModal: () => {
      setState({
        visible: false,
      })
    }
  }))
  // const showModal = () => {
  //   setState({
  //     visible: true,
  //   });
  // };

  const handleOk = () => {
    props.submit();
  };

  const handleCancel = e => {
    setState({
      visible: false,
    });
  };
  const {title} = props.config
  return (
    <>
      <Modal
        forceRender={true}
        width={800}
        title={title}
        visible={state.visible}
        onOk={handleOk}
        onCancel={handleCancel}
				zIndex={1001}
      >
        {props.children}
      </Modal>
    </>
  );
}

export default CModal
