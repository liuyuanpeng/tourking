import request from "@/utils/request";
import qs from 'querystring'

export async function queryConsumeList(params) {
  return request(
    `/server/travel/consume/list${
      params ? `?${qs.stringify(params)}` : ""
    }`,
    {
      method: "POST",
      data: []
    }
  );
}

export async function saveConsume(params) {
  return request("/server/travel/consume/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteConsume(id) {
  return request(`/server/travel/consume/delete?consume_id=${id}`, {
    method: "DELETE"
  });
}
