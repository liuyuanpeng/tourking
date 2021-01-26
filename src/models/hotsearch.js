import {
  queryHotSearchPage,
  saveHotSearch,
  deleteHotSearch
} from "@/services/hot_search";

export default {
  namespace: "hotsearch",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchHotSearchPage({payload}, { call, put }) {
      const {page, size, city_id} = payload
      const params = {
        city_id,
        page_request_data: {
          page,
          size,
          sort_data_list:[]
        }
      }
      const response = yield call(queryHotSearchPage, params);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *saveHotSearch({ payload }, { call, put }) {
      const response = yield call(saveHotSearch, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchHotSearchPage",
          payload: {
            page: 0,
            size: 10,
            city_id: payload.city_id
          }
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteHotSearch({ payload }, { call, put }) {
      const response = yield call(deleteHotSearch, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchHotSearchPage",
          payload: {
            page: 0,
            size: 10,
            city_id: payload.city_id
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
