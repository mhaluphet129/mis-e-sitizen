import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Card, Radio, Space, Table, Select, Typography, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
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
import dayjs from "dayjs";
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Barangay = () => {
  const [selectedGraph, setSelectedGraph] = useState("pie");
  const [selectedBarangay, setSelectedBarangay] = useState("Barangay 1");
  const [barangayData, setbarangayData] = useState(
    Array(17)
      .fill()
      .map((e, i) => {
        return { label: `Barangay ${i + 1}`, value: 0 };
      })
  );
  const [pieData, setPieData] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const random = () =>
    "#" +
    Array(6)
      .fill(0)
      .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
      .join("");
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
    (async () => {
      let { data } = await axios.get("/api/barangay", {
        params: {
          mode: "dashboard-data",
          selectedBarangay,
        },
      });

      if (data?.status == 200) {
        let arr = Array(17)
          .fill()
          .map(() => 0);
        let arr2 = barangayData;

        data?.data?.pieData.forEach((e) => {
          arr[e._id.split(" ")[1] - 1] = e.count;
          arr2[e._id.split(" ")[1] - 1] = {
            label: `Barangay ${e._id.split(" ")[1] - 1}`,
            value: (e.count / data?.data.totalSenior) * 100,
          };
        });

        setPieData(arr);
        setbarangayData(arr2);
        setSeniors(data.data?.seniors);
      }
    })();
  }, []);
  return (
    <Card
      bodyStyle={{
        height: height * 0.84,
        overflowY: "scroll",
        display: selectedGraph != "bar" ? "flex" : null,
        flexDirection: selectedGraph != "bar" ? "row" : null,
      }}
    >
      <Card style={{ width: selectedGraph == "bar" ? "100%" : 400 }}>
        <Space>
          <Radio.Group
            defaultValue={selectedGraph}
            value={selectedGraph}
            buttonStyle="solid"
            onChange={(e) => setSelectedGraph(e.target.value)}
          >
            <Radio.Button value="pie">Pie</Radio.Button>
            <Radio.Button value="bar">Bar</Radio.Button>
            <Radio.Button value="table">Table</Radio.Button>
          </Radio.Group>
        </Space>
        {selectedGraph == "pie" && (
          <Pie
            style={{ marginTop: 10 }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `A Total of 100`,
                  position: "top",
                },
                legend: {
                  display: false,
                },
              },
            }}
            data={{
              labels: Array(17)
                .fill()
                .map((e, i) => `Brgy ${i + 1}`),
              datasets: [
                {
                  data: pieData,
                  backgroundColor: Array(17)
                    .fill(0)
                    .map(() => random()),
                },
              ],
            }}
          />
        )}
        {selectedGraph == "bar" && (
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Chart.js Bar Chart",
                },
              },
            }}
            data={{
              labels: Array(17)
                .fill()
                .map((e, i) => `Brgy ${i + 1}`),
              datasets: [
                {
                  label: "Seniors",
                  data: pieData,
                  backgroundColor: "rgba(0,185,107,0.5)",
                },
              ],
            }}
          />
        )}
        {selectedGraph == "table" && (
          <Table
            bordered
            locale={{ emptyText: "No Seniors Registered yet" }}
            dataSource={barangayData}
            pagination={false}
            scroll={{ y: 450 }}
            style={{ marginTop: 5 }}
            footer={() => (
              <div>
                Total:{" "}
                <span style={{ float: "right" }}>{(100).toFixed(2)}%</span>
              </div>
            )}
            columns={[
              {
                title: "Barangay",
                render: (_, row) => row?.label,
              },
              {
                title: "Percentage/Total",
                render: (_, row) => row?.value?.toFixed(2) + "%",
              },
            ]}
          />
        )}
      </Card>
      <Card
        style={{
          width: 700,
          marginLeft: selectedGraph != "bar" ? 5 : 0,
          marginTop: selectedGraph == "bar" ? 5 : 0,
        }}
      >
        <Table
          dataSource={seniors}
          columns={[
            { title: "Senior ID", render: (_, row) => row?.name?.id },
            {
              title: "Name",
              render: (_, row) => (
                <Typography>
                  {row?.name.name}
                  {row?.name.middlename ? " " + row?.name.middlename : ""}{" "}
                  {row?.name.lastname}
                </Typography>
              ),
            },
            {
              title: "Gender",
              render: (_, row) => (
                <Typography>
                  {" "}
                  {dayjs().diff(
                    dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
                    "years",
                    false
                  )}
                </Typography>
              ),
            },
            {
              title: "Age",
              render: (_, row) => row?.age,
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
              title: "Status",
              width: 150,
              align: "center",
              render: (_, row) => <Tag>{row.status}</Tag>,
            },
          ]}
          title={() => (
            <Select
              showSearch
              placeholder="Select Barangay"
              optionFilterProp="children"
              onChange={(e) => {
                setSelectedBarangay(e);

                (async () => {
                  let { data } = await axios.get("/api/barangay", {
                    params: {
                      mode: "fetch-seniors",
                      barangay: e,
                    },
                  });

                  if (data.status == 200) setSeniors(data?.data);
                })();
              }}
              value={selectedBarangay}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={Array(17)
                .fill({})
                .map((_, i) => {
                  return {
                    label: `Barangay ${i + 1}`,
                    value: `Barangay ${i + 1}`,
                  };
                })}
            />
          )}
        />
      </Card>
    </Card>
  );
};

export default Barangay;
