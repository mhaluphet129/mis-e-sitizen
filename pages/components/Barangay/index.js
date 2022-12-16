import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Card, Radio, Space, Table, Select } from "antd";
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
  const [selectedBarangay, setSelectedBarangay] = useState("barangay 1");
  const [barangayData, setbarangayData] = useState(
    Array(14)
      .fill()
      .map((e, i) => {
        return { label: `Barangay ${i + 1}`, data: 0 };
      })
  );
  const random = () =>
    "#" +
    Array(6)
      .fill(0)
      .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
      .join("");

  useEffect(() => {
    console.log(
      Array(14)
        .fill(0)
        .map(() => random())
    );
  }, []);
  return (
    <Card
      bodyStyle={{
        height: window.innerHeight * 0.84,
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
              labels: Array(14)
                .fill()
                .map((e, i) => `Brgy ${i + 1}`),
              datasets: [
                {
                  data: Array(14)
                    .fill()
                    .map(() => Math.floor(Math.random() * 99999)),
                  backgroundColor: Array(14)
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
              labels: Array(14)
                .fill()
                .map((e, i) => `Brgy ${i + 1}`),
              datasets: [
                {
                  label: "Seniors",
                  data: Array(14)
                    .fill()
                    .map(() => Math.floor(Math.random() * 99999)),
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
          title={() => (
            <Select
              showSearch
              placeholder="Select Barangay"
              optionFilterProp="children"
              onChange={(e) => setSelectedBarangay(e)}
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
              allowClear
            />
          )}
        />
      </Card>
    </Card>
  );
};

export default Barangay;
