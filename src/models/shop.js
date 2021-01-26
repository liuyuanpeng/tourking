import {
  searchShopList
} from "@/services/shop";

export default {
  namespace: "shop",

  state: {
    search: []
  },

  effects: {
    *searchShopList({payload}, {call, put}) {
      const response = yield call(searchShopList, payload.value);
      if (response.code === "SUCCESS") {
        yield put({
          type: "search",
          payload: response.data
        });
      }
    }
  },

  reducers: {
    search(state, action) {
      return {
        ...state,
        search: action.payload
      }
    }
  }
};
