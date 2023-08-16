import React from "react";
import { Button, Modal } from "antd";

const ModalForm = (props) => {
  return (
    <Modal
      open={props.open}
      onCancel={props.close}
      width={900}
      footer={[
        <Button type="primary" onClick={props.print} key="key-1">
          Proceed and Review
        </Button>,
      ]}
    >
      {props.children}
    </Modal>
  );
};

export default ModalForm;
