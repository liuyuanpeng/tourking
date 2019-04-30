import { queryUser, queryAuthority} from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

const mergeRoles = roles => {
  let arr = []
  roles && roles.forEach(role => {
    role.extend && (arr = [...arr, ...role.extend.split(',')])
  })
  return Array.from(new Set(arr))
}

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetchUser(_, {call, put}) {
      console.log('call fetchUser...')
      const response = yield call(queryUser);
      if (response.code === 'SUCCESS') {
        yield put({
          type: 'save',
          payload: {
            ...response.data.user,
            authority: mergeRoles(response.data.roles)
          }
        })
        reloadAuthorized()
      }
    }
  },

  reducers: {
    save(state, action) {
      console.log('authority: ', action.payload.authority)
      setAuthority(action.payload.authority)
      return {
        ...state,
        currentUser: action.payload,
      };
    }
  },
};
