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
      const { onSuccess, onFailure, ...others } = payload;
      const response = yield call(saveRole, others);
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
        yield put({
          type: "getRoles"
        });
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *deleteRole({ payload }, { call, put }) {
      const { onSuccess, onFailure, id } = payload;
      const response = yield call(deleteRole, id);
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
        yield put({
          type: "getRoles"
        });
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *addRole({ payload }, { call, put }) {
      const { onSuccess, onFailure, ...others } = payload;
      const response = yield call(saveRole, others);
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
        yield put({
          type: "getRoles"
        });
      } else {
        onFailure && onFailure(response.message);
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
