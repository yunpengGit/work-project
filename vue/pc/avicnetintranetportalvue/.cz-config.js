/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-21 21:34:46
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-24 14:45:18
 */
module.exports = {
  types: [
    { value: 'feat', name: '新增一个功能' },
    { value: 'fix', name: '修复一个bug' },
    { value: 'docs', name: '文档变更' },
    { value: 'style', name: '代码格式修正（非功能）' },
    { value: 'refactor', name: '代码重构' },
    { value: 'perf', name: '性能优化' },
    { value: 'test', name: '自动化测试' },
    { value: 'chore', name: '构建流程变更或者增加辅助工具' },
    { value: 'revert', name: '代码回退' }
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body'],
  subjectLimit: 100
}
