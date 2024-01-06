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

import { master_list, pension_status, living_status } from "./columns";
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
import FilterFormBarangay from "./components/Filterform_barangay";

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
    title: "",
    open: false,
    type: "",
    checked: [],
    pstatus: [],
    semester: "",
  });

  const [openBarangayFilter, setOpenBarangayFilter] = useState(false);
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
        rowKey={(e) => e._id}
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
      <FilterFormBarangay
        open={openBarangayFilter}
        close={() => setOpenBarangayFilter(false)}
        selectedBarangay={async (v, d, s) => {
          message.info("Generating reports....");
          let { data } = await axios.get("/api/senior", {
            params: {
              mode: "fetch-all",
              barangay: [null, ""].includes(v) ? null : v,
              date: JSON.stringify(d),
              selectedDates: JSON.stringify(s),
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
      />
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
        title={openFilterForm.title}
        open={openFilterForm.open}
        close={() =>
          setOpenFilterForm({
            title: "",
            open: false,
            type: "",
            checked: ["ACTIVE"],
            pstatus: ["social"],
          })
        }
        checkValues={
          openFilterForm.title == "Health Status"
            ? openFilterForm.checked
            : openFilterForm.title == "Released Pension"
            ? null
            : openFilterForm.pstatus
        }
        setCheckValues={(val) =>
          setOpenFilterForm({
            ...openFilterForm,
            [openFilterForm.title == "Health Status" ? "checked" : "pstatus"]:
              val,
          })
        }
        submit={(v) => {
          if (
            (openFilterForm.title == "Health Status" &&
              openFilterForm.checked.length == 0) ||
            (openFilterForm.title == "Pension Status" &&
              openFilterForm.pstatus.length == 0)
          ) {
            message.warning("Select atleast 1 status");
            return;
          }
          message.info("Generating reports...");

          let params = {
            [openFilterForm.title == "Health Status" ? "status" : "pstatus"]:
              v.status != null && v.status?.length != 0
                ? JSON.stringify(v.status)
                : "",
            barangay: v?.barangay,
            year: v?.year,
            semester: v?.semester,
          };

          (async (_) => {
            let { data } = await axios.get("/api/senior", {
              params: {
                mode: "senior-with-filter",
                ...params,
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
                    ? living_status
                    : pension_status,
              });
              message.success(data?.message ?? "Generate success");
            } else message.error(data?.message);
          })(axios);
        }}
      />
      {/* end */}
      <Space
        style={{
          alignItems: "start",
        }}
      >
        <Card title="General">
          <Space direction="vertical">
            <Button onClick={() => setOpenBarangayFilter(true)}>
              Senior Citizen List
            </Button>
            <Button
              onClick={() => {
                setOpenFilterForm({
                  title: "Health Status",
                  open: true,
                  type: "living-status",
                  checked: ["ACTIVE"],
                });
              }}
              block
            >
              Health Status
            </Button>
            <Button
              onClick={() => {
                setOpenFilterForm({
                  title: "Released Pension",
                  open: true,
                  type: "released-pension",
                  checked: ["ACTIVE"],
                });
              }}
              block
            >
              Released Pension
            </Button>
            <Button
              onClick={() => {
                setOpenFilterForm({
                  title: "Pension Status",
                  open: true,
                  type: "pension-status",
                  pstatus: ["social"],
                });
              }}
              block
            >
              Pension Status
            </Button>
          </Space>
        </Card>
        <Card title="Forms">
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
              block
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
              block
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
              block
            >
              Certification
            </Button>
          </Space>
        </Card>
      </Space>
    </>
  );
};

export default Reports;
