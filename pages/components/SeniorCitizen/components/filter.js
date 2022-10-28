import { Modal } from "antd";

const Filter = ({ open, close }) => {
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      okText="Apply Changes"
      onOk={close}
    ></Modal>
  );
};

export default Filter;
