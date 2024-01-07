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
  Image,
  Row,
  Modal,
  Checkbox,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import Cookies from "js-cookie";

// FORMS
import Certification from "../../Reports/forms/certication";
import SocialPensionProgram from "../../Reports/forms/social_pension_program";
import WarrantAndRelease from "../../Reports/forms/warrant_and_release";

// FORMS PREVIEW
import PreviewCertification from "../../Reports/formsWithValue/certication";
import PreviewSocialPensionProgram from "../../Reports/formsWithValue/social_pension_program";
import PreviewWarrantAndRelease from "../../Reports/formsWithValue/warrant_and_release";

import FilterForm from "../../Reports/components/FilterForm";
import FilterFormBarangay from "../../Reports/components/Filterform_barangay";

import ModalForm from "../../Reports/components/ModalForm";

import {
  master_list,
  pension_status,
  living_status,
} from "../../Reports/columns";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const Reports = () => {
  const [openDrawer, setOpenDrawer] = useState({
    open: false,
    dataSource: [],
    column: [],
    title: "",
  });

  const [openBarangayFilter, setOpenBarangayFilter] = useState(false);

  const [seniors, setSeniors] = useState([]);
  const ref = useRef();

  const [openModalForm, setOpenModalForm] = useState({
    open: false,
    children: <></>,
  });

  const [openDrawerPreview, setOpenDrawerPreview] = useState({
    open: false,
    title: "",
    children: <></>,
  });

  const [formValues, setFormValues] = useState({});

  const barangay = Cookies.get("barangay");

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const [openFilterForm, setOpenFilterForm] = useState({
    title: "",
    open: false,
    type: "",
    checked: [],
    pstatus: [],
    semester: "",
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
      <Typography.Title
        level={5}
        style={{ margin: 0, marginBottom: 10, textAlign: "center" }}
      >
        {openDrawer.title}
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
      <FilterForm
        title={openFilterForm.title}
        open={openFilterForm.open}
        selectedBarangay={barangay}
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
                title:
                  openFilterForm.type == "living-status"
                    ? "Health Status"
                    : openFilterForm.type == "released-pension"
                    ? "Released Pension"
                    : "Pension Status",
              });
              message.success(data?.message ?? "Generate success");
            } else message.error(data?.message);
          })(axios);
        }}
      />
      <FilterFormBarangay
        open={openBarangayFilter}
        close={() => setOpenBarangayFilter(false)}
        barangay={barangay}
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
      {/* end of context */}
      <Space
        style={{
          alignItems: "start",
        }}
      >
        <Card title="General">
          <Space direction="vertical">
            <Button onClick={() => setOpenBarangayFilter(true)} block>
              Senior Citizen List
            </Button>
            <Button
              onClick={() =>
                setOpenFilterForm({
                  title: "Health Status",
                  open: true,
                  type: "living-status",
                  checked: ["ACTIVE"],
                })
              }
              block
            >
              Health Status
            </Button>
            <Button
              onClick={() =>
                setOpenFilterForm({
                  title: "Released Pension",
                  open: true,
                  type: "released-pension",
                  checked: ["ACTIVE"],
                })
              }
              block
            >
              Released Pension
            </Button>

            <Button
              onClick={async () =>
                setOpenFilterForm({
                  title: "Pension Status",
                  open: true,
                  type: "pension-status",
                  pstatus: ["social"],
                })
              }
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
