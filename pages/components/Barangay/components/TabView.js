import React, { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

import ChangeStatus from "./ChangeStatus";
import NewAdminBarangay from "./NewAdminBarangay";

ChartJS.register(ArcElement, Tooltip, Legend);

const TabView = ({ barangay, refresh, hideExtra }) => {
  const [seniors, setSeniors] = useState([]);
  const [openAddBarangayAdmin, setOpenBarangayAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [active, setActive] = useState(0);
  const [deceased, setDeceased] = useState(0);
  const [activeWithIllness, setActiveWithIllness] = useState(0);
  const [statusChange, setStatusChange] = useState({
    open: false,
    value: null,
  });
  const [trigger, setTrigger] = useState(0);

  const handleRemoveAdmin = () => {
    (async (_) => {
      let { data } = await axios.get("/api/barangay", {
        params: {
          mode: "remove-admin",
          id: currentAdmin?._id ?? "",
        },
      });

      if (data.status == 200) {
        message.success(data.message);
        setCurrentAdmin(null);
        refresh();
      } else message.error(data.message);
    })(axios);
  };

  useEffect(() => {
    let _active = 0;
    let _deceased = 0;
    let _activeWithIllness = 0;

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

        data.data.forEach((e) => {
          if (e.status == "ACTIVE") _active++;
          else if (e.status == "DECEASED") _deceased++;
          else if (e.status == "ACTIVE_WITH_ILLNESS") _activeWithIllness++;
        });

        setActive(_active);
        setDeceased(_deceased);
        setActiveWithIllness(_activeWithIllness);
      }
    })(axios);
  }, [trigger]);

  return (
    <>
      <NewAdminBarangay
        open={openAddBarangayAdmin}
        close={() => setOpenBarangayAdmin(false)}
        refresh={() => {
          setTrigger(trigger + 1);
          refresh();
        }}
        barangay={barangay}
      />
      <ChangeStatus
        open={statusChange.open}
        close={() => setStatusChange({ open: false, value: null })}
        value={statusChange.value}
        refresh={() => {
          setActive(0);
          setDeceased(0);
          setActiveWithIllness(0);
          setTrigger(trigger + 1);
        }}
      />
      {!hideExtra && (
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title level={3}>{barangay}</Typography.Title>
          <div>
            {currentAdmin != null ? (
              currentAdmin.name != null ? (
                <Space>
                  {currentAdmin.name + " " + currentAdmin.lastname}
                  <Popconfirm
                    title="Are you sure?"
                    okText="Confirm"
                    onConfirm={handleRemoveAdmin}
                  >
                    <DeleteOutlined
                      style={{
                        fontSize: 20,
                        color: "rgba(255,0,0,0.5)",
                      }}
                    />
                  </Popconfirm>
                </Space>
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
      )}
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
              title: "Birthday",
              render: (_, row) =>
                dayjs(row?.dateOfBirth).format("MMMM DD, YYYY"),
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
            {
              title: "Status",
              align: "center",
              render: (_, row) => (
                <Tag
                  color={
                    row?.status == "ACTIVE"
                      ? "green"
                      : row?.status == "DECEASED"
                      ? "red"
                      : "yellow"
                  }
                >
                  {row?.status}
                </Tag>
              ),
            },
            {
              align: "center",
              render: (_, row) => (
                <Button
                  onClick={() => setStatusChange({ open: true, value: row })}
                >
                  UPDATE
                </Button>
              ),
            },
          ]}
          dataSource={seniors}
          pagination={false}
          rowKey={(e) => e._id}
        />
        <div
          style={{
            width: 300,
            marginLeft: 20,
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
                labels: ["ACTIVE", "DECEASED", "ACTIVE WITH DISEASE"],
                datasets: [
                  {
                    label: "count: ",
                    data: [active, deceased, activeWithIllness],
                    backgroundColor: [
                      "rgba(0,255,0,0.2)",
                      "rgba(255, 0, 0, 0.2)",
                      "rgba(200, 200, 0, 0.2)",
                    ],
                    borderColor: [
                      "rgb(0,255,0)",
                      "rgba(255, 0, 0)",
                      "rgba(200, 200, 0)",
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
