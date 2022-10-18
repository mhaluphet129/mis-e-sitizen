import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Form, Tabs, Input, Button, Modal, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons/lib/icons";

export default () => {
  const handleLogin = (val) => {
    console.log(val);
  };

  return (
    <div className="main-body-login">
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        labelAlign="right"
        style={{
          width: 400,
          padding: 30,
          background: "#fff",
        }}
        onFinish={handleLogin}
      >
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{ width: "100%" }} htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
