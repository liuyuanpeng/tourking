import {
  queryCharteredPage,
  saveChartered,
  deleteChartered
} from "@/services/chartered";

export default {
  namespace: "chartered",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchCharteredPage({ payload }, { call, put }) {
      const { data, params, onSuccess, onFailure } = payload;
      const response = yield call(queryCharteredPage, {data, params});
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *saveChartered({ payload }, { call, put }) {
      const { data, onSuccess, onFailure } = payload;
      const response = yield call(saveChartered, data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCharteredPage"
        });
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *deleteChartered({ payload }, { call, put }) {
      const { data, onSuccess, onFailure } = payload;
      const response = yield call(deleteChartered, data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCharteredPage"
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
