import { queryWarningPage, dispatchDriver } from "@/services/warning";

export default {
  namespace: "warning",

  state: {
    list: [],
    page: 0,
    total: 0,
    warning_no: 0,
    urgent_no: 0,
    warning_and_urgent: 0
  },

  effects: {
    *fetchWarningPage({ payload }, { call, put }) {
      const response = yield call(queryWarningPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *dispatchDriver({ payload }, { call, put }) {
      const { onSuccess, onFailure, data, params } = payload;
      const response = yield call(dispatchDriver, data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchWarningPage",
          payload: {
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
      const {
        urgent,
        warning,
        travel_order_page: { data_list, page, total_pages }
      } = action.payload;
      return {
        ...state,
        list: data_list || [],
        page: page || 0,
        total: total_pages || 1,
        urgent_no: urgent || 0,
        warning_no: warning || 0,
        warning_and_urgent: urgent + warning || 0
      };
    }
  }
};
