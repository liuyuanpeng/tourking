import {
  querySitList,
  saveSit,
  deleteSit
} from "@/services/sit";

export default {
  namespace: "sit",

  state: {
    list: []
  },

  effects: {
    *fetchSitList({payload}, { call, put }) {
      const response = yield call(querySitList);
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
    *saveSit({ payload }, { call, put }) {
      const response = yield call(saveSit, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchSitList"
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteSit({ payload }, { call, put }) {
      const response = yield call(deleteSit, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchSitList"
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
