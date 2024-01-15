import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Image,
  Space,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
  Affix,
  Tag,
  Avatar,
} from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

// ICONS
import { FcBullish } from "react-icons/fc";
import { TbOld, TbReport } from "react-icons/tb";
import { FaHouseUser } from "react-icons/fa";

import SeniorCitizenPage from "../components/SeniorCitizen";
import Dashboard from "../components/Barangay/components/dashboard";
import UpdatePassword from "../components/Admin/components/update_password";
import Reports from "../components/Barangay/components/Report";
import TabView from "../components/Barangay/components/TabView";
import Cookies from "js-cookie";
import { PageHeader } from "@ant-design/pro-layout";
import json from "../assets/json/constant.json";
import NotificationHeader from "../components/NotificationHeader";

const barangay = Cookies.get("barangay");

const Sider = ({ selectedIndex, selectedKey }) => {
  let [items, setItems] = useState([
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <FcBullish />,
    },

    {
      label: "Senior",
      key: "senior",
      icon: <TbOld />,
    },
    {
      label: "Barangay",
      key: "barangay",
      icon: <FaHouseUser />,
    },
    {
      label: "Report",
      key: "report",
      icon: <TbReport />,
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
    <Affix>
      <Layout.Sider collapsible theme="light">
        <div
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Image preview={false} src="/logo2.png" alt="logo" width={150} />
        </div>
        <Menu
          onClick={selectedIndex}
          selectedKeys={selectedKey}
          items={items}
          defaultSelectedKeys="dashboard"
          style={{
            height: "100vh",
            fontSize: 17,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        />
      </Layout.Sider>
    </Affix>
  );
};

const Header = () => {
  const [currentUser, setCurrentUser] = useState({ name: "", lastname: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [form] = Form.useForm();
  const [location, setLocation] = useState();
  const [color, setColor] = useState(null);
  const [notification, setNotification] = useState([]);
  const [annoucement, setAnnouncement] = useState([]);

  useEffect(() => {
    setLocation(window.location);
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
    setColor(json["barangay-color-theme"][barangay]);
  }, []);

  useEffect(() => {
    (async (_) => {
      let res = await _.get("/api/notification", {
        params: {
          id: currentUser?._id,
        },
      });
      if (res.data?.success) {
        setNotification(res.data.notification);
        setAnnouncement(res.data.announcement);
      } else {
        message.error(res.data?.message ?? "Error in the server");
      }
    })(axios);
  }, [currentUser]);

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
      <Affix>
        <Layout.Header
          style={{
            backgroundColor: "#aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 20,
          }}
        >
          <Tag color={color} className="barangay-label">
            {barangay}
          </Tag>
          <Space>
            <NotificationHeader
              announcement={annoucement}
              notif={notification}
              setNotification={setNotification}
              setAnnouncement={setAnnouncement}
              id={currentUser?._id}
            />
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Edit Profile",
                    key: "edit",
                    onClick: () => setOpenEdit(true),
                  },
                  {
                    type: "divider",
                  },
                  {
                    label: (
                      <div style={{ color: "#ff0000" }}>
                        logout <LogoutOutlined />
                      </div>
                    ),
                    key: "logout",
                    onClick: () => {
                      Cookies.remove("currentUser");
                      Cookies.remove("loggedIn");
                      Cookies.remove("mode");
                      window.location.reload();
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              {currentUser?.profilePhoto != null ? (
                <Image
                  src={JSON.parse(user)?.profilePhoto}
                  width={40}
                  style={{ borderRadius: "100%", backgroundColor: "#fff" }}
                  preview={false}
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  size={40}
                  style={{ cursor: "pointer" }}
                />
              )}
            </Dropdown>
          </Space>
        </Layout.Header>
      </Affix>
    </>
  );
};

const Content = ({ selectedKey, setSelectedKey }) => {
  return (
    <div
      style={{
        backgroundColor: "#eee",
        height: "100%",
        padding: "10px",
        overflow: "scroll",
      }}
    >
      <PageHeader>
        {selectedKey == "dashboard" ? (
          <Dashboard setSelectedKey={setSelectedKey} />
        ) : null}
        {selectedKey == "senior" ? <SeniorCitizenPage /> : null}
        {selectedKey == "barangay" ? (
          <TabView barangay={barangay} hideExtra={true} refresh={() => {}} />
        ) : null}
        {selectedKey == "report" ? <Reports /> : null}
      </PageHeader>
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
