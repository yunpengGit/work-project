import service from './request';

// 明细列表
export function viewOpinion(params) {
  return service({
    url: '/km/imissive/km_imissive_circulation/kmImissiveCir.do?method=viewOpinion',
    method: 'post',
    params,
  });
}

// 撤回，提醒展示列表
export function recallRemindList(params) {
  return service({
    url: '/km/imissive/km_imissive_circulation/kmImissiveCir.do?method=recallRemindList',
    method: 'post',
    params,
  });
}

// 分类总数
export function getCounts(params) {
  return service({
    url: '/km/imissive/km_imissive_circulation/kmImissiveCir.do?method=getCounts',
    method: 'get',
    params,
  });
}

// 撤回
export function deleteBacks(params) {
  return service({
    url: '/km/imissive/km_imissive_circulation/kmImissiveCir.do?method=deleteBacks',
    method: 'post',
    params,
  });
}

// 提醒
export function addReminds(params) {
  return service({
    url: '/km/imissive/km_imissive_circulation/kmImissiveCir.do?method=addReminds',
    method: 'post',
    params,
  });
}
