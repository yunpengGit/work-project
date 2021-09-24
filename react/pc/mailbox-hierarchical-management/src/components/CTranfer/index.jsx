import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Transfer, Switch, Table } from 'antd'
import difference from 'lodash/difference'
// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => {
  return (
    <Transfer {...restProps} showSelectAll={false}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns

        const rowSelection = {
          getCheckboxProps: (item) => ({
            disabled: listDisabled || item.disabled,
          }),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key)
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys)
            onItemSelectAll(diffKeys, selected)
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected)
          },
          selectedRowKeys: listSelectedKeys,
        }
        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : null }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return
                onItemSelect(key, !listSelectedKeys.includes(key))
              },
            })}
          />
        )
      }}
    </Transfer>
  )
}

const leftTableColumns = [
  {
    dataIndex: 'userName',
    title: '员工姓名',
  },
  {
    dataIndex: 'displayAlias',
    title: '邮箱',
  },
  // {
  //   dataIndex: 'departmentName',
  //   title: '部门名称',
  // },
]
const rightTableColumns = [
  {
    dataIndex: 'userName',
    title: '员工姓名',
  },
]

const CTranfer = (props) => {
  const { tranferData, selectData, transferConfig } = props
  const { relatedId } = transferConfig
  const [data, setData] = useState()
  const [targetKeys, setTargetKeys] = useState()
  useEffect(() => {
    const Keys = selectData.map((item) => {
      return item.key
    })
    setTargetKeys(Keys)
    // console.log(selectData)
    // console.log(tranferData)
    const data = tranferData.map((item) => {
      selectData.map((ele) => {
        if (item.key === ele.key) {
          item[relatedId] = ele[relatedId]
        }
      })
      return item
    })
    setData(data)
  }, [tranferData, selectData, relatedId])
  // console.log(tranferData)
  // console.log(targetKeys)
  useImperativeHandle(props.cRef, () => ({
    // 获取当前选中项
    selectKeys: () => {
      const arr = data.filter((item) => {
        return targetKeys.includes(item.key)
      })
      return arr || []
    },
  }))
  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys)
  }

  return (
    <>
      <TableTransfer
        dataSource={data}
        targetKeys={targetKeys}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.title.indexOf(inputValue) !== -1 ||
          item.displayAlias.indexOf(inputValue) !== -1
        }
        showSearch={true}
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </>
  )
}

export default CTranfer
