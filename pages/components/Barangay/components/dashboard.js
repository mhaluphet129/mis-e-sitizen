import React, { useState, useEffect } from "react";
import { Col, Drawer, Spin, Table, Typography, Space, Tag } from "antd";
import Cards from "../../Dashboard/components/cards";
import { FaUserCheck, FaUserTimes, FaMale, FaFemale } from "react-icons/fa";
import { TbOld } from "react-icons/tb";
import axios from "axios";
import dayjs from "dayjs";

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Cookies from "js-cookie";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ setSelectedKey }) => {
  const [drawerData, setDrawerData] = useState({ open: false, data: {} });
  const [isFetching, setFetching] = useState(false);
  const [senior, setSenior] = useState([]);

  const barangay = Cookies.get("barangay");

  let [data, setData] = useState({
    barangay: "-",
    senior: "-",
    social: "-",
    private: "-",
    male: "-",
    female: "-",
  });

  let _data = [
    {
      name: "Senior Citizens",
      value: data.senior,
      color: "green",
      icon: <TbOld />,
    },
    {
      name: "Social Pensioners",
      value: data.social,
      color: "#00dddd",
      icon: <FaUserCheck />,
    },
    {
      name: "Private Pensioners",
      value: data.private,
      color: "#8b0000",
      icon: <FaUserTimes />,
    },
    { name: "Male", value: data.male, color: "#00a2ed", icon: <FaMale /> },
    {
      name: "Female",
      value: data.female,
      color: "blueviolet",
      icon: <FaFemale />,
    },
  ];

  const onClick = (index) => {
    switch (index) {
      case 0: {
        setSelectedKey("senior");
        break;
      }
      case 1: {
        setDrawerData({
          open: true,
          data: { filter: "social", title: "Social Pensioner" },
        });
        break;
      }
      case 2: {
        setDrawerData({
          open: true,
          data: { filter: "private", title: "Private Pensioner" },
        });
        break;
      }
      case 3: {
        setDrawerData({
          open: true,
          data: { filter: "male", title: "Male Seniors" },
        });
        break;
      }
      case 4: {
        setDrawerData({
          open: true,
          data: { filter: "female", title: "Female Seniors" },
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (drawerData.open) {
      (async () => {
        setFetching(true);

        let res = await axios.get("/api/senior", {
          params: {
            mode: "dash-card",
            filter: drawerData?.data?.filter,
            barangay,
          },
        });

        if (res.data.status == 200) {
          setFetching(false);
          setSenior(res.data.data);
        }
      })();
    }
  }, [drawerData]);

  useEffect(() => {
    (async () => {
      let res = await axios.get("/api/etc", {
        params: {
          mode: "dashboard-data",
          barangay,
        },
      });

      if (res.data.status == 200) {
        let _data = res?.data?.data?.seniors;
        setData({
          barangay: 17,
          senior: _data?.length,
          social: _data?.filter((e) => e?.pensionerType == "social")?.length,
          private: _data?.filter((e) => e?.pensionerType == "private")?.length,
          male: _data?.filter((e) => e?.gender == "male")?.length,
          female: _data?.filter((e) => e?.gender == "female")?.length,
        });
      }
    })();
  }, []);

  return (
    <>
      <Col span={18}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {_data.map((e, i) => (
            <Cards
              key={e?.name + i}
              name={e?.name}
              value={e?.value}
              color={e?.color}
              icon={e?.icon}
              onClick={() => onClick(i)}
            />
          ))}
        </div>
      </Col>
      <Drawer
        open={drawerData.open}
        onClose={() => setDrawerData({ open: false, data: {} })}
        placement="bottom"
        title={drawerData.data?.title}
        height="100%"
        style={{
          width: 700,
          marginLeft: "50%",
          transform: "translateX(-50%)",
        }}
        bodyStyle={{ display: "flex" }}
      >
        {isFetching ? (
          <Spin style={{ alignSelf: "center", width: 700 }} />
        ) : (
          <Space
            direction="vertical"
            style={{ width: 700, textAlign: "center" }}
          >
            <Table
              columns={[
                {
                  title: "Name",
                  render: (_, row) => (
                    <Typography>
                      {row?.name.name}
                      {row?.name.middlename
                        ? " " + row?.name.middlename
                        : ""}{" "}
                      {row?.name.lastname}
                    </Typography>
                  ),
                },
                {
                  title: "Barangay",
                  render: (_, row) => <Typography>{row.barangay}</Typography>,
                },
                {
                  title: "Gender",
                  width: 150,
                  align: "center",
                  render: (_, row) => <Typography>{row?.gender}</Typography>,
                },
                {
                  title: "Age",
                  width: 50,
                  render: (_, row) => (
                    <Typography>
                      {dayjs().diff(
                        dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
                        "years",
                        false
                      )}
                    </Typography>
                  ),
                },
                {
                  title: "Pensioner Type",
                  width: 100,
                  align: "center",
                  render: (_, row) =>
                    row?.pensionerType == "social" ? (
                      <Tag color="green">Social</Tag>
                    ) : (
                      <Tag color="blue">Private</Tag>
                    ),
                },
              ]}
              style={{ width: "100%" }}
              dataSource={senior}
              pagination={false}
            />
            <Typography.Link
              onClick={() => {
                setDrawerData({ open: false, data: {} });
                setSelectedKey("senior");
              }}
            >
              View Senior Lists
            </Typography.Link>
          </Space>
        )}
      </Drawer>
    </>
  );
};

export default Dashboard;
