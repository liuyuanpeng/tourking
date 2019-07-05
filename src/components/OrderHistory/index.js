import React from "react";
import { Steps, Icon, Modal } from "antd";

const { Step } = Steps;
export default function OrderHistory({
  data,
  handleModalVisible,
  modalVisible
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
            return (
              <Step
                key={item.id}
                status="process"
                icon={<Icon type="info-circle" />}
                title={item.title}
                description={item.desc}
              />
            );
          })}
      </Steps>
    </Modal>
  );
}
