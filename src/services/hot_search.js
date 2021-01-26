import request from "@/utils/request";

export async function queryHotSearchPage(params) {
  return request('/server/travel/hot_search/page', {
    method: "POST",
    data: {...params}
  });
}

export async function deleteHotSearch(id) {
  return request(`/server/travel/hot_search/${id}/delete`,{
    method: "POST"
  });
}

export async function saveHotSearch(params) {
  return request('/server/travel/hot_search/save', {
    method: "POST",
    data: {...params}
  });
}