

export default {
  namespace: 'account',

  state: {
    status: undefined,
  },

  effects: {
    *getAccounts({ payload }, { call, put }) {
      // const response = yield call(fakeRegister, payload);
      // yield put({
      //   type: 'registerHandle',
      //   payload: response,
      // });
    },
    *searchAccount({payload}, {call, put}) {

    },
    *saveAccount({payload}, {call, put}) {

    },
    *deleteAccount({payload}, {call, put}) {

    }
  },

  reducers: {
    refreshList(state, { payload }) {
      return {
        ...state
      }
    },
  },
};
