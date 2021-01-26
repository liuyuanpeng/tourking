import request from "@/utils/request";
import queryString from "querystring";

export default async function queryQRCode(params) {
  return request(
    `/server/travel/weixin/shop_code?${queryString.stringify({
      scene: params.shopId
    })}`,
    {
      responseType: "blob"
    }
  );
}
