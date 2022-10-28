import React, { useState, useEffect } from "react";
import { Drawer, Button, Space, Form, Input, Modal } from "antd";
import UpdatePassword from "./update_password";

const UpdateAdmin = ({ open, close, data }) => {
  const [edited, setEdited] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    lastname: "",
    email: "",
  });
  const [openModal, setOpenModal] = useState(false);

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
          <Space>
            <Button type="primary" disabled={!edited}>
              SAVE
            </Button>
            <Button>CANCEL</Button>
          </Space>,
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
