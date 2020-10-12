import request from "@/utils/request";
import queryString from "querystring";

export async function queryProductEvaluateState(params) {
  const {status, evaluateList} = params
  return request(`/server/travel/private_consume/evaluate_status_change?status=${status}`, {
    method: "POST",
    data: evaluateList
  });
}

export async function queryProductEvaluatePage(params) {
  return request(
    `/server/travel/private_consume/evaluate_page`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
    }
  );
}
