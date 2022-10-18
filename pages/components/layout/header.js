import React from "react";
import { Layout, Menu, Typography, Dropdown, Avatar } from "antd";

export default () => {
  const menu = (
    <Menu
      items={[
        {
          label: "1st menu item",
          key: "1",
        },
        {
          label: "2nd menu item",
          key: "2",
        },
        {
          label: "3rd menu item",
          key: "3",
        },
      ]}
    />
  );
  return (
    <Layout.Header
      style={{ backgroundColor: "#fff", display: "flex", alignItems: "center" }}
    >
      <Dropdown overlay={menu}>
        <Avatar size="large" style={{ marginLeft: "auto", cursor: "pointer" }}>
          L C
        </Avatar>
      </Dropdown>
    </Layout.Header>
  );
};
