import request from "@/utils/request";

export async function queryCarTypes() {
  return request('/server/travel/chexing/list', {
    method: "POST",
    data: {}
  });
}

export async function deleteCarType(id) {
  return request(`/server/travel/chexing/${id}/delete`,{
    method: "POST"
  });
}

export async function saveCarType(payload) {
  return request('/server/travel/chexing/save', {
    method: "POST",
    data: payload
  });
}