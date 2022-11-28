import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";

export default () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
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
