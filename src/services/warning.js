import request from "@/utils/request";
import queryString from "querystring";

export async function queryWarningPage(params) {
  const { onSuccess, onFailure, page, size, ...others } = params;
  return request(
    `/server/travel/order/warning_page?${queryString.stringify(others)}`,
    {
      method: "POST",
      data: {
        page,
        size
      }
    }
  );
}

export async function dispatchDriver(params) {
  const { order_id, driver_user_id } = params;
  return request(
    `/server/travel/driver/force_accept_order?order_id=${order_id}&driver_user_id=${driver_user_id}`,
    {
      method: "POST"
    }
  );
}
