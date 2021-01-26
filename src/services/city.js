import request from "@/utils/request";

export async function queryCity(id) {
  return request(`/server/travel/city/${id}/detail`);
}

export async function queryCityList() {
  return request('/server/travel/city/list', {
    method: "POST",
    data: {}
  });
}

export async function deleteCity(id) {
  return request(`/server/travel/city/${id}/delete`,{
    method: "POST"
  });
}

export async function saveCity(payload) {
  return request('/server/travel/city/save', {
    method: "POST",
    data: payload
  });
}