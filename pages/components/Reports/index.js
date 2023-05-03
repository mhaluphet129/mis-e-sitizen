import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Table,
  Card,
  Button,
  Space,
  Drawer,
  Col,
  Typography,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const Reports = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [seniors, setSeniors] = useState([]);
  const ref = useRef();

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const CustomTable1 = () => (
    <div>
      <Typography.Title level={5} style={{ margin: 0, textAlign: "center" }}>
        Republic of the Philippines
      </Typography.Title>
      <Typography.Title level={5} style={{ margin: 0, textAlign: "center" }}>
        Province of Bukidnon
      </Typography.Title>
      <Typography.Title level={5} style={{ margin: 0, textAlign: "center" }}>
        Municipality of Kadingilan
      </Typography.Title>
      <br />
      <Typography.Title
        level={4}
        style={{ margin: 0, marginBottom: 10, textAlign: "center" }}
      >
        MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT OFFICE
      </Typography.Title>
      <Table
        dataSource={seniors}
        className="myTable"
        rowClassName="custom-table"
        pagination={false}
        columns={[
          {
            title: "NO",
            align: "center",
            width: 50,
            render: (_, row) => seniors.indexOf(row) + 1,
          },
          {
            title: "LAST",
            width: 200,
            render: (_, row) => row?.lastname?.toUpperCase(),
          },
          {
            title: "FIRST",
            width: 200,

            render: (_, row) => row?.name?.toUpperCase(),
          },
          {
            title: "MIDDLE",
            width: 200,
            render: (_, row) => row?.middlename?.toUpperCase(),
          },
          {
            title: "EXT.",
            width: 50,
            render: (_, row) => row?.title?.toUpperCase(),
          },
          {
            title: "HOUSE NO. / ZONE / PUROK / SITIO",
            width: 180,
            render: (_, row) => row?.address?.toUpperCase(),
          },
          {
            title: "BARANGAY",
            width: 180,
            render: (_, row) => row?.barangay?.toUpperCase(),
          },
          {
            title: "BIRTHDATE (DAY/MONTH/YEAR)",
            width: 1,
            render: (_, row) =>
              moment(row?.dateOfBirth?.toUpperCase()).format("DD/MM/YYYY"),
          },
          {
            title: "AGE",
            width: 1,
            render: (_, row) => row?.age,
          },
          {
            title: "GENDER",
            width: 1,
            render: (_, row) => row?.gender?.toUpperCase(),
          },
        ]}
        bordered
      />
      <Col span={5} style={{ marginTop: 100 }}>
        <Typography.Text>Jean Paulith Bacarisan</Typography.Text>
        <br />
        <Typography.Text style={{ borderTop: "1px solid #000" }}>
          Social Welfare Assistant
        </Typography.Text>
      </Col>
    </div>
  );

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        placement="bottom"
        height="100%"
        title="Print Preview"
        extra={[
          <Button onClick={handlePrint} key="key1">
            PRINT
          </Button>,
        ]}
        bodyStyle={{
          textAlign: "center",
        }}
        style={{
          width: 900,
          marginLeft: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <PDF ref={ref}>
          <CustomTable1 />
        </PDF>
      </Drawer>
      <Card>
        <Space>
          <Button
            onClick={async () => {
              let { data } = await axios.get("/api/senior", {
                params: {
                  mode: "fetch-all",
                },
              });

              if (data?.status == 200) {
                setOpenDrawer(true);
                setSeniors(data?.senior);
              } else message.error(data?.message);
            }}
          >
            Print Senior Citizen List
          </Button>
        </Space>
      </Card>
    </>
  );
};

export default Reports;
