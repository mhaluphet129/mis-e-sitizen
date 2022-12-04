import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Layout,
  Avatar,
  Menu,
  Modal,
  Button,
  Typography,
  Image,
} from "antd";
import {
  UserOutlined,
  SettingFilled,
  LogoutOutlined,
  CopyFilled,
} from "@ant-design/icons";

import { FcBullish, FcBusinessman } from "react-icons/fc";
import { TbOld } from "react-icons/tb";
import AdminPage from "../components/Admin";
import SeniorCitizenPage from "../components/SeniorCitizen";
import Dashboard from "../components/Dashboard";
import Cookies from "js-cookie";

const Sider = ({ selectedIndex }) => {
  let [items, setItems] = useState([
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <FcBullish />,
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
      icon: <CopyFilled />,
      style: {
        paddingRight: "40px",
      },
    },
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
        }}
      />
    </Layout.Sider>
  );
};

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  const [currentUser, setCurrentUser] = useState({ name: "", lastname: "" });

  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, [Cookies.get("currentUser")]);

  return (
    <Layout.Header
      style={{
        backgroundColor: "#aaa",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Dropdown
        placement="bottom"
        menu={{
          items: [
            {
              key: 1,
              label: "Settings",
              icon: <SettingFilled />,
              onClick: () => {},
            },
            {
              key: 2,
              label: "Log Out",
              icon: <LogoutOutlined />,
              onClick: () => {
                Cookies.remove("user");
                Cookies.set("loggedIn", "false");
                window.location.reload();
              },
            },
          ],
        }}
      >
        <Avatar size="large" style={{ marginLeft: "auto", cursor: "pointer" }}>
          {currentUser.name[0]?.toUpperCase()}{" "}
          {currentUser.lastname[0]?.toUpperCase()}
        </Avatar>
      </Dropdown>

      {/* <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        closable={false}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UserOutlined style={{ width: "40vw", fontSize: "10rem" }} />
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          {currentUser.name} {currentUser.lastname}
        </Typography.Title>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button icon={<SettingFilled />} style={{ marginRight: "5px" }}>
            Settings
          </Button>
          <Button
            icon={<LogoutOutlined />}
            style={{ marginLeft: "5px" }}
            type="primary"
            onClick={() => {
              Cookies.remove("user");
              Cookies.set("loggedIn", "false");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>
      </Modal> */}
    </Layout.Header>
  );
};

const Content = ({ selectedKey }) => {
  return (
    <div style={{ backgroundColor: "#eee", height: "100%", padding: "10px" }}>
      {selectedKey == "dashboard" ? <Dashboard /> : null}
      {selectedKey == "admin" ? <AdminPage /> : null}
      {selectedKey == "senior" ? <SeniorCitizenPage /> : null}
    </div>
  );
};

const Footer = () => {
  return (
    <div
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
    </div>
  );
};

export { Sider, Header, Content, Footer };
