import request from "@/utils/request";

export async function queryVisitUsersPage(params) {
  const {source_shop_id, page, size} = params
  return request(`/server/travel/visit/page`, {
    method: "POST",
    data: {
      source_shop_id,
      page_request_data: {
        page,
        size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
      }
      
    }
  });
}

