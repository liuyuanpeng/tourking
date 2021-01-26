import {
  searchDriverList,
  queryDriverList,
  queryDriverEvaluatePage
} from "@/services/driver";

export default {
  namespace: "driver",

  state: {
    list: [],
    listPage: 0,
    listTotal: 0,
    search: [],
    evaluate: [],
    evaluatePage: 0,
    evaluateTotal: 0
  },

  effects: {
    *searchDriverList({payload}, {call, put}) {
      const response = yield call(searchDriverList, payload.value);
      if (response.code === "SUCCESS") {
        yield put({
          type: "search",
          payload: response.data
        });
      }
    },
    *fetchDriverList({payload}, { call, put }) {
      const response = yield call(queryDriverList);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *fetchDriverEvaluatePage({payload}, { call, put }) {
      const response = yield call(queryDriverEvaluatePage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "evaluate",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
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
    search(state, action) {
      const search = [];
      action.payload.forEach(item=>{
        search.push(item.user)
      })
      return {
        ...state,
        search
      }
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
