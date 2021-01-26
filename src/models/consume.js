import {
  queryConsumeList,
  saveConsume,
  deleteConsume
} from "@/services/consume";

export default {
  namespace: "consume",

  state: {
    list: []
  },

  effects: {
    *fetchConsumeList({ payload }, { call, put }) {
      const response = yield call(queryConsumeList, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },

    *saveConsume({ payload }, { call, put }) {
      const response = yield call(saveConsume, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchConsumeList"
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteConsume({ payload }, { call, put }) {
      const response = yield call(deleteConsume, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchConsumeList"
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
