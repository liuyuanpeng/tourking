import request from "@/utils/request";
import queryString from "querystring";

// 订单历史
export async function queryCharteredPage({ data, params }) {
  return request(
    `/server/travel/private_consume/page?${queryString.stringify(params)}`,
    {
      method: "POST",
      data: {
        ...data,
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

export async function saveChartered(params) {
  return request("/server/travel/private_consume/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteChartered(id) {
  return request(
    `/server/travel/private_consume/delete?private_consume_id=${id}`,
    {
      method: "POST"
    }
  );
}
