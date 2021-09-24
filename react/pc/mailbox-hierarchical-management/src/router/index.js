/*
 * @Author: your name
 * @Date: 2020-10-27 16:18:28
 * @LastEditTime: 2021-06-24 18:11:55
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\router\index.js
 */
import { lazy } from 'react'
const Home = lazy(() => import('./../pages/home/Home.jsx'))
const MailboxManagement = lazy(() => import('./../pages/mailboxManagement'))
const MailboxGroupManagement = lazy(() =>
	import('./../pages/mailboxGroupManagement'),
)
const PublicMailboxConfig = lazy(() => import('./../pages/publicMailboxConfig'))
const EnterpriseConfiguration = lazy(() =>
	import('./../pages/enterpriseConfiguration'),
)
const MailboxUsageStatistics = lazy(() =>
	import('./../pages/statistics/mailboxUsageStatistics'),
)
const MailboxReceiveSendStatistics = lazy(() =>
	import('./../pages/statistics/mailboxReceiveSendStatistics'),
)
const EnterpriseMailboxUsageStatistics = lazy(() =>
	import('./../pages/statistics/enterpriseMailboxUsageStatistics'),
)
const AlisaConfiguration = lazy(() =>
	import('./../pages/alisaConfiguration'),
)
//
const EnterpriseMailboxReceiveSendStatistics = lazy(() =>
	import('./../pages/statistics/enterpriseMailboxReceiveSendStatistics'),
)
const SendAndReceiveLogs = lazy(() =>
	import('./../pages/auditManagement/sendAndReceiveLogs'),
)
const LoginLogs = lazy(() => import('./../pages/auditManagement/loginLogs'))
const AdministratorOperationLogs = lazy(() =>
	import('./../pages/auditManagement/administratorOperationLogs'),
)
const routerConfig = [
	{
		path: '/',
		key: '/',
		title: '概览',
		icon: 'gailan',
		page: <Home />,
	},
	{
		path: '/mailboxManagement',
		key: '/mailboxManagement',
		title: '邮箱管理',
		icon: 'youxiangguanli',
		page: <MailboxManagement />,
	},
	{
		path: '/mailboxGroupManagement',
		key: '/mailboxGroupManagement',
		title: '邮件组管理',
		icon: 'youjianzuguanli',
		page: <MailboxGroupManagement />,
	},
	{
		path: '/publicMailboxConfig',
		key: '/publicMailboxConfig',
		title: '公共邮箱配置',
		icon: 'gonggongyouxiangpeizhi',
		page: <PublicMailboxConfig />,
	},
	{
		path: '/enterpriseConfiguration',
		key: '/enterpriseConfiguration',
		title: '企业配置',
		icon: 'qiyepeizhi',
		children: [
			{
				path: '/enterpriseConfiguration',
				key: '/enterpriseConfiguration',
				title: '扩容配置',
				isLeaf: true,
				icon: 'qiyepeizhi',
				page: <EnterpriseConfiguration />,
			},
			{
				path: '/alisaConfiguration',
				key: '/alisaConfiguration',
				title: '域别名配置',
				isLeaf: true,
				icon: 'qiyepeizhi',
				page: <AlisaConfiguration />,
			}
		]
	},
	{
		path: '/statistics',
		key: '/statistics',
		title: '数据统计',
		icon: 'shujutongji',
		children: [
			{
				path: '/statistics/mailboxUsageStatistics',
				key: '/statistics/mailboxUsageStatistics',
				title: '用户邮箱使用量统计',
				isLeaf: true,
				icon: 'youxiangshiyongliangtongji',
				page: <MailboxUsageStatistics />,
			},
			{
				path: '/statistics/mailboxReceiveSendStatistics',
				key: '/statistics/mailboxReceiveSendStatistics',
				title: '用户邮箱收发量统计',
				isLeaf: true,
				icon: 'youxiangshoufaliangtongji',
				page: <MailboxReceiveSendStatistics />,
			},
			{
				path: '/statistics/enterpriseMailboxUsageStatistics',
				key: '/statistics/enterpriseMailboxUsageStatistics',
				title: '企业邮箱使用量统计',
				isLeaf: true,
				page: <EnterpriseMailboxUsageStatistics />,
			},
			{
				path: '/statistics/enterpriseMailboxReceiveSendStatistics',
				key: '/statistics/enterpriseMailboxReceiveSendStatistics',
				title: '企业邮箱收发量统计',
				isLeaf: true,
				page: <EnterpriseMailboxReceiveSendStatistics />,
			},
		],
	},
	{
		path: '/auditManagement',
		key: '/auditManagement',
		title: '审计管理',
		icon: 'shenjiguanli',
		children: [
			{
				path: '/auditManagement/sendAndReceiveLogs',
				key: '/auditManagement/sendAndReceiveLogs',
				title: '收发日志',
				isLeaf: true,
				icon: 'caozuorizhi',
				page: <SendAndReceiveLogs />,
			},
			{
				path: '/auditManagement/loginLogs',
				key: '/auditManagement/loginLogs',
				title: '登录日志',
				isHide: true, // 是否展示此页
				isLeaf: true, // 是否为叶子节点
				icon: 'caozuorizhi',
				page: <LoginLogs />,
			},
			{
				path: '/auditManagement/administratorOperationLogs',
				key: '/auditManagement/administratorOperationLogs',
				title: '管理员操作日志',
				isLeaf: true,
				icon: 'caozuorizhi',
				page: <AdministratorOperationLogs />,
			},
		],
	},
]
export default routerConfig
