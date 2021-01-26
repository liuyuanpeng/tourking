import request from "@/utils/request";

export async function queryAddressPage(params) {
  return request(
    `/server/travel/address/page${
      params.value ? `?value=${params.value}` : ""
    }`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size
      }
    }
  );
}

export async function saveAddress(params) {
  return request("/server/travel/address/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function deleteAddress(id) {
  return request(`/server/travel/address/delete?id=${id}`, {
    method: "DELETE"
  });
}
