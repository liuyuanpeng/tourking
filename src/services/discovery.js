import request from "@/utils/request";
import queryString from "querystring";

export async function queryDiscoverValid({id, valid}) {
  return request(`/server/travel/faxian/${id}/valid?valid=${valid}`, {
    method: "POST"
  });
}

export async function deleteDiscovery(id) {
  return request (`/server/travel/faxian/${id}/delete`, {
    method: "POST"
  })
}

export async function queryDiscoverCommentValid({id, valid}) {
  return request(`/server/travel/faxian_evaluate/${id}/valid?valid=${valid}`, {
    method: "POST"
  });
}

export async function deleteDiscoverComment(id) {
  return request(`/server/travel/faxian_evaluate/${id}/delete`, {
    method: 'POST'
  });
}

export async function queryDiscoverPage(params) {
  const { page, size, ...others } = params;
  return request(`/server/travel/faxian/page`, {
    method: "POST",
    data: {
      ...others,
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

export async function queryDiscoverCommentPage(params) {
  const { page, size, ...others } = params;
  return request(`/server/travel/faxian_evaluate/page`, {
    method: "POST",
    data: {
      ...others,
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
