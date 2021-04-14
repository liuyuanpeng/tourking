import { queryVisitUsersPage } from "@/services/visitusers";

export default {
  namespace: "visitusers",

  state: {
    
    list: [],
    page: 0,
    total: 0,
  },

  effects: {
    *fetchVisitUsers({ payload }, { call, put }) {
      const {source_shop_id, page, size} = payload
      const response = yield call(queryVisitUsersPage, {source_shop_id, page, size});
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
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
