import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { accountLogin, getFakeCaptcha } from "@/services/api";
import { getPageQuery } from "@/utils/utils";
import { reloadAuthorized } from "@/utils/Authorized";
import { setAuthority } from "@/utils/authority";

const mergeRoles = roles => {
  let arr = [];
  roles &&
    roles.forEach(role => {
      role.extend && (arr = [...arr, ...role.extend.split(",")]);
    });
  return Array.from(new Set(arr));
};

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // Login successfully
      if (response.code === "SUCCESS") {
        yield put({
          type: "changeLoginStatus",
          payload: {
            status: "ok"
          }
        });

        localStorage.setItem("token", response.data.token_session.token);
        localStorage.setItem("user-id", response.data.user.id);
        setAuthority(mergeRoles(response.data.roles));
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || "/"));
      } else {
        yield put({
          type: "changeLoginStatus",
          payload: {
            status: "error",
            message: response.message,
            currentAuthority: "guest"
          }
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          status: false,
          currentAuthority: "guest"
        }
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user-id");
      localStorage.removeItem("authority");
      localStorage.removeItem("shop-name");
      localStorage.removeItem("shop-id");
      if (window.GLOBAL_INTERVAL) {
        clearInterval(window.GLOBAL_INTERVAL);
        window.GLOBAL_INTERVAL = null;
      }
      // redirect
      if (window.location.pathname !== "/user/login") {
        yield put(
          routerRedux.replace({
            pathname: "/user/login",
            search: stringify({
              redirect: window.location.href
            })
          })
        );
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        message: payload.message || "",
        status: payload.status
      };
    }
  }
};
