import React, { useState } from "react";
import { Input, Modal, Typography, Button, Alert } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const AddAdmin = ({ open, close }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const validate = (str) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(str);
  };

  return (
    <Modal
      title={"Add Admin"}
      open={open}
      onCancel={close}
      closable={false}
      footer={null}
    >
      {error && (
        <Alert
          message={"Invalid Email"}
          type="warning"
          onClose={() => setError(false)}
          showIcon
          closable
        />
      )}

      <Typography.Title level={5} style={{ textAlign: "center" }}>
        Email
      </Typography.Title>
      <Input.Group>
        <Input
          prefix={<UserAddOutlined />}
          style={{
            width: "calc(100% - 70px)",
          }}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Button
          onClick={() => {
            if (!(email.length != 0 && validate(email))) setError(true);
            else {
              setError(false);
              alert("valid");
              setEmail("");
            }
          }}
          type="primary"
        >
          ADD
        </Button>
      </Input.Group>
    </Modal>
  );
};

export default AddAdmin;
