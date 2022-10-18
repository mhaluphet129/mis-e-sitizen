import React, { useState } from "react";
import { Layout } from "antd";
import Sider from "../components/layout/sider";
import Header from "../components/layout/header";
import Content from "../components/layout/content";
const { Footer } = Layout;

export default () => {
  const [selectedKey, setSelectedKey] = useState(1);
  return (
    <>
      <Layout>
        <Sider selectedIndex={(e) => setSelectedKey(e.key)} />
        <Layout>
          <Header />
          <Content selectedKey={selectedKey} />
        </Layout>
      </Layout>
      <Footer>Footer</Footer>
    </>
  );
};
