import request from "@/utils/request";

const PERCENTAGE_CODE = "SHOP_PERCENTAGE";

export async function queryPercentage() {
  return request(`/server/travel/config/list?code=${PERCENTAGE_CODE}`, {
    method: "POST",
    data: []
  });
}

export async function savePercentage(params) {
  return request("/server/travel/config/save", {
    method: "POST",
    data: {
      ...params,
      code: PERCENTAGE_CODE
    }
  });
}
