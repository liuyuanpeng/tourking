import {
  queryOrderPage,
  cancelOrder,
  batchSettled,
  createOrder,
  settled,
  queryRefundPage,
  getRefundConfig,
  saveRefundConfig,
  refund,
  batchShopApproval,
  shopApproval,
  shopCancel,
  updateOrder,
  querySettledPage
} from "@/services/order";

import { getPrice } from "@/services/price";

import { queryConsumeList } from "@/services/consume";

export default {
  namespace: "order",

  state: {
    list: [],
    page: 0,
    total: 0,
    config: {}
  },

  effects: {
    *fetchRefundPage({ payload }, { call, put }) {
      const response = yield call(queryRefundPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *fetchRefundConfig({ payload }, { call, put }) {
      const response = yield call(getRefundConfig, payload);
      if (response.code === "SUCCESS" && response.data) {
        yield put({
          type: "saveConfig",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveRefundConfig({ payload }, { call, put }) {
      const response = yield call(saveRefundConfig, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "saveConfig",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *refundOrder({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(refund, id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchRefundPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *fetchSettledPage({ payload }, { call, put }) {
      const response = yield call(querySettledPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *batchSettled({ payload }, { call, put }) {
      const { ids, onSuccess, onFailure, ...others } = payload;
      const response = yield call(batchSettled, ids);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchSettledPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *settleOrder({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(settled, id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchSettledPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *fetchOrderPage({ payload }, { call, put }) {
      const response = yield call(queryOrderPage, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "save",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *cancelOrder({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(cancelOrder, id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },

    *createOrder({ payload }, { call, put }) {
      const {
        searchParams,
        priceParams,
        onSuccess,
        onFailure,
        ...others
      } = payload;
      const priceChangeParam = {};
      if (priceParams) {
        // 如果距离或者车型发生修改
        const consume = yield call(queryConsumeList, { scene: others.scene });
        if (
          consume.code !== "SUCCESS" ||
          !consume.data ||
          !consume.data[0] ||
          !consume.data[0].car_levels ||
          !consume.data[0].car_levels.length
        ) {
          onFailure && onFailure("获取车型分级失败!");
          return;
        }

        const carLevel = consume.data[0].car_levels.find(
          item => item.config_id === others.car_config_id
        );
        if (!carLevel) {
          onFailure && onFailure("没有对应的车型分级!");
          return;
        }

        const { price_strategy_id } = carLevel;

        const priceRes = yield call(getPrice, {
          ...priceParams,
          price_strategy_id
        });

        if (priceRes.code !== "SUCCESS") {
          onFailure && onFailure(priceRes.msg || "获取价格失败");
          return;
        }
        priceChangeParam.price = priceRes.data;
      }
      const response = yield call(createOrder, {
        ...others,
        ...priceChangeParam
      });
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...searchParams,
            page: 0,
            size: 10
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *shopApproval({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(shopApproval, id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *batchShopApproval({ payload }, { call, put }) {
      const { ids, onSuccess, onFailure, ...others } = payload;
      const response = yield call(batchShopApproval, ids);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *shopCancel({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(shopCancel, id);
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...others
          }
        });
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *updateOrder({ payload }, { call, put }) {
      const {
        searchParams,
        priceParams,
        onSuccess,
        onFailure,
        ...others
      } = payload.data;
      const priceChangeParam = {};
      if (priceParams) {
        // 如果距离或者车型发生修改
        const consume = yield call(queryConsumeList, { scene: others.scene });
        if (
          consume.code !== "SUCCESS" ||
          !consume.data ||
          !consume.data[0] ||
          !consume.data[0].car_levels ||
          !consume.data[0].car_levels.length
        ) {
          onFailure && onFailure("获取车型分级失败!");
          return;
        }

        const carLevel = consume.data[0].car_levels.find(
          item => item.config_id === others.car_config_id
        );
        if (!carLevel) {
          onFailure && onFailure("没有对应的车型分级!");
          return;
        }

        const { price_strategy_id } = carLevel;

        const priceRes = yield call(getPrice, {
          ...priceParams,
          price_strategy_id
        });

        if (priceRes.code !== "SUCCESS") {
          onFailure && onFailure(priceRes.msg || "获取价格失败");
          return;
        }
        priceChangeParam.price = priceRes.data;
      }
      const response = yield call(updateOrder, {
        ...others,
        ...priceChangeParam
      });
      if (response.code === "SUCCESS") {
        yield put({
          type: "fetchOrderPage",
          payload: {
            ...searchParams
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
      const { data_list, page, total_pages } = action.payload;
      return {
        ...state,
        list: data_list || [],
        page: page || 0,
        total: total_pages || 1
      };
    },
    saveConfig(state, action) {
      return {
        ...state,
        config: {
          ...action.payload
        }
      };
    }
  }
};
