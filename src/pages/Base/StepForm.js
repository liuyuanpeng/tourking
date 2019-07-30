import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'base_info':
        return 0;
      case 'travel_route':
        return 1;
      case 'others':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper
        title="新增线路"
        tabActiveKey={location.pathname}
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="基础信息" />
              <Step title="行程线路" />
              <Step title="其他" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
