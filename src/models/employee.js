import {
  queryEmployeePage,
  saveEmployee,
  deleteEmployee
} from "@/services/employee";

export default {
  namespace: "employee",

  state: {
    list: [],
    page: 0,
    total: 0
  },

  effects: {
    *fetchEmployeePage({payload}, { call, put }) {
      const response = yield call(queryEmployeePage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *saveEmployee({ payload }, { call, put }) {
      const response = yield call(saveEmployee, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchEmployeePage",
          payload: {
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess()
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteEmployee({ payload }, { call, put }) {
      const response = yield call(deleteEmployee, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchEmployeePage",
          payload: {
            page: 0,
            size: 10
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
