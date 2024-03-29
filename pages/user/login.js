import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
  Form,
  Input,
  Button,
  Alert,
  Modal,
  Typography,
  FloatButton,
  message,
  Tour,
} from "antd";
import axios from "axios";
import { BsInfoCircle } from "react-icons/bs";
import { ArrowRightOutlined } from "@ant-design/icons";

const Login = () => {
  const [isError, setIsError] = useState({ show: false, description: "" });
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [credits, openCredits] = useState(false);
  const [location, setLocation] = useState();
  const [password, setPassword] = useState("");
  const [openTour, setOpenTour] = useState(false);
  const newRef = useRef();

  const [form] = Form.useForm();

  const handleLogin = async (val) => {
    val = { ...val, password };
    if (!val.email || !val.password) {
      message.error("Please provide a valid email/password");
      return;
    }
    let { data } = await axios.post("/api/auth", {
      payload: {
        mode: "login",
        email: val.email,
        password: val.password,
      },
    });
    if (data.status == 404)
      setIsError({ show: true, description: "Account doesn't exist" });
    else if (data.status == 403)
      setIsError({ show: true, description: "Wrong password" });
    else if (data.status == 402) {
      setIsError({
        show: true,
        description:
          "Cannot log in. Ask admin to assign this account to any barangay",
      });
    } else if (data.status == 201) {
      message.success("Welcome New Barangay Admin");
      setOpenTour(true);
    } else if (data.status == 200) {
      Cookies.set("currentUser", JSON.stringify(data.currentUser));
      Cookies.set("loggedIn", "true");
      Cookies.set("barangay", data.currentUser?.barangay ?? false);
      message.success(data.message);
      location?.reload();
    }
  };

  const handleNewUser = async () => {
    if (email != "") {
      let { data } = await axios.get("/api/auth", { params: { email } });
      if (data.status == 200) setOpenModal(true);
      else {
        if (data.status == 404) message.error(data.message);
        else message.warning(data.message);
      }
    }
  };

  useEffect(() => {
    setLocation(window.location);
    (async (_) => {
      await _.get("/api/init");
    })(axios);
  }, []);

  return (
    <>
      {/* context */}
      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={[
          {
            title: "Welcome New Barangay Admin",
            description:
              "Since your account doesn't have a name and password yet. Please click this button to proceed.",
            target: () => newRef.current,
          },
        ]}
      />
      {/* end */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="logo-container">
          <img
            src="logo.png"
            alt="Logo 1"
            className="logo"
            style={{
              width: "100px",
              height: "100px",
              marginRight: "30px",
              marginTop: "20px",
            }} // Adjust the width and height as needed
          />
          <img
            src="logo2.png"
            alt="Logo 2"
            className="logo"
            style={{ width: "130px", height: "100px", marginRight: "30px" }} // Adjust the width and height as needed
          />
          <img
            src="logo-mswd.png"
            alt="Logo 3"
            className="logo"
            style={{ width: "100px", height: "100px", marginRight: "30px" }} // Adjust the width and height as needed
          />
        </div>

        <div className="main-login-info">
          <Typography.Title
            style={{
              marginTop: "6vh", // Reduce the marginTop value to move the text closer
              color: "#de6b0d",
              fontFamily: "sans-serif",
            }}
          >
            E-Sitizen
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{
              fontStyle: "italic",
              textAlign: "center",
              color: "#de6b0d",
            }}
          >
            e-SiTizen: A Web-Based Management Information System For The Senior
            Citizen of the Municipality of Kadingilan Bukidnon
          </Typography.Title>
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
              borderRadius: 10,
              boxShadow: "5px 5px 20px #888888",
            }}
            onFinish={handleLogin}
          >
            {isError.show && (
              <Alert
                description={isError.description}
                onClose={() => setIsError({ show: false, description: "" })}
                type="error"
                closable
              />
            )}
            <Form.Item label="EMAIL" name="email">
              <Input
                size="large"
                addonAfter={
                  <Button
                    type="link"
                    style={{ padding: 0.1 }}
                    onClick={handleNewUser}
                    ref={newRef}
                  >
                    new user
                  </Button>
                }
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="PASSWORD" name="password">
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item noStyle>
              <Button
                type="primary"
                style={{ width: "100%", height: 50 }}
                htmlType="submit"
                size="large"
                onClick={() => setIsError({ show: false, description: "" })}
              >
                Log In <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* CREDITS */}
        <Modal
          open={openModal}
          title={`Setup account for email '${email}'`}
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button key="key 1" type="primary" onClick={form.submit}>
              Register Complete
            </Button>,
          ]}
        >
          <Form
            form={form}
            onFinish={async (val) => {
              const { confirm, password } = val;
              if (confirm != password) {
                message.error("password and confirm password didn't match.");
                return;
              }

              let { data } = await axios.post("/api/auth", {
                payload: {
                  ...val,
                  email,
                  mode: "new-user",
                },
              });

              if (data.status == 200) {
                if (data.currentUser?.barangay ?? false) {
                  Cookies.set("currentUser", JSON.stringify(data.currentUser));
                  Cookies.set("loggedIn", "true");
                  Cookies.set("barangay", data.currentUser?.barangay ?? null);
                  message.success(data.message);
                  location?.reload();
                } else {
                  message.success(
                    "Registration complete. Please wait for the super admin to assign you to a barangay"
                  );

                  setOpenModal(false);
                }
              }
            }}
            labelCol={{ span: 7 }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Lastname"
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "This is required.",
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
                  message: "This is required.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm"
              rules={[
                {
                  required: true,
                  message: "This is required.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={credits}
          onCancel={() => openCredits(false)}
          footer={null}
          closable={false}
        >
          ...
        </Modal>
        <FloatButton
          icon={<BsInfoCircle />}
          onClick={() => {
            openCredits(true);
          }}
        />
      </div>
    </>
  );
};

export default Login;
