import { queryCoversPage, saveCover, deleteCover } from "@/services/covers";

export default {
  namespace: "covers",

  state: {
    list: []
  },

  effects: {
    *fetchCovers({payload}, { call, put }) {
      const response = yield call(queryCoversPage);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveCover({ payload }, { call, put }) {
      const response = yield call(saveCover, payload.data);
      if (response.code === "SUCCESS") {
        try {
          yield put({
            type: "fetchCovers"
          });
          payload.onSuccess && payload.onSuccess();
        } catch (error) {
          payload.onFailure && payload.onFailure(error)
        }
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteCover({ payload }, { call, put }) {
      const response = yield call(deleteCover, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCovers"
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      const { data_list = [] } = action.payload;
      return {
        ...state,
        list: data_list
      };
    }
  }
};
