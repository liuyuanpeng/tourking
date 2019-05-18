import {
  queryUser,
  queryAuthority,
  queryUserList,
  searchUser,
  createUser,
  checkUser,
  addUserRole,
  updateUser,
  killUser
} from "@/services/user";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import { instanceOf } from "prop-types";

const mergeRoles = roles => {
  let arr = [];
  roles &&
    roles.forEach(role => {
      role.extend && (arr = [...arr, ...role.extend.split(",")]);
    });
  return Array.from(new Set(arr));
};

export default {
  namespace: "user",

  state: {
    list: [],
    page: 0,
    size: 10,
    currentUser: {}
  },

  effects: {
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
    *tryCreateUser({ payload }, { call, put }) {
      const response = yield call(checkUser, payload.data);
      if (response.code === "SUCCESS") {
        if (response.data) {
          let roleExist = false;
          if (response.data.roles instanceof Array) {
            for (let i = 0; i < response.data.roles.length; i++) {
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
      const response = yield call(addUserRole, {
        user_id: payload.user.id,
        role_id: payload.role.id
      });
      if (response.code === "SUCCESS") {
        if (payload.role.role_type === "PLATFORM_USER_INIT") {
          // 商家
          const res = yield call(updateUser, {
            ...payload.user,
            user_id: payload.user.id,
            shop_name: payload.params.shop_name
          });
          if (res.code === "SUCCESS") {
            payload.onSuccess();
          } else {
            payload.onFailure(res.message);
          }
        } else if (
          payload.role.role_type === "APPLICATION_USER_CUSTOM" &&
          payload.role.is_init
        ) {
          // 司机
          const res = yield call(updateUser, {
            ...payload.user,
            user_id: payload.user.id,
            driver_evaluate: payload.params.driver_evaluate
          });
          if (res.code === "SUCCESS") {
            payload.onSuccess();
          } else {
            payload.onFailure(res.message);
          }
        } else {
          payload.onSuccess();
        }
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
      return {
        ...state,
        list: action.payload.data_list,
        page: action.payload.page,
        size: action.payload.size,
        total: action.payload.total_pages
      };
    }
  }
};
