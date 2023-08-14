import React, { useEffect, useState } from "react";
import { Badge, Card, Tabs, Typography } from "antd";

import json from "../../assets/json/constant.json";
import TabView from "./components/TabView";
import axios from "axios";

const Barangay = () => {
  const [barangayWithAdmin, setBarangayWithAdmin] = useState([]);
  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/barangay", {
        params: {
          mode: "barangay-admin",
        },
      });

      setBarangayWithAdmin(data?.barangay);
    })(axios);
  }, [trigger]);

  return (
    <Card
      // bodyStyle={{
      //   display: "flex",
      //   flexDirection: "column",
      // }}
      // style={{ width: 1400 }}
      title="Barangay"
    >
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        items={json.barangay.map((e) => {
          return {
            label: (
              <Badge
                color={
                  barangayWithAdmin?.filter((_) => _.name == e)[0]?.status
                    ? "green"
                    : "red"
                }
                dot
              >
                <Typography.Text>{e}</Typography.Text>
              </Badge>
            ),
            key: e,
            children: (
              <TabView barangay={e} refresh={() => setTrigger(trigger + 1)} />
            ),
          };
        })}
      />
    </Card>
  );
};

export default Barangay;
