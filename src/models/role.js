import { queryRoles, saveRole, deleteRole } from "@/services/role";

export default {
  namespace: "role",

  state: {
    roles: []
  },

  effects: {
    *getRoles(_, { call, put }) {
      const response = yield call(queryRoles);
      if (response.code === "SUCCESS") {
        localStorage.setItem("roles", JSON.stringify(response.data));
        yield put({
          type: "refreshList",
          payload: response.data
        });
      }
    },
    *saveRole({ payload }, { call, put }) {
      const response = yield call(saveRole, payload);
      if (response.code === "SUCCESS") {
        if (payload.id) {
          yield put({
            type: "saveOK"
          });
        }
      } else {
        yield put({
          type: "createOK"
        });
      }
    },
    *deleteRole({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (response.code === "SUCCESS") {
        const res = yield call(queryRoles);
        if (res.code === "SUCCESS") {
          yield put({
            type: "refreshList",
            payload: res.data
          });
        }
      }
    },
    *addRole({ payload }, { call, put }) {
      const response = yield call(saveRole, payload);
      if (response.call === "SUCCESS") {
        const res = yield call(queryRoles);
        if (res.code === "SUCCESS") {
          yield put({
            type: "refreshList",
            payload: res.data
          });
        }
      }
    }
  },

  reducers: {
    refreshList(state, { payload }) {
      return {
        ...state,
        roles: payload
      };
    },
    saveOK(state) {
      return {
        ...state
      };
    },
    createOK(state) {
      return {
        ...state
      };
    },
    deleteOK(state) {
      return {
        ...state
      };
    }
  }
};
