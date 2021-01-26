import request from "@/utils/request";

const COMMENT_TYPE_CODE = "CODE_COMMENTS";

export async function queryComments() {
  return request(`/server/travel/config/list?code=${COMMENT_TYPE_CODE}`, {
    method: "POST",
    data: []
  });
}

export async function saveComments(params) {
  return request("/server/travel/config/save", {
    method: "POST",
    data: {
      ...params,
      code: COMMENT_TYPE_CODE
    }
  });
}
