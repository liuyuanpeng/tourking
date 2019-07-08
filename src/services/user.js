import request from "@/utils/request";
import md5 from "md5";

export async function queryShopUserList(shop_id) {
  return request(`/server/console/user/shop_user_list?shop_id=${shop_id}`, {
    method: "POST",
    data: []
  });
}

export async function queryUser() {
  return request(`/server/user/get?user_id=${localStorage.getItem("user-id")}`);
}

export async function queryAuthority() {
  return request(
    `/server/rbac/user/role/get?user_id=${localStorage.getItem("user-id")}`
  );
}

export async function queryUserList(params) {
  return request(`/server/rbac/user/role/user_page`, {
    method: "POST",
    data: {
      ...params,
      sort_data_list: [
        {
          direction: "DESC",
          property: "createTime"
        }
      ]
    }
  });
}

export async function searchUser(username) {
  return request(`/server/console/user/page?username=${username}`, {
    method: "POST",
    data: {
      page: 0,
      size: 10,
      sort_data_list: [
        {
          direction: "DESC",
          property: "createTime"
        }
      ]
    }
  });
}

export async function checkUser(params) {
  return request(`/server/console/user/check?username=${params.mobile}`);
}

export async function createUser(params) {
  const { password, ...others } = params;
  return request("/server/console/user/create", {
    method: "POST",
    data: {
      ...others,
      password: md5(password)
    }
  });
}

export async function addUser(params) {
  return request("/server/console/user/add", {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function updateUser(params) {
  const {password, ...others} = params
  const data = {...others}
  if (password) {
    data.password = md5(password)
  }
  return request("/server/console/user/update", {
    method: "POST",
    data
  });
}

export async function killUser(user_id) {
  return request(`/server/console/user/delete?user_id=${user_id}`, {
    method: "POST"
  });
}
