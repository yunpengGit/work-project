/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-25 15:41:38
 * @LastEditors: peng
 * @LastEditTime: 2021-08-24 17:33:39
 */
import { http } from "./http";
const info = {
  getList(data) {
    return http({
      url: "/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeIndex.do?method=info",
      method: "get",
      data,
    });
  },
  getParams(data) {
    return http({
      url: "/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeIndex.do?method=parametersShow",
      method: "get",
      data,
    });
  },
  getSearch(data) {
    return http({
      url: "/km/sizzc/km_sizzc_knowledge/kmSizzcKnowledgeSearchBuilder.do?method=search&searchAll=true&resultType=json&modelName=KmSizzcKnowledge",
      method: "get",
      data,
    });
  },
};
export default info;
