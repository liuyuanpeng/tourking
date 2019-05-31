import request from "@/utils/request";

export async function queryConsumeList(params) {
  return request(
    `/server/travel/consume/list${
      params && params.scene ? `?scene=${params.scene}` : ""
    }`,
    {
      method: "POST",
      data: []
    }
  );
}

export async function saveConsume(params) {
  return request("/server/travel/consume/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteConsume(id) {
  return request(`/server/travel/consume/delete?consume_id=${id}`, {
    method: "DELETE"
  });
}
