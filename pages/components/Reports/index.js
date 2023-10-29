import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Table,
  Card,
  Button,
  Drawer,
  Col,
  Typography,
  Image,
  Row,
  Space,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

import { master_list, pension_status } from "./columns";
import ModalForm from "./components/ModalForm";
import DrawerPrintPreview from "./components/DrawerPrintPreview";

// FORMS
import Certification from "./forms/certication";
import SocialPensionProgram from "./forms/social_pension_program";
import WarrantAndRelease from "./forms/warrant_and_release";

// FORMS PREVIEW
import PreviewCertification from "./formsWithValue/certication";
import PreviewSocialPensionProgram from "./formsWithValue/social_pension_program";
import PreviewWarrantAndRelease from "./formsWithValue/warrant_and_release";

import FilterForm from "./components/FilterForm";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const Reports = () => {
  const [openModalForm, setOpenModalForm] = useState({
    open: false,
    children: <></>,
  });
  const [openDrawerPreview, setOpenDrawerPreview] = useState({
    open: false,
    title: "",
    children: <></>,
  });

  const [openDrawer, setOpenDrawer] = useState({
    open: false,
    dataSource: [],
    column: [],
  });

  const [openFilterForm, setOpenFilterForm] = useState({
    open: false,
    type: "",
  });
  const [formValues, setFormValues] = useState({});
  const ref = useRef();

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
        dataSource={openDrawer.dataSource}
        className="myTable"
        rowClassName="custom-table"
        pagination={false}
        columns={openDrawer.column}
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
      <ModalForm
        open={openModalForm.open}
        close={() => setOpenModalForm({ open: false, children: <></> })}
        print={() => {
          let children = <></>;

          switch (openDrawerPreview.title) {
            case "WARRANTY AND RELEASE FROM LIABILITY": {
              children = <PreviewWarrantAndRelease data={formValues} />;
              break;
            }
            case "AUTHORIZATION": {
              children = <PreviewSocialPensionProgram data={formValues} />;
              break;
            }
            case "CERTIFICATION": {
              children = <PreviewCertification data={formValues} />;
              break;
            }
          }

          setOpenDrawerPreview((e) => {
            return { ...e, open: true, children };
          });
        }}
      >
        {openModalForm.children}
      </ModalForm>
      <DrawerPrintPreview
        open={openDrawerPreview.open}
        title={openDrawerPreview.title}
        close={() =>
          setOpenDrawerPreview((e) => {
            return { ...e, open: false, children: <></> };
          })
        }
      >
        {openDrawerPreview.children}
      </DrawerPrintPreview>
      <Drawer
        open={openDrawer.open}
        onClose={() =>
          setOpenDrawer({ open: false, dataSource: null, column: null })
        }
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
      {/* Filter Form here */}
      <FilterForm
        title="Living Status"
        open={openFilterForm.open}
        close={() => setOpenFilterForm({ open: false, type: "" })}
        submit={(v) => {
          message.info("Generating reports...");

          (async (_) => {
            let { data } = await axios.get("/api/senior", {
              params: {
                mode: "senior-with-filter",
                status:
                  v.status != null && v.status?.length != 0
                    ? JSON.stringify(v.status)
                    : "",
                barangay: v.barangay,
              },
            });

            if (data?.status == 200) {
              // sort by birthdate
              data.senior = data.senior.sort((a, b) => {
                let _a = dayjs().diff(
                  dayjs(a?.dateOfBirth).format("YYYY-MM-DD"),
                  "years",
                  false
                );
                let _b = dayjs().diff(
                  dayjs(b?.dateOfBirth).format("YYYY-MM-DD"),
                  "years",
                  false
                );

                if (_a < _b) {
                  return -1;
                }
                if (_a > _b) {
                  return 1;
                }
                return 0;
              });

              setOpenDrawer({
                open: true,
                dataSource: data.senior,
                column:
                  openFilterForm.type == "living-status"
                    ? master_list
                    : pension_status,
              });
              message.success(data?.message ?? "Generate success");
            } else message.error(data?.message);
          })(axios);
        }}
      />
      {/* end */}
      <Card>
        <Row>
          <Col span={8}>
            <Typography.Title level={4}>General</Typography.Title>
            <Space direction="vertical">
              <Button
                onClick={async () => {
                  message.info("Generating reports....");
                  let { data } = await axios.get("/api/senior", {
                    params: {
                      mode: "fetch-all",
                    },
                  });
                  if (data?.status == 200) {
                    setOpenDrawer({
                      open: true,
                      dataSource: data.senior,
                      column: master_list,
                    });
                    message.success("Generate success");
                  } else message.error(data?.message);
                }}
              >
                Print Senior Citizen List
              </Button>
              <Button
                onClick={() => {
                  setOpenFilterForm({ open: true, type: "living-status" });
                }}
              >
                Living Status
              </Button>
              <Button
                onClick={() => {
                  setOpenFilterForm({ open: true, type: "pension-status" });
                }}
              >
                Pension Status
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Typography.Title level={4}>Forms</Typography.Title>
            <Space direction="vertical">
              <Button
                onClick={() => {
                  setOpenDrawerPreview((e) => {
                    return {
                      ...e,
                      title: "WARRANTY AND RELEASE FROM LIABILITY",
                    };
                  });
                  setOpenModalForm({
                    open: true,
                    children: <WarrantAndRelease setData={setFormValues} />,
                  });
                }}
              >
                Warranty and Release from liability
              </Button>
              <Button
                onClick={() => {
                  setOpenDrawerPreview((e) => {
                    return {
                      ...e,
                      title: "AUTHORIZATION",
                    };
                  });
                  setOpenModalForm({
                    open: true,
                    children: (
                      <SocialPensionProgram
                        setData={setFormValues}
                        print={() => {}}
                      />
                    ),
                  });
                }}
              >
                Authorization
              </Button>
              <Button
                onClick={() => {
                  setOpenDrawerPreview((e) => {
                    return {
                      ...e,
                      title: "CERTIFICATION",
                    };
                  });
                  setOpenModalForm({
                    open: true,
                    children: (
                      <Certification setData={setFormValues} print={() => {}} />
                    ),
                  });
                }}
              >
                Certification
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Reports;
