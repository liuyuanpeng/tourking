import { cancelOrder } from "@/services/order";

export default {
  namespace: "shuttle",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchOrderPage({ payload }, { call, put }) {
      const response = yield call(cancelOrder, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      }
    },
    *cancelOrder({ payload }, { call, put }) {
      const { onSuccess, onFailure, data, params, page, size } = payload;
      const response = yield call(cancelOrder, data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            page,
            size,
            ...params
          }
        });
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      const { data_list, page, total_pages } = action.payload;
      return {
        ...state,
        list: data_list || [],
        page: page || 0,
        total: total_pages || 1
      };
    }
  }
};
