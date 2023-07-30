import React, { useState, useEffect } from "react";
import {
  Col,
  Drawer,
  Row,
  Spin,
  Table,
  Typography,
  Space,
  List,
  Card,
  Tag,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import Cards from "./components/cards";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUserCheck, FaUserTimes, FaMale, FaFemale } from "react-icons/fa";
import { TbOld } from "react-icons/tb";
import axios from "axios";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import json from "../../assets/json/constant.json";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ setSelectedKey }) => {
  const [drawerData, setDrawerData] = useState({ open: false, data: {} });
  const [isFetching, setFetching] = useState(false);
  const [senior, setSenior] = useState([]);
  const [barData, setBarData] = useState([]);
  const [total, setTotal] = useState([]);

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
          data: { filter: "social", title: "Seniors with Pensions" },
        });
        break;
      }
      case 3: {
        setDrawerData({
          open: true,
          data: { filter: "private", title: "Seniors without Pensions" },
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
          social: _data?.filter((e) => e?.pensionerType == "social")?.length,
          private: _data?.filter((e) => e?.pensionerType == "private")?.length,
          male: _data?.filter((e) => e?.gender == "male")?.length,
          female: _data?.filter((e) => e?.gender == "female")?.length,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/barangay", {
        params: {
          mode: "dashboard-data",
          // selectedBarangay,
        },
      });

      if (data?.status == 200) {
        let arr = Array(17)
          .fill()
          .map((_, i) => {
            return { name: json.barangay[i], value: 0 };
          });

        setTotal(data.data?.pieData.reduce((p, n) => p + n.count, 0));

        data?.data?.pieData?.forEach((e) => {
          let index = arr.map((_) => _.name).indexOf(e._id);
          arr[index].value = e.count;
        });

        setBarData(arr);
      }
    })();
  }, []);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Total Seniors per Barangay">
            <List
              itemLayout="horizontal"
              dataSource={barData}
              renderItem={(item) => (
                <List.Item style={{ padding: 0 }}>
                  <List.Item.Meta title={item.name} description={item.value} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
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
          <Bar
            options={{
              responsive: true,
              animations: {
                y: {
                  easing: "easeInOutElastic",
                  from: (ctx) => {
                    if (ctx.type === "data") {
                      if (ctx.mode === "default" && !ctx.dropped) {
                        ctx.dropped = true;
                        return 0;
                      }
                    }
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Senior Citizen Chart",
                  position: "top",
                  font: {
                    size: "20px",
                    family: "Sans-Serif",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (item) => item.dataset.data[item.dataIndex] + "%",
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  stacked: true,
                  title: {
                    display: true,
                    text: "Total percentage (%)",
                  },
                  ticks: {
                    callback: (_) => _ + "%",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Barangay in Kadingilan",
                  },
                },
              },
            }}
            data={{
              labels: Array(17)
                .fill()
                .map((e, i) => json.barangay[i]),
              datasets: [
                // {
                //   label: "Seniors",
                //   data: barData.map((e) => (e.value / total) * 100),
                //   backgroundColor: "rgba(0,185,107,0.5)",
                //   borderColor: "grey",
                //   type: "line",
                // },
                {
                  label: "Seniors",
                  data: barData.map((e) => (e.value / total) * 100),
                  backgroundColor: "rgba(0,185,107,0.5)",
                  type: "bar",
                },
              ],
            }}
          />
        </Col>
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
