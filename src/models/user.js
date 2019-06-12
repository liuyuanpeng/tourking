import {
  queryUser,
  queryUserList,
  searchUser,
  createUser,
  checkUser,
  addUser,
  updateUser,
  killUser,
  queryShopUserList
} from "@/services/user";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import { queryShopList } from "@/services/shop";

const mergeRoles = roles => {
  let arr = [];
  if (roles) {
    roles.forEach(role => {
      role.extend && (arr = [...arr, ...role.extend.split(",")]);
    });
  }
  return Array.from(new Set(arr));
};

export default {
  namespace: "user",

  state: {
    list: [],
    page: 0,
    size: 10,
    currentUser: {},
    shopName: "",
    shopId: "",
    shopUserList: []
  },

  effects: {
    *fetchShopUserList({ payload }, { call, put }) {
      const response = yield call(queryShopUserList, payload.shop_id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "shopUser",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *fetchUser(_, { call, put }) {
      const response = yield call(queryUser);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: {
            ...response.data.user,
            authority: mergeRoles(response.data.roles)
          }
        });
        reloadAuthorized();
        const shopRole = response.data.roles.find(
          item => item.role_type === "PLATFORM_USER_INIT"
        );
        if (shopRole) {
          // 商家
          const shopRes = yield call(queryShopList, response.data.user.id);
          if (shopRes.code === "SUCCESS") {
            if (shopRes.data && shopRes.data.length) {
              const shopInfo = shopRes.data[0];
              localStorage.setItem("shop-name", shopInfo.name);
              localStorage.setItem("shop-id", shopInfo.id);
              localStorage.setItem("shop-role", shopRole.id);
              yield put({
                type: "saveShopInfo",
                payload: {
                  shopName: shopInfo.name,
                  shopId: shopInfo.id
                }
              });
            }
          }
        }
      } else if (response.code === 'TOKEN_SESSION_NOT_FOUND') {
        // 令牌过期
        yield put({
          type: 'login/logout'
        })
      }
    },
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, {
        page: payload.page,
        size: payload.size
      });
      if (response.code === "SUCCESS") {
        yield put({
          type: "saveList",
          payload: {
            ...response.data
          }
        });
      } else {
        payload.onFailure(response.message);
      }
    },
    *searchUser({ payload }, { call, put }) {
      const response = yield call(searchUser, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "saveList",
          payload: {
            ...response.data,
            page: 0,
            size: 10
          }
        });
      }
    },
    *tryCreateShopUser({ payload }, { call, put }) {
      const response = yield call(checkUser, payload.data);
      if (response.code === "SUCCESS") {
        if (response.data) {
          let roleExist = false;
          if (response.data.roles instanceof Array) {
            for (let i = 0; i < response.data.roles.length; i += 1) {
              const role = response.data.roles[i];
              if (role.id === payload.data.role_id) {
                roleExist = true;
                break;
              }
            }
          }

          !roleExist
            ? payload.onCanAddRole({
                user: response.data,
                params: payload.data
              })
            : payload.onFailure("该账号已存在!");
        } else {
          const res = yield call(createUser, payload.data);
          if (res.code === "SUCCESS") {
            yield put({
              type: "fetchShopUserList",
              payload: {
                shop_id: localStorage.getItem("shop-id")
              }
            });
            payload.onSuccess();
          } else {
            payload.onFailure(res.message);
          }
        }
      } else {
        payload.onFailure(response.message);
      }
    },
    *addShopUserRole({ payload }, { call, put }) {
      const response = yield call(addUser, {
        userId: payload.user.user.id,
        ...payload.params
      });
      if (response.code === "SUCCESS") {
        payload.onSuccess();
        yield put({
          type: "fetchShopUserList",
          payload: {
            shop_id: localStorage.getItem("shop-id")
          }
        });
      } else {
        payload.onFailure(response.message);
      }
    },
    *tryCreateUser({ payload }, { call, put }) {
      const response = yield call(checkUser, payload.data);
      if (response.code === "SUCCESS") {
        if (response.data) {
          let roleExist = false;
          if (response.data.roles instanceof Array) {
            for (let i = 0; i < response.data.roles.length; i += 1) {
              const role = response.data.roles[i];
              if (role.id === payload.data.role_id) {
                roleExist = true;
                break;
              }
            }
          }

          if (roleExist) {
            payload.onFailure("该账号已存在!");
          } else {
            payload.onCanAddRole({
              user: response.data,
              params: payload.data
            })
          }
        } else {
          const res = yield call(createUser, payload.data);
          if (res.code === "SUCCESS") {
            yield put({
              type: "fetchUserList",
              payload: {
                page: 0,
                size: 10
              }
            });
            payload.onSuccess();
          } else {
            payload.onFailure(res.message);
          }
        }
      } else {
        payload.onFailure(response.message);
      }
    },
    *addUserRole({ payload }, { call, put }) {
      const response = yield call(addUser, {
        userId: payload.user.user.id,
        ...payload.params,
        role_id: payload.role.id
      });
      if (response.code === "SUCCESS") {
        payload.onSuccess();
        yield put({
          type: "fetchUserList",
          payload: {
            page: 0,
            size: 10
          }
        });
      } else {
        payload.onFailure(response.message);
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(killUser, payload.id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchUserList",
          payload: {
            page: payload.page,
            size: 10
          }
        });
        payload.onSuccess();
      } else {
        payload.onFailure(response.message);
      }
    },
    *deleteShopUser({ payload }, { call, put }) {
      const response = yield call(killUser, payload.id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchShopUserList",
          payload: {
            shop_id: localStorage.getItem("shop-id")
          }
        });
        payload.onSuccess();
      } else {
        payload.onFailure(response.message);
      }
    },
    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchUserList",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess();
      } else {
        payload.onFailure(response.message);
      }
    },
    *updateShopUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchShopUserList",
          payload: {
            shop_id: localStorage.getItem("shop-id")
          }
        });
        payload.onSuccess();
      } else {
        payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      setAuthority(action.payload.authority);
      return {
        ...state,
        currentUser: action.payload
      };
    },
    saveList(state, action) {
      console.log(action.payload.data_list)
      return {
        ...state,
        list: action.payload.data_list,
        page: action.payload.page || 0,
        size: action.payload.size || 10,
        total: action.payload.total_pages || 1
      };
    },
    saveShopInfo(state, action) {
      return {
        ...state,
        shopName: action.payload.shopName,
        shopId: action.payload.shopId
      };
    },
    shopUser(state, action) {
      return {
        ...state,
        shopUserList: action.payload
      };
    }
  }
};
