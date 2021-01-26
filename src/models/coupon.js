import {
  saveCoupon,
  queryCouponList
} from "@/services/coupon";

export default {
  namespace: "coupon",

  state: {
    list: []
  },

  effects: {
    *saveCoupon({payload}, {call, put}) {
      const {data, onSuccess, onFailure, ...others} = payload
      const response = yield call(saveCoupon, data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchCouponList",
          payload: {...others}
        });
      }
    },
    *fetchCouponList({payload}, { call, put }) {
      const response = yield call(queryCouponList);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
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
    }
  }
};
