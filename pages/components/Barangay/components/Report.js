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
  Image,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import Cookies from "js-cookie";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const Reports = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [seniors, setSeniors] = useState([]);
  const ref = useRef();

  const barangay = Cookies.get("barangay");

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const CustomTable1 = () => (
    <div style={{ marginTop: 15 }}>
      <div
        style={{ display: "grid", alignItems: "center", textAlign: "center" }}
      >
        <Image
          src="/logo.png"
          alt="logo"
          preview={false}
          width={100}
          style={{ position: "absolute", marginTop: -15 }}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Republic of the Philippines
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Province of Bukidnon
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Municipality of Kadingilan
          </Typography.Title>
        </div>
      </div>
      <br />
      <Typography.Title
        level={4}
        style={{ margin: 0, marginBottom: 0, textAlign: "center" }}
      >
        SOCIAL PENSION PROGRAM POTENTIAL LIST OF BENEFICIARIES/WAITLISTED
      </Typography.Title>
      <Typography.Title
        level={4}
        style={{ margin: 0, marginBottom: 10, textAlign: "center" }}
      >
        Control Number: Kadingilan-2023-2024
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
            render: (_, row) => row?.name?.lastname?.toUpperCase(),
          },
          {
            title: "FIRST",
            width: 200,

            render: (_, row) => row?.name?.name?.toUpperCase(),
          },
          {
            title: "MIDDLE",
            width: 200,
            render: (_, row) => row?.name?.middlename?.toUpperCase(),
          },

          {
            title: "BARANGAY",
            width: 180,
            render: (_, row) => row?.barangay?.toUpperCase(),
          },
          {
            title: "AGE",
            align: "center",
            width: 1,
            render: (_, row) =>
              dayjs().diff(
                dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
                "years",
                false
              ),
          },

          {
            title: "GENDER",
            width: 1,
            render: (_, row) => row?.gender?.toUpperCase(),
          },
          {
            title: "CIVIL STATUS",
            width: 50,
            render: (_, row) => row?.maritalStatus?.toUpperCase(),
          },
          {
            title: "BIRTHDATE ",
            width: 1,
            align: "center",
            render: (_, row) =>
              moment(row?.dateOfBirth?.toUpperCase()).format("DD/MM/YYYY"),
          },
          {
            title: "OSCA ID NO.",
            width: 50,
            render: (_, row) => row?.name.id?.toUpperCase(),
          },
        ]}
        bordered
      />
      <Col span={5} style={{ marginTop: 100 }}>
        <Typography.Text>Jean Paulith B. Elcano</Typography.Text>
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
                  barangay,
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