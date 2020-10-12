import request from "@/utils/request";
import queryString from "querystring";

export async function saveCoupon(params) {
  return request(`/server/travel/coupon_pool/create`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function queryCouponList() {
  return request(
    `/server/travel/coupon_pool/list`,
    {
      method: "POST",
      data: {
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
    }
  );
}
