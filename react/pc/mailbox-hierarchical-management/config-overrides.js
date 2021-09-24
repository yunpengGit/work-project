/*
 * @Author: your name
 * @Date: 2020-10-27 15:35:30
 * @LastEditTime: 2021-01-06 09:46:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\config-overrides.js
 */
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

// const rewiredMap = () => config => {
// 	config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
// 	return config;
// };
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
		}),
		// 关闭mapSource
    // rewiredMap(),
    // less-loader@5.0.0
    // addLessLoader({
    //     javascriptEnabled: true,
    //     modifyVars: { '@primary-color': '#1DA57A' },
    // }),
    // less-loader > @6.0.6
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#1DA57A' },
      }
    })
);
