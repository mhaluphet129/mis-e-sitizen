import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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

  const [pieData, setPieData] = useState([]);
  const [seniors, setSeniors] = useState([]);

  const [height, setHeight] = useState(0);
  let [max, setMax] = useState(10);

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

        data?.data?.pieData.forEach((e) => {
          arr[e._id.split(" ")[1] - 1] = e.count;
          setMax(Math.ceil(e.count / 10) * 10);
        });

        setPieData(arr);
        setSeniors(data.data?.seniors);
      }
    })();
  }, []);
  return (
    <Card
      bodyStyle={{
        height: height * 0.84,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Card style={{ width: "65%" }}>
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Senior Citizen Bar Chart",
              },
            },
            scales: {
              y: {
                min: 0,
                max,
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
            {
              title: "Name",
              render: (_, row) => (
                <Typography>
                  {row?.name?.name}
                  {row?.name?.middlename
                    ? " " + row?.name?.middlename
                    : ""}{" "}
                  {row?.name?.lastname}
                </Typography>
              ),
            },
            {
              title: "Gender",
              dataIndex: "gender",
            },
            {
              title: "Age",
              render: (_, row) => dayjs().diff(dayjs(row.dateOfBirth), "year"),
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
