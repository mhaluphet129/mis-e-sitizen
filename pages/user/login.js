import React, { useState } from "react";
import Cookies from "js-cookie";
import { Form, Input, Button, Alert } from "antd";
import axios from "axios";

export default () => {
  const [isError, setIsError] = useState(false);
  const handleLogin = async (val) => {
    let { data } = axios.post("/api/auth");
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
        {isError && (
          <Alert
            message="Error Text"
            description="Error Description Error Description Error Description Error Description"
            type="error"
          />
        )}
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
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
