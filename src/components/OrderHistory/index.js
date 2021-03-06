import React from "react";
import { Steps, Icon, Modal } from "antd";
import ORDER_STATUS from '@/pages/Order/orderStatus'
import SOUVENIR_STATUS from '@/pages/Order/souvenirStatus'
import moment from 'moment'

const { Step } = Steps;
export default function OrderHistory({
  data,
  handleModalVisible,
  modalVisible,
  isSouvenir
}) {
  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title="历史记录"
      visible={modalVisible}
      onOk={() => {
        handleModalVisible(false);
      }}
      onCancel={() => {
        handleModalVisible(false);
      }}
    >
      <Steps direction="vertical" size="small">
        {data &&
          data.map(item => {
            const TARGET_STATUS = isSouvenir ? SOUVENIR_STATUS : ORDER_STATUS;
            const {desc} = TARGET_STATUS.find(orderStatus=>orderStatus.name === item.order_status)

            return (
              <Step
                key={item.id}
                status="process"
                icon={<Icon type="info-circle" />}
                title={item.create_time ? moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'): ''}
                description={`${desc} - ${item.description}`}
              />
            );
          })}
      </Steps>
    </Modal>
  );
}
