import React, { useState, useEffect } from "react";
import { Col, Drawer, Row, Spin, Table, Typography, Tag, Space } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import Cards from "./components/cards";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUserCheck, FaUserTimes, FaMale, FaFemale } from "react-icons/fa";
import { TbOld } from "react-icons/tb";
import axios from "axios";
import dayjs from "dayjs";

const Dashboard = ({ setSelectedKey }) => {
  const [drawerData, setDrawerData] = useState({ open: false, data: {} });
  const [isFetching, setFetching] = useState(false);
  const [senior, setSenior] = useState([]);
  let [data, setData] = useState({
    barangay: "-",
    senior: "-",
    withPension: "-",
    withoutPension: "-",
    male: "-",
    female: "-",
  });
  let _data = [
    {
      name: "Barangay",
      value: data.barangay,
      color: "orange",
      icon: <BsFillHouseFill />,
    },
    {
      name: "Senior Citizens",
      value: data.senior,
      color: "green",
      icon: <TbOld />,
    },
    {
      name: "Social Pensioners",
      value: data.withPension,
      color: "#00dddd",
      icon: <FaUserCheck />,
    },
    {
      name: "Private Pensioners",
      value: data.withoutPension,
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
        setSelectedKey("barangay");
        break;
      }
      case 1: {
        setSelectedKey("senior");
        break;
      }
      case 2: {
        setDrawerData({
          open: true,
          data: { filter: "withPension", title: "Seniors with Pensions" },
        });
        break;
      }
      case 3: {
        setDrawerData({
          open: true,
          data: { filter: "withoutPension", title: "Seniors without Pensions" },
        });
        break;
      }
      case 4: {
        setDrawerData({
          open: true,
          data: { filter: "male", title: "Male Seniors" },
        });
        break;
      }
      case 5: {
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
        },
      });

      if (res.data.status == 200) {
        let _data = res?.data?.data?.seniors;
        setData({
          barangay: 17,
          senior: _data?.length,
          withPension: _data?.filter((e) => e?.pensionStatus?.withPension)
            ?.length,
          withoutPension: _data?.filter((e) => !e?.pensionStatus?.withPension)
            ?.length,
          male: _data?.filter((e) => e?.gender == "male")?.length,
          female: _data?.filter((e) => e?.gender == "female")?.length,
        });
      }
    })();
  }, []);
  return (
    <>
      <Row gutter={[16, 16]}>
        {_data.map((e, i) => (
          <Col span={12} key={e?.name + i}>
            <Cards
              key={e?.name + i}
              name={e?.name}
              value={e?.value}
              color={e?.color}
              icon={e?.icon}
              onClick={() => onClick(i)}
            />
          </Col>
        ))}
      </Row>
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
                  title: "With Pension ?",
                  width: 100,
                  align: "center",
                  render: (_, row) =>
                    row?.pensionStatus?.withPension ? (
                      <CheckOutlined style={{ color: "#42ba96" }} />
                    ) : (
                      <CloseOutlined style={{ color: "#ff0000" }} />
                    ),
                },
                {
                  title: "With SSS ?",
                  width: 100,
                  align: "center",
                  render: (_, row) =>
                    row?.withSSS ? (
                      <CheckOutlined style={{ color: "#42ba96" }} />
                    ) : (
                      <CloseOutlined style={{ color: "#ff0000" }} />
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
