import React, { useEffect, useState } from "react";
import { Button, Row, Table, Typography } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import dayjs from "dayjs";

import AddAdmin from "../../Admin/components/add_admin";

ChartJS.register(ArcElement, Tooltip, Legend);

const TabView = ({ barangay }) => {
  const [seniors, setSeniors] = useState([]);
  const [openAddBarangayAdmin, setOpenBarangayAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [active, setActive] = useState(0);
  const [deceased, setDeceased] = useState(0);
  const [activeWithIllness, setActiveWithIllness] = useState(0);

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/barangay", {
        params: {
          mode: "fetch-seniors",
          barangay,
        },
      });

      if (data.status == 200) {
        setSeniors(data.data);
      }
    })(axios);

    (async (_) => {
      let { data } = await _.get("/api/barangay", {
        params: {
          mode: "fetch-seniors",
          barangay,
        },
      });

      if (data.status == 200) {
        setSeniors(data.data);
        setCurrentAdmin(data?.admin ?? null);
        console.log(data.data);
        // update piedata
        data.data.forEach((e) => {
          if (e.status == "ACTIVE") setActive(active + 1);
          else if (e.status == "DECEASED") setDeceased(deceased + 1);
          else if (e.status == "ACTIVE_WITH_ILLNESS")
            setActiveWithIllness(activeWithIllness + 1);
        });
      }
    })(axios);
  }, []);

  return (
    <>
      <AddAdmin
        open={openAddBarangayAdmin}
        close={() => setOpenBarangayAdmin(false)}
        mode="barangay-admin"
        extra={{ barangay }}
      />
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography.Title level={3}>{barangay}</Typography.Title>
        <div>
          ADMIN:{" "}
          {currentAdmin != null ? (
            currentAdmin.name != null ? (
              currentAdmin.name + " " + currentAdmin.lastname
            ) : (
              <Typography.Text type="secondary">Not Set</Typography.Text>
            )
          ) : (
            <Button onClick={() => setOpenBarangayAdmin(true)}>
              ADD ADMIN
            </Button>
          )}
        </div>
      </Row>
      <Row>
        <Table
          style={{
            width: 700,
          }}
          title={() => (
            <strong>{`List of Seniors in Barangay ${barangay}`}</strong>
          )}
          columns={[
            {
              title: "Name",
              render: (_, row) => row?.name.name + " " + row?.name.lastname,
            },
            {
              title: "Gender",
              align: "center",
              dataIndex: "gender",
            },
            {
              title: "Age",
              align: "center",
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
          ]}
          dataSource={seniors}
          pagination={false}
          rowKey={(e) => e._id}
        />
        <div
          style={{
            width: 400,
          }}
        >
          {![active, deceased, activeWithIllness].every((e) => e == 0) ? (
            <Pie
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    align: "center",
                  },
                  title: {
                    display: true,
                    text: `Status of Barangay ${barangay} Seniors Pie Chart`,
                  },
                },
              }}
              data={{
                labels: ["ACTIVE", "DECEASED", "ACTIVE WITH DESEASE"],
                datasets: [
                  {
                    label: "count: ",
                    data: [active, deceased, activeWithIllness],
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          ) : (
            <div
              style={{
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography.Text type="secondary" italic>
                No data
              </Typography.Text>
            </div>
          )}
        </div>
      </Row>
    </>
  );
};

export default TabView;
