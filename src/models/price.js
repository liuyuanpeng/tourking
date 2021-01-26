import {
  queryPriceStrategyList,
  savePriceStrategy,
  deletePriceStrategy
} from "@/services/price";

export default {
  namespace: "price",

  state: {
    list: []
  },

  effects: {
    *fetchPriceStrategyList({payload}, { call, put }) {
      const response = yield call(queryPriceStrategyList);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *savePriceStrategy({ payload }, { call, put }) {
      const response = yield call(savePriceStrategy, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchPriceStrategyList"
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deletePriceStrategy({ payload }, { call, put }) {
      const response = yield call(deletePriceStrategy, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchPriceStrategyList"
        });
        payload.onSuccess && payload.onSuccess()
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
