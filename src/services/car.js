import request from "@/utils/request";

export async function queryCarPage(params) {
  return request(
    `/server/travel/car/page${params.car_no ? `?car_no=${params.car_no}` : ""}`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size
      }
    }
  );
}
export async function queryCarList() {
  return request("/server/travel/car/list", {
    method: "POST",
    data: []
  });
}

export async function saveCar(params) {
  return request("/server/travel/car/save", {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function deleteCar(id) {
  return request(`/server/travel/car/delete?car_id=${id}`, {
    method: "DELETE"
  });
}
