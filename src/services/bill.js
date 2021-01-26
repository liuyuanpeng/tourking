import request from "@/utils/request";

// 发票页
export async function queryBillPage(payload) {
  const {page, size} = payload
  return request('/server/travel/console/bill/page', {
    method: 'POST',
    data: {
      page_request_data: {
        page,
        size,
        sort_data_list: [
          {
            direction: 'DESC',
            property: 'createTime'
          }
        ]
      }
    }
  })
}

// 设置快递
export async function setExpressNum(data) {
  return request('./server/travel/console/bill/save_express_number', {
    method: 'POST',
    data
  })
}