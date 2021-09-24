import React from 'react';
import { withRouter, useHistory } from 'react-router-dom'
import { Menu } from 'antd';
import IconFont from './IconFont'
const SubMenu = Menu.SubMenu;
import {
  Link
} from 'react-router-dom'
import routerConfig from './../router'
import { useStore } from './../store';
const LeftNav = () =>{
	const [state] = useStore();
	const {identity} = state
  // static defaultProps = {
  //   menulist:[]
  // }

  const createMenu =  ((menuData)=>{  // 创建菜单
    //let itemIndex = 0; // 累计的每一项索引
    let submenuIndex = 0; // 累计的每一项展开菜单索引
    let menu = [];
    const create = (menuData,el)=>{
      for(let i=0;i<menuData.length;i++){
				if ((menuData[i].title == '企业配置'&&identity != 1)||menuData[i].isHide) {
					continue
				}
        if(menuData[i].children){  // 如果有子级菜单
          let children = [];
          create(menuData[i].children,children);
          submenuIndex++;
          el.push(
            <SubMenu
              key={`sub${submenuIndex}`}
              title={(
                <span style={{ height:'100%',display: 'block' }}>
									<IconFont type={menuData[i].icon}/>
                  {menuData[i].title}
                </span>
              )}
            >
              {children}
            </SubMenu>
          )
        }else{   // 如果没有子级菜单
					// itemIndex++;
					el.push(
						<Menu.Item key={menuData[i].path} title={menuData[i].title}>
							<Link to={menuData[i].path}>
								{menuData[i].isLeaf?'':<IconFont type={menuData[i].icon}/>}
								<span>{menuData[i].title}</span>
							</Link>
						</Menu.Item>
					)
				}
      }

    };

    create(menuData,menu);
    return menu;
  })(routerConfig);
	const history = useHistory();
  const defaultSelectedKeys = history.location.pathname
    return(
      <Menu
        theme='dark'
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        defaultSelectedKeys={['/']}
        defaultOpenKeys={[defaultSelectedKeys]}
        selectedKeys={[defaultSelectedKeys]}
      >
        {createMenu}
      </Menu>
    )
}
export default withRouter(LeftNav);
