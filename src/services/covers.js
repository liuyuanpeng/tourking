import request from "@/utils/request";

export async function queryCoversPage() {
  return request("/server/travel/lunbo/page", {
    method: "POST",
    data: {
      page: 0,
      size: 10
    }
  });
}

export async function saveCover(params) {
  return request("/server/travel/lunbo/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteCover(id) {
  return request(`/server/travel/lunbo/delete?lunbo_id=${id}`, {
    method: "POST"
  });
}
