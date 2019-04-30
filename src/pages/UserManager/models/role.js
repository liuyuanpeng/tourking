import {queryRoles, saveRole, deleteRole} from '@/services/role'
import { stat } from 'fs';

export default {
  namespace: 'role',

  state: {
    roles: []
  },

  effects: {
    *getRoles({ payload }, { call, put }) {
      const response = yield call(queryRoles)
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'refreshList',
          payload: response.data
        })
      }
    },
    *saveRole({payload}, {call, put}) {
      const response = yield call(saveRole, payload)
      if (response.code === 'SUCCESS') {
        if (payload.id) {
          yield put({
            type: 'saveOK'
          })
        }
      } else {
        yield put({
          type: 'createOK'
        })
      }
    },
    *deleteRole({payload}, {call, put}) {
      const response = yield call(deleteRole, payload.roleId)
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'deleteOK'
        })
      }
    }
  },

  reducers: {
    refreshList(state, {payload}) {
      return {
        ...state,
        roles: payload
      }
    },
    saveOK(state, {payload}) {
      return {
        ...state
      }
    },
    createOK(state, {payload}) {
      return {
        ...state
      }
    },
    deleteOK(state, {payload}) {
      return {
        ...state
      }
    }
  },
};
