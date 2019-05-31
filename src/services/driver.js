import request from "@/utils/request";
import queryString from "querystring";

export async function searchDriverList(value) {
  return request(`/server/travel/driver/list_driver?value=${value}`, {
    method: "POST",
    data: []
  });
}

export async function queryDriverList() {
  return request("/server/travel/driver/list_driver", {
    method: "POST",
    data: []
  });
}

export async function queryDriverEvaluatePage(params) {
  const { page, size, onSuccess, onFailure, ...others } = params;
  return request(
    `/server/travel/driver/page_driver_evaluate?${queryString.stringify(
      others
    )}`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size
      }
    }
  );
}
