import React, { useState } from "react";
import { Input, Modal, Typography, Button, Alert, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import axios from "axios";

const AddAdmin = ({ open, close, refresh, extra, mode = "admin" }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ show: false, description: "" });

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
      {error.show && (
        <Alert
          message={error.description}
          type="warning"
          onClose={() => setError({ show: false, description: "" })}
          showIcon
          closable
        />
      )}

      <Typography.Title level={5} style={{ textAlign: "center", marginTop: 5 }}>
        Email
      </Typography.Title>
      <Input.Group>
        <Input
          name="email"
          prefix={<UserAddOutlined />}
          style={{
            width: "calc(100% - 70px)",
          }}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Button
          onClick={async () => {
            if (!(email.length != 0 && validate(email)))
              setError({ show: true, description: "Invalid Email" });
            else {
              setError({ show: false, description: "" });

              let { data } = await axios.post("/api/admin", {
                payload: {
                  mode: "add-admin",
                  type: mode,
                  email,
                  barangay: extra?.barangay ?? null,
                },
              });
              if (data.status == 409)
                setError({
                  show: true,
                  description: data.message,
                });
              else if (data.status == 410)
                setError({ show: true, description: data.message });
              else if (data.status == 200) {
                message.success(data.message);
                if (refresh != null && typeof refresh == "function") refresh();
                close();
              }
            }
          }}
          style={{
            borderRadius: 0,
            borderTopRightRadius: 7,
            borderBottomRightRadius: 7,
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
