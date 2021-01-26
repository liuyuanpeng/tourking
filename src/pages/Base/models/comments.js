import { queryComments, saveComments } from "@/services/comments";

export default {
  namespace: "comments",

  state: {
    list: [],
    id: ""
  },

  effects: {
    *fetchComments({ payload }, { call, put }) {
      const response = yield call(queryComments);
      if (response.code === "SUCCESS") {
        if (response.data instanceof Array && response.data.length) {
          try {
            const list = response.data[0].name.split(",");
            const {id} = response.data[0];
            yield put({
              type: "save",
              payload: { list, id }
            });
          } catch (error) {
            payload.onFailure && payload.onFailure(error);
          }
        }
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveComments({ payload }, { call, put, select }) {
      const id = yield select(state => state.comments.id);
      const response = yield call(
        saveComments,
        id
          ? {
              id,
              ...payload.data
            }
          : {
              ...payload.data
            }
      );
      if (response.code === "SUCCESS") {
        try {
          const list = response.data.name.split(",");
          yield put({
            type: "save",
            payload: { list, id: response.data.id }
          });

          payload.onSuccess && payload.onSuccess();
        } catch (error) {
          payload.onFailure && payload.onFailure(error)
        }
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.list,
        id: action.payload.id
      };
    }
  }
};
