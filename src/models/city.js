import {
  queryCityList,
  saveCity,
  deleteCity
} from "@/services/city";

export default {
  namespace: "city",

  state: {
    list: []
  },

  effects: {
    *fetchCityList({payload}, { call, put }) {
      const response = yield call(queryCityList);
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
    *saveCity({ payload }, { call, put }) {
      const response = yield call(saveCity, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCityList"
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteCity({ payload }, { call, put }) {
      const response = yield call(deleteCity, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCityList"
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
