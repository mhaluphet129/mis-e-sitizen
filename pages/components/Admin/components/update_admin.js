import React, { useState, useEffect } from "react";
import { Drawer, Button, Form, Input, message } from "antd";
import axios from "axios";
import UpdatePassword from "./update_password";

const UpdateAdmin = ({ open, close, data, refresh }) => {
  const [edited, setEdited] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    lastname: "",
    email: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const handleSave = async () => {
    let res = await axios.post("/api/admin", {
      payload: {
        id: data._id,
        data: inputData,
        mode: "update-admin",
      },
    });

    if (res.data.status == 200) {
      message.success(res.data.message);
      setEdited(false);
      refresh();
    } else message.error(res.data.message);
  };

  useEffect(() => {
    setInputData(data);
  }, [data]);

  return (
    <>
      <UpdatePassword open={openModal} close={() => setOpenModal(false)} />
      <Drawer
        open={open}
        onClose={close}
        width={350}
        title="Update Admin"
        extra={[
          <Button type="primary" disabled={!edited} onClick={handleSave}>
            SAVE
          </Button>,
        ]}
        closable={false}
      >
        <Form layout="vertical" onChange={() => setEdited(true)}>
          <Form.Item label="Name">
            <Input
              value={inputData?.name || ""}
              onChange={(e) =>
                setInputData((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </Form.Item>
          <Form.Item label="Lastname">
            <Input
              value={inputData?.lastname || ""}
              onChange={(e) =>
                setInputData((prev) => {
                  return { ...prev, lastname: e.target.value };
                })
              }
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={inputData?.email || ""}
              onChange={(e) =>
                setInputData((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              onClick={() => setOpenModal(true)}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateAdmin;
