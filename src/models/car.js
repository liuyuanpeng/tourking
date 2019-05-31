import {
  queryCarPage,
  saveCar,
  deleteCar
} from "@/services/car";

export default {
  namespace: "car",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchCarPage({payload}, { call, put }) {
      const response = yield call(queryCarPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *saveCar({ payload }, { call, put }) {
      const response = yield call(saveCar, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCarPage",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteCar({ payload }, { call, put }) {
      const response = yield call(deleteCar, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCarPage",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
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
