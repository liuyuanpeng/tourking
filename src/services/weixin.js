import request from "@/utils/request";
import queryString from 'querystring'

export async function queryWeixinAccessToken() {
  return request(`/weixin/cgi-bin/token?grant_type=client_credential&appid=wx7b18e1845642939f&secret=201c43094688e9e121e9acb1409cd619`);
}

export async function queryQRCode(params) {
  return request(`/weixin/wxa/getwxacodeunlimit?${queryString.stringify({
    access_token: params.access_token
  })}`, {
    method: 'POST',
    responseType: "blob",
    data: {
      scene: params.shopId
    }
  });
}
