import request from "@/utils/request";

export async function querySitList() {
  return request('/server/travel/zuowei/list', {
    method: "POST",
    data: {}
  });
}

export async function deleteSit(id) {
  return request(`/server/travel/zuowei/${id}/delete`,{
    method: "POST"
  });
}

export async function saveSit(payload) {
  return request('/server/travel/zuowei/save', {
    method: "POST",
    data: payload
  });
}