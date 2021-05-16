import { queryPercentage, savePercentage } from "@/services/percentage";

export default {
  namespace: "percentage",

  state: {
    percent: 0,
    id: ""
  },

  effects: {
    *fetchPercentage({ payload }, { call, put }) {
      const response = yield call(queryPercentage);
      if (response.code === "SUCCESS") {
        if (response.data instanceof Array && response.data.length) {
          try {
            const percent = parseFloat(response.data[0].name)*100;
            const { id } = response.data[0];
            yield put({
              type: "save",
              payload: { percent, id }
            });
          } catch (error) {
            payload.onFailure && payload.onFailure(error);
          }
        }
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *savePercentage({ payload }, { call, put, select }) {
      const id = yield select(state => state.percentage.id);
      const response = yield call(
        savePercentage,
        id
          ? {
              id,
              ...payload.data
            }
          : {
              ...payload.data
            }
      );
      if (response.code === "SUCCESS") {
        try {
          const percent = parseFloat(response.data.name)*100;
          yield put({
            type: "save",
            payload: { percent, id: response.data.id }
          });

          payload.onSuccess && payload.onSuccess();
        } catch (error) {
          payload.onFailure && payload.onFailure(error);
        }
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        percent: action.payload.percent,
        id: action.payload.id
      };
    }
  }
};
