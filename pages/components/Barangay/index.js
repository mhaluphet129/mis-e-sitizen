import React from "react";
import { Badge, Card, Tabs, Typography } from "antd";

import json from "../../assets/json/constant.json";
import TabView from "./components/TabView";

const Barangay = () => {
  return (
    <Card
      // bodyStyle={{
      //   display: "flex",
      //   flexDirection: "column",
      // }}
      style={{ width: 1400 }}
      title="Barangay"
    >
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        items={json.barangay.map((e) => {
          return {
            label: (
              <Badge dot={false} color="green">
                <Typography.Text>{e}</Typography.Text>
              </Badge>
            ),
            key: e,
            children: <TabView barangay={e} />,
          };
        })}
      />
    </Card>
  );
};

export default Barangay;
