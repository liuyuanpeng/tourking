import request from "@/utils/request";

export async function queryEmployeePage(params) {
  return request(
    `/server/rbac/role/page${params.car_no ? `?car_no=${params.car_no}` : ""}`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size
      }
    }
  );
}

export async function saveEmployee(params) {
  return request("/server/travel/car/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteEmployee(id) {
  return request(`/server/travel/car/delete?car_id=${id}`, {
    method: "DELETE"
  });
}
