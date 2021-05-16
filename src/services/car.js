import request from "@/utils/request";
import { stringify } from "qs";

export async function queryCarPage(params) {
  const searchKeys = {}
  const {car_no, driver_user_id} = params
  if (car_no) {
    searchKeys.car_no = car_no
  }
  if (driver_user_id) {
    searchKeys.driver_user_id = driver_user_id
  }
  return request(
    `/server/travel/car/page?${stringify(searchKeys)}`,
    {
      method: "POST",
      data: {
        page: params.page,
        size: params.size,
        sort_data_list: [
          {
            direction: "DESC",
            property: "createTime"
          }
        ]
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
