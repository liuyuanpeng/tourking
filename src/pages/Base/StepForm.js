import React, { PureComponent, Fragment } from "react";
import { Card, Steps } from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import { router } from "umi";
import styles from "./style.less";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const { Step } = Steps;

@connect(({ formStepForm }) => ({
  current: formStepForm.current,
  mode: formStepForm.mode,
  type: formStepForm.type
}))
class StepForm extends PureComponent {
  getCurrentStep() {
    const { current } = this.props;
    switch (current) {
      case "basic_info":
        return 0;
      case "travel_route":
        return 1;
      case "others":
        return 2;
      default: {
        router.push("charteredmanager");
        return 0;
      }
    }
  }

  render() {
    const currentStep = this.getCurrentStep();
    const { mode, type } = this.props;
    const readonly = mode === "readonly";
    const editable = mode === "edit";
    const isChartered = type === "chartered";
    let stepComponent;
    if (currentStep === 1) {
      stepComponent = <Step2 />;
    } else if (currentStep === 2) {
      stepComponent = <Step3 />;
    } else {
      stepComponent = <Step1 />;
    }
    return (
      <PageHeaderWrapper
        title={readonly ? "线路详情" : editable ? "编辑线路" : "新增线路"}
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="基础信息" />
              {isChartered && <Step title="行程线路" />}
              {isChartered && <Step title="其他" />}
            </Steps>
            {stepComponent}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StepForm;
