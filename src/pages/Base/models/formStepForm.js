import { saveChartered } from "@/services/chartered";

export default {
  namespace: "formStepForm",

  state: {
    current: 'unknown',
    step: {
    },
    mode: 'add'
  },

  effects: {
    *submitStepForm({ payload }, { call, select }) {
      const data = yield select(state => state.formStepForm.step);
      const {roads, ...private_consume} = data;
      
      const {onSuccess, onFailure} = payload;
      const response = yield call(saveChartered, {
        private_consume: {
          ...private_consume,
          common_scene: "ORDER"
        },
        roads
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
