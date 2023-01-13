import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Image,
  Space,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import axios from "axios";

import { FcBullish, FcBusinessman, FcSettings } from "react-icons/fc";
import { TbOld, TbReport } from "react-icons/tb";
import { FaHouseUser } from "react-icons/fa";
import AdminPage from "../components/Admin";
import SeniorCitizenPage from "../components/SeniorCitizen";
import Dashboard from "../components/Dashboard";
import Barangay from "../components/Barangay";
import Reports from "../components/Reports";
import UpdatePassword from "../components/Admin/components/update_password";
import Cookies from "js-cookie";

const Sider = ({ selectedIndex }) => {
  let [items, setItems] = useState([
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <FcBullish />,
    },
    {
      label: "Barangay",
      key: "barangay",
      icon: <FaHouseUser />,
    },
    {
      label: "User Admins",
      key: "admin",
      icon: <FcBusinessman />,
    },
    {
      label: "Senior",
      key: "senior",
      icon: <TbOld />,
    },
    {
      label: "Report",
      key: "report",
      icon: <TbReport />,
      style: {
        paddingRight: "40px",
      },
    },
    // {
    //   label: "Settings",
    //   key: "settings",
    //   icon: <FcSettings />,
    // },
  ]);

  useEffect(() => {
    let currentUser = JSON.parse(Cookies.get("currentUser"));
    if (!currentUser?.role.includes("superadmin")) {
      setItems((e) => e.filter((_) => _.key != "admin"));
    }
  }, []);

  return (
    <Layout.Sider
      style={{
        minHeight: "92vh",
      }}
    >
      <div
        style={{
          height: "25vh",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image preview={false} src="/menu-logo.png" alt="logo" width={150} />
      </div>
      <Menu
        onClick={selectedIndex}
        items={items}
        defaultSelectedKeys="dashboard"
        style={{
          minHeight: "70vh",
          fontSize: 17,
        }}
      />
    </Layout.Sider>
  );
};

const Header = () => {
  const [currentUser, setCurrentUser] = useState({ name: "", lastname: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, []);

  return (
    <>
      <UpdatePassword
        open={openChangePass}
        close={() => setOpenChangePass(false)}
        id={currentUser._id}
      />
      <Modal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        title="Edit Profile"
        footer={null}
        closable={false}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (val) => {
            let { data } = await axios.post("/api/admin", {
              payload: {
                id: currentUser._id,
                data: val,
                mode: "update-admin",
              },
            });

            if (data.status == 200) {
              message.success(data.message);
              setOpenEdit(false);
            } else message.error(data.message);
          }}
        >
          <Form.Item label="Name" name="name" initialValue={currentUser.name}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Lastname"
            name="lastname"
            initialValue={currentUser.lastname}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            initialValue={currentUser.email}
          >
            <Input />
          </Form.Item>
          <Form.Item htmlFor="submit" noStyle>
            <Button
              style={{ width: "100%", marginBottom: 10 }}
              onClick={form.submit}
            >
              Update
            </Button>
          </Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() => setOpenChangePass(true)}
          >
            Change Password
          </Button>
        </Form>
      </Modal>
      <Layout.Header
        style={{
          backgroundColor: "#aaa",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingInline: 20,
        }}
      >
        <Space>
          <Tooltip title="Profile Settings">
            <Button
              size="large"
              icon={<SettingOutlined />}
              style={{
                backgroundColor: "#aaa",
                color: "#fff",
                padding: 0,
              }}
              onClick={() => {
                setOpenEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Logout">
            <Button
              size="large"
              icon={<LogoutOutlined />}
              style={{
                backgroundColor: "#aaa",
                color: "#fff",
                padding: 0,
              }}
              onClick={() => {
                Cookies.remove("user");
                Cookies.set("loggedIn", "false");
                window.location.reload();
              }}
            />
          </Tooltip>
        </Space>
      </Layout.Header>
    </>
  );
};

const Content = ({ selectedKey }) => {
  return (
    <div
      style={{
        backgroundColor: "#eee",
        height: "100%",
        padding: "10px",
        overflow: "scroll",
      }}
    >
      {selectedKey == "dashboard" ? <Dashboard /> : null}
      {selectedKey == "admin" ? <AdminPage /> : null}
      {selectedKey == "senior" ? <SeniorCitizenPage /> : null}
      {selectedKey == "barangay" ? <Barangay /> : null}
      {selectedKey == "report" ? <Reports /> : null}
    </div>
  );
};

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#aaa",
      }}
    >
      <Typography.Title level={5} style={{ marginTop: 10 }}>
        E-Sitizen: A WEB-BASED INFORMATION AND HEALTH MONITORING SYSTEM FOR THE
        SENIOR CITIZEN
      </Typography.Title>
    </Layout.Footer>
  );
};

const _Layout = () => <></>;

export { Sider, Header, Content, Footer };
export default _Layout;
