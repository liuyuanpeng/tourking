import { queryBillPage, setExpressNum } from '@/services/bill';

export default {
  namespace: "bill",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchBillPage({payload, success, fail}, {call, put}) {
      const response = yield call(queryBillPage, payload);
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'save',
          payload: response.data
        })
        success && success(response.data)
      } else {
        fail && fail(response.message)
      }
    },
    *setExpressNumber({payload, success, fail}, {call, put}) {
      const {bill_id, express_number, ...others} = payload
      const res = yield call(setExpressNum, {bill_id, express_number})
      if (res.code === 'SUCCESS') {
        yield put({
          type: "fetchBillPage",
          payload: {
            ...others
          }
        });
        success && success()
      } else {
        fail && fail(res.message)
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
