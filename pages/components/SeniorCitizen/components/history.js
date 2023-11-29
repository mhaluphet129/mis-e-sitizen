import React, { useEffect, useState } from "react";
import {
  Drawer,
  Space,
  Table,
  Segmented,
  Typography,
  message,
  Timeline,
  Tag,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

import Profile from "./profile";

const History = ({ open, close, id, refresh }) => {
  let [history, setHistory] = useState([]);
  let [user, setUser] = useState({});
  let [mode, setMode] = useState("Personal Info");

  const semesterLabel = (_) => {
    if (_?.length > 1) {
      return (
        <Space>
          <Tag>First Semester</Tag>
          <Tag>Second Semester</Tag>
        </Space>
      );
    } else if ([null, undefined, ""].includes(_) || _?.length == 0) {
      return (
        <Typography.Text type="secondary" italic>
          No data
        </Typography.Text>
      );
    } else
      return (
        <Tag>{_[0] == "first" ? "First Semester" : "Second Semester"}</Tag>
      );
  };

  const columns = [
    {
      title: "Authorized Person Name",
      width: 250,
      render: (_, row) =>
        row.name ?? user?.name?.name + " " + user?.name?.lastname ?? "",
    },
    {
      title: "Processed By",
      width: 250,
      dataIndex: "employerName",
    },
    {
      title: "Amount",
      width: 250,
      dataIndex: "amount",
    },
    {
      title: "Date released",
      width: 250,
      render: (_, row) => dayjs(row?.createdAt).format("MMMM D, YYYY"),
    },
    {
      title: "Semester",
      width: 250,
      align: "center",
      render: (_, row) => semesterLabel(row?.semester ?? []),
    },
    {
      title: "Notes/Remarks",
      width: 100,
      render: (_, row) =>
        row?.note ? (
          <Typography.Text
            style={{ width: 100 }}
            ellipsis={{
              tooltip: "Click to view more",
            }}
          >
            {row.note}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary" italic>
            not set
          </Typography.Text>
        ),
    },
  ];

  const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
      <Typography.Text
        style={{
          maxWidth: "100%",
        }}
        ellipsis={{
          suffix,
        }}
      >
        {start}
      </Typography.Text>
    );
  };

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/senior", {
        params: {
          mode: "get-senior-with-history",
          id,
        },
      });
      if (data.status == 200) {
        setHistory(data.data?.history);
        setUser(data.data);
      } else message.error("Error in server");
    })();
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setMode("Personal Info");
        close();
      }}
      placement="bottom"
      height="100%"
      title="History"
      style={{ width: 1400, marginLeft: "50%", transform: "translateX(-50%)" }}
      extra={
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Segmented
            options={["Personal Info", "Table", "Timeline"]}
            onChange={(e) => setMode(e)}
            value={mode}
          />
          {/* <div>
              Date Range: <DatePicker.RangePicker format="MMM DD YYYY" />
            </div> */}
        </Space>
      }
      destroyOnClose
    >
      {mode == "Table" && (
        <Table columns={columns} dataSource={history} rowKey={(e) => e._id} />
      )}
      {mode == "Timeline" && (
        <Timeline mode="left">
          {history?.map((e, i) => (
            <Timeline.Item
              label={dayjs(e?.createdAt).format("MMMM D, YYYY")}
              key={i}
            >
              <Typography.Text>
                <strong>Authorized Person:</strong>{" "}
                {e.name ?? user?.name?.name + " " + user?.name?.lastname ?? ""}
              </Typography.Text>
              <br />
              <Typography.Text>
                <strong> Processed by:</strong> {e.employerName}
              </Typography.Text>{" "}
              <br />
              <Typography.Text>
                <strong>Amount:</strong> P{e.amount}
              </Typography.Text>{" "}
              <br />
              {e?.note && (
                <Typography.Text ellipsis={true} style={{ width: 100 }}>
                  <strong>Notes:</strong>{" "}
                  <EllipsisMiddle suffixCount={12}>{e.note}</EllipsisMiddle>
                </Typography.Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      )}
      {mode == "Personal Info" && (
        <Profile
          id={id}
          closeAll={() => {
            close();
            refresh();
          }}
        />
      )}
    </Drawer>
  );
};

export default History;
