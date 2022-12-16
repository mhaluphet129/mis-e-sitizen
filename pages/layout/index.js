import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Typography, Image, Space, Tooltip } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

import { FcBullish, FcBusinessman, FcSettings } from "react-icons/fc";
import { TbOld, TbReport } from "react-icons/tb";
import { FaHouseUser } from "react-icons/fa";
import AdminPage from "../components/Admin";
import SeniorCitizenPage from "../components/SeniorCitizen";
import Dashboard from "../components/Dashboard";
import Barangay from "../components/Barangay";
import Reports from "../components/Reports";
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

  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, []);

  return (
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
            onClick={() => {}}
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
