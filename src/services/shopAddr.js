import request from "@/utils/request";

const SHOP_ADDRESS_CODE = "SHOP_ADDRESS_";

export async function queryShopAddr(shopId) {
  return request(`/server/travel/config/list?code=${SHOP_ADDRESS_CODE}${shopId}`, {
    method: "POST",
    data: []
  });
}

export async function saveShopAddr(params) {
  return request("/server/travel/config/save", {
    method: "POST",
    data: {
      ...params,
      code: SHOP_ADDRESS_CODE+params.shopId
    }
  });
}
export async function deleteShopAddr(id) {
  return request(`/server/travel/config/delete?config_id=${id}`, {
    method: "DELETE"
  });
}
