import { queryWeixinAccessToken, queryQRCode } from "@/services/weixin";
import { queryShopList } from "@/services/shop";

export default {
  namespace: "weixin",

  state: {
    qrCode: null
  },

  effects: {
    *fetchQRCode({ payload }, { call, put }) {
      yield put({
        type: "save",
        payload: null
      });
      payload.onLoad && payload.onLoad("正在获取微信凭证...");
      const shopRes = yield call(queryShopList, payload.user_id);
      if (
        shopRes.code !== "SUCCESS" ||
        !shopRes.data ||
        shopRes.data.length === 0
      ) {
        payload.onFailure && payload.onFailure(shopRes.message);
        return;
      }
      const shopId = shopRes.data[0].id;
      payload.onLoad && payload.onLoad("正在获取商家二维码...");
      const response = yield call(queryWeixinAccessToken);
      if (response.errcode) {
        payload.onFailure && payload.onFailure(response.errmsg);
        return;
      }
      const res = yield call(queryQRCode, {
        shopId,
        access_token: response.access_token
      });
      if (res.errcode) {
        payload.onFailure && payload.onFailure(res.errmsg);
        return;
      }

      payload.onSuccess && payload.onSuccess(res);
      yield put({
        type: "save",
        payload: res
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        qrCode: action.payload
          ? window.URL.createObjectURL(action.payload)
          : null
      };
    }
  }
};