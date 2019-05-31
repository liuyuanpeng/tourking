import {
  queryStrategyList,
  saveStrategy,
  deleteStrategy
} from "@/services/order";

export default {
  namespace: "dispatchStrategy",

  state: {
    list: []
  },

  effects: {
    *fetchStrategyList({ payload }, { call, put }) {
      const response = yield call(queryStrategyList);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },

    *saveStrategy({ payload }, { call, put }) {
      const response = yield call(saveStrategy, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchStrategyList"
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteStrategy({ payload }, { call, put }) {
      const response = yield call(deleteStrategy, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchStrategyList"
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    }
  }
};
