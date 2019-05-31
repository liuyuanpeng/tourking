import request from "@/utils/request";

export async function queryShopList(user_id) {
  return request(`/server/console/user/shop_list?user_id=${user_id}`, {
    method: "POST"
  });
}

export async function searchShopList(value) {
  return request(`/server/travel/shop/list?name=${value}`, {
    method: "POST",
    data: []
  });
}
