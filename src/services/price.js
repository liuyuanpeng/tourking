import request from "@/utils/request";

export async function getPrice(params) {
  return request("/server/travel/price/count", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function queryPriceStrategyList() {
  return request("/server/travel/price/strategy/list", {
    method: "POST",
    data: []
  });
}

export async function savePriceStrategy(params) {
  return request("/server/travel/price/strategy/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function deletePriceStrategy(id) {
  return request(`/server/travel/price/strategy/delete?id=${id}`, {
    method: "DELETE"
  });
}
