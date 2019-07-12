import {
  queryShopAddr,
  saveShopAddr,
  deleteShopAddr
} from "@/services/shopAddr";

export default {
  namespace: "shopAddress",

  state: {
    list: []
  },

  effects: {
    *fetchShopAddressList({ payload }, { call, put }) {
      const response = yield call(queryShopAddr, payload.shopId);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveShopAddress({ payload }, { call, put }) {
      const response = yield call(saveShopAddr, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchShopAddressList",
          payload: {
            shopId: payload.shopId
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *deleteShopAddress({ payload }, { call, put }) {
      const response = yield call(deleteShopAddr, payload.data);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchShopAddressList",
          payload: {
            shopId: payload.shopId
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    }
  },

  reducers: {
    save(state, action) {
      if (action.payload instanceof Array) {
        const result = [];
        for (let i = 0; i < action.payload.length; i += 1) {
          const item = action.payload[i];
          const { name, ...others } = item;
          let data = { ...others };
          try {
            data = {
              ...others,
              ...JSON.parse(name)
            };
          } catch (error) {
            return state;
          }
          result.push(data);
        }
        return {
          ...state,
          list: result
        };
      }
      return state;
    }
  }
};
