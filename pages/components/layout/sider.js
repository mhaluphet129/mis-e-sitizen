import React from "react";
import { Menu, Layout } from "antd";

export default ({ selectedIndex }) => {
  let items = [
    {
      label: "Menu 1",
      key: "1",
    },
    {
      label: "Menu 2",
      key: "2",
    },
    {
      label: "Menu 3",
      key: "3",
    },
    {
      label: "Menu 4",
      key: "4",
    },
    {
      label: "Menu 5",
      key: "5",
    },
    {
      label: "Menu 6",
      key: "6",
    },
  ];
  return (
    <Layout.Sider
      theme="light"
      style={{
        marginTop: 65,
        minHeight: "83vh",
      }}
    >
      <Menu onClick={selectedIndex} items={items} defaultSelectedKeys="1" />
    </Layout.Sider>
  );
};
