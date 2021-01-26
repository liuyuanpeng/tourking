import {
  queryAddressPage,
  saveAddress,
  deleteAddress
} from "@/services/address";

export default {
  namespace: "address",

  state: {
    list: [],
    page: 0,
    total: 1
  },

  effects: {
    *fetchAddressPage({ payload }, { call, put }) {
      const response = yield call(queryAddressPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *searchAddressPage({ payload }, { call, put }) {
      const response = yield call(queryAddressPage, {
        value: payload,
        page: 0,
        size: 10
      });
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveAddress({ payload }, { call, put }) {
      const response = yield call(saveAddress, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchAddressPage",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteAddress({ payload }, { call, put }) {
      const response = yield call(deleteAddress, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchAddressPage",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess();
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
