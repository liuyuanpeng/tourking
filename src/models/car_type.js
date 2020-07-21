import {
  queryCarTypes,
  saveCarType,
  deleteCarType
} from "@/services/car_type";

export default {
  namespace: "car_type",

  state: {
    list: []
  },

  effects: {
    *fetchCarTypes({payload}, { call, put }) {
      const response = yield call(queryCarTypes);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
        payload.onSuccess && payload.onSuccess(response.data)
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *saveCarType({ payload }, { call, put }) {
      const response = yield call(saveCarType, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCarTypes"
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteCarType({ payload }, { call, put }) {
      const response = yield call(deleteCarType, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCarTypes"
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
