import {
  queryOrderPage,
  queryOrderHistory,
  cancelOrder,
  cancelOrderShop,
  batchSettled,
  createOrder,
  settled,
  queryRefundPage,
  getRefundConfig,
  getRefundCharteredConfig,
  saveRefundConfig,
  saveRefundCharteredConfig,
  refund,
  batchShopApproval,
  shopApproval,
  shopCancel,
  updateOrder,
  querySettledPage,
  exportOrder,
  exportSettled,
  exportWarning,
  changeOrderStatus,
  changeExpressNumber
} from "@/services/order";

import { getPrice } from "@/services/price";

import { queryConsumeList } from "@/services/consume";

export default {
  namespace: "order",

  state: {
    list: [],
    page: 0,
    total: 0,
    config: {},
    charteredConfig: {},
    history: []
  },

  effects: {
    *changeOrderStatus({payload}, {call}) {
      const { onSuccess, onFailure, ...others } = payload;
      const response = yield call(changeOrderStatus, others)
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *changeExpressNumber({payload}, {call}) {
      const { onSuccess, onFailure, ...others } = payload;
      const response = yield call(changeExpressNumber, others)
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure(response.message);
      }
    },
    *fetchOrderHistory({ payload }, { call, put }) {
      const { orderId, onSuccess, onFailure } = payload;
      const response = yield call(queryOrderHistory, { order_id: orderId });
      if (response.code === "SUCCESS") {
        yield put({
          type: "saveHistory",
          payload: response.data
        });
        onSuccess && onSuccess(response.data);
      } else {
        onFailure && onFailure(response.message);
      }
    },
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
        payload.onSuccess && payload.onSuccess();
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *fetchRefundCharteredConfig({ payload }, { call, put }) {
      const response = yield call(getRefundCharteredConfig, payload);
      if (response.code === "SUCCESS" && response.data) {
        yield put({
          type: "saveCharteredConfig",
          payload: response.data
        });
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *saveRefundCharteredConfig({ payload }, { call, put }) {
      const response = yield call(saveRefundCharteredConfig, payload);
      if (response.code === "SUCCESS") {
        yield put({
          type: "saveCharteredConfig",
          payload: response.data
        });
        payload.onSuccess && payload.onSuccess();
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
    *fetchNewOrder({ payload }, { call }) {
      const response = yield call(queryOrderPage, { page: 0, size: 1 });
      if (response.code === "SUCCESS") {
        payload.onSuccess && payload.onSuccess(response.data.data_list);
      } else {
        payload.onFailure && payload.onFailure(response.message);
      }
    },
    *exportOrder({ payload, callback }, { call }) {
      callback(yield call(exportOrder, payload));
    },
    *exportSettled({ payload, callback }, { call }) {
      callback(yield call(exportSettled, payload));
    },
    *exportWarning({ payload, callback }, { call }) {
      callback(yield call(exportWarning, payload));
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
    *cancelOrderShop({ payload }, { call, put }) {
      const { id, onSuccess, onFailure, ...others } = payload;
      const response = yield call(cancelOrderShop, id);
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
          onFailure && onFailure("获取用车服务失败!");
          return;
        }

        const carLevel = consume.data[0].car_levels.find(
          item => item.config_id === others.car_config_id
        );
        if (!carLevel) {
          onFailure && onFailure("没有对应的用车服务!");
          return;
        }

        const { price_strategy_id } = carLevel;

        const priceRes = yield call(getPrice, {
          ...priceParams,
          start_time: others.start_time,
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
    *getPrice({ payload }, { call }) {
      const {
        onSuccess,
        onFailure,
        scene,
        chexing_id,
        city_id,
        kilo,
        time,
        start_time
      } = payload;
      const consume = yield call(queryConsumeList, { scene, city_id });
      if (
        consume.code !== "SUCCESS" ||
        !consume.data ||
        !consume.data[0] ||
        !consume.data[0].car_levels ||
        !consume.data[0].car_levels.length
      ) {
        onFailure && onFailure("获取用车服务失败!");
        return;
      }

      const carLevel = consume.data[0].car_levels.find(
        item => item.chexing.id === chexing_id
      );
      if (!carLevel) {
        onFailure && onFailure("没有对应的用车服务!");
        return;
      }
      const { price_strategy_id } = carLevel;

      const getPriceParam = {
        kilo,
        time,
        price_strategy_id
      };
      if (start_time) {
        getPriceParam.start_time = start_time;
      }

      const priceRes = yield call(getPrice, getPriceParam);

      if (priceRes.code !== "SUCCESS") {
        onFailure && onFailure(priceRes.msg || "获取价格失败");
        return;
      }
      onSuccess && onSuccess(priceRes.data);
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
          onFailure && onFailure("获取用车服务失败!");
          return;
        }

        const carLevel = consume.data[0].car_levels.find(
          item => item.config_id === others.car_config_id
        );
        if (!carLevel) {
          onFailure && onFailure("没有对应的用车服务!");
          return;
        }

        const { price_strategy_id } = carLevel;

        const priceRes = yield call(getPrice, {
          ...priceParams,
          start_time: others.start_time,
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
    },
    saveCharteredConfig(state, action) {
      return {
        ...state,
        charteredConfig: {
          ...action.payload
        }
      };
    },
    saveHistory(state, action) {
      return {
        ...state,
        history: action.payload.concat()
      };
    }
  }
};
