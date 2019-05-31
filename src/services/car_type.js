import request from "@/utils/request";

const CAR_TYPE_CODE = "CODE_CAR_TYPE";

export async function queryCarTypes() {
  return request(`/server/travel/config/list?code=${CAR_TYPE_CODE}`, {
    method: "POST",
    data: []
  });
}

export async function saveCarType(params) {
  return request("/server/travel/config/save", {
    method: "POST",
    data: {
      ...params,
      code: CAR_TYPE_CODE
    }
  });
}
export async function deleteCarType(id) {
  return request(`/server/travel/config/delete?config_id=${id}`, {
    method: "DELETE"
  });
}
