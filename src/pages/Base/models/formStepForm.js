import { saveChartered } from "@/services/chartered";

export default {
  namespace: "formStepForm",

  state: {
    current: 'unknown',
    step: {
    },
    mode: 'add',
    type: 'chartered' // chartered: 按天包车或者线路包车, scenicfood: 景点美食, souvenir: 伴手礼
  },

  effects: {
    *submitStepForm({ payload }, { call, select }) {
      const data = yield select(state => state.formStepForm.step);
      const {roads, chexing_id, zuowei_id, ...private_consume} = data;
      
      const {onSuccess, onFailure} = payload;
      const response = yield call(saveChartered, {
        private_consume: {
          ...private_consume,
          common_scene: "ORDER"
        },
        roads,
        car_levels: chexing_id && zuowei_id ? [{chexing_id, zuowei_id}] : []
      });
      if (response.code === "SUCCESS") {
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure();
      }
    }
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },
    resetFormData(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    }
  }
};
