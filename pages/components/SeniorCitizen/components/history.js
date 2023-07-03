import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Drawer,
  Space,
  Table,
  Segmented,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

const History = ({ open, close, id }) => {
  let [history, setHistory] = useState([]);
  const columns = [
    {
      title: "Authorized Person Name",
      width: 250,
      dataIndex: "name",
    },
    {
      title: "Emplyoer Name",
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
      render: (_, row, index) => index,
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

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/senior", {
        params: {
          mode: "get-senior-with-history",
          id,
        },
      });

      if (data.status == 200) setHistory(data.data);
      else message.error("Error in server");
    })();
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={close}
      placement="bottom"
      height="100%"
      title="History"
      destroyOnClose
    >
      <Row>
        <Col span={16}>
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Segmented options={["Table", "Timeline"]} />
            <div>
              Date Range: <DatePicker.RangePicker format="MMM DD YYYY" />
            </div>
          </Space>
          <Table columns={columns} dataSource={history} rowKey={(e) => e._id} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default History;
