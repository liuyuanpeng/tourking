import {
  queryDiscoverCommentPage,
  queryDiscoverCommentValid,
  queryDiscoverPage,
  queryDiscoverValid,
  deleteDiscoverComment,
  deleteDiscovery
} from "@/services/discovery";

export default {
  namespace: "discovery",

  state: {
    discovery: [],
    discoveryPage: 0,
    discoverTotal: 0,
    comment: [],
    commentPage: 0,
    commentTotal: 0
  },

  effects: {
    *fetchDiscoveryPage({payload}, { call, put }) {
      const {onSuccess, onFailure, ...others} = payload
      const response = yield call(queryDiscoverPage, others);
      if (response.code === "SUCCESS") {
        yield put({
          type: "discovery",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *fetchDiscoveryCommentPage({payload}, { call, put }) {
      const {onSuccess, onFailure, ...others} = payload
      const response = yield call(queryDiscoverCommentPage, others);
      if (response.code === "SUCCESS") {
        yield put({
          type: "comment",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message)
      }
    },
    *validDiscovery({payload}, {call, put}) {
      const {id, valid, onSuccess, onFailure, ...others} = payload
      const response = yield call(queryDiscoverValid, {id, valid})
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'fetchDiscoveryPage',
          payload: {
            ...others
          }
        })
      }
    },
    *deleteDiscovery({payload}, {call, put}) {
      const {id, onSuccess, onFailure, ...others} = payload
      const response = yield call(deleteDiscovery, id)
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'fetchDiscoveryPage',
          payload: others
        })
        onSuccess && onSuccess()
      } else {
        onFailure && onFailure(response.message)
      }
    },
    *validDiscoveryComment({payload}, {call, put}) {
      const {id, valid, onSuccess, onFailure, ...others} = payload
      const response = yield call(queryDiscoverCommentValid, {id, valid})
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'fetchDiscoveryCommentPage',
          payload: {
            ...others
          }
        })
      }
    },
    *deleteDiscoveryComment({payload}, {call, put}) {
      const {id, onSuccess, onFailure, ...others} = payload
      const response = yield call(deleteDiscoverComment, id)
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'fetchDiscoveryCommentPage',
          payload: {
            ...others
          }
        })
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
    discovery(state, action) {
      const { data_list, page, total_pages } = action.payload;
      return {
        ...state,
        discovery: data_list || [],
        discoveryPage: page || 0,
        discoveryTotal: total_pages || 1
      };
    },
    comment(state, action) {
      const { data_list, page, total_pages } = action.payload;
      return {
        ...state,
        comment: data_list || [],
        commentPage: page || 0,
        commentTotal: total_pages || 1
      };
    }
  }
};
