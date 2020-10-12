import {
  queryProductEvaluatePage,
  queryProductEvaluateState
} from "@/services/product";

export default {
  namespace: "product",

  state: {
    evaluate: [],
    evaluatePage: 0,
    evaluateTotal: 0
  },

  effects: {
    *fetchProductEvaluatePage({payload}, { call, put }) {
      const {page, size} = payload
      const response = yield call(queryProductEvaluatePage, {page, size});
      if (response.code === "SUCCESS") {
        yield put({
          type: "evaluate",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *changeEvaluateState({payload}, {call, put}) {
      const {status, id, onSuccess, onFailure, ...others} = payload
      const response = yield call(queryProductEvaluateState, {status, evaluateList:[id]})
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'fetchProductEvaluatePage',
          payload: {
            ...others
          }
        })
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    evaluate(state, action) {
      const { data_list, page, total_pages } = action.payload;
      return {
        ...state,
        evaluate: data_list || [],
        evaluatePage: page || 0,
        evaluateTotal: total_pages || 1
      };
    }
  }
};
