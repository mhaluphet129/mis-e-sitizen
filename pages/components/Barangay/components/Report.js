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

import ModalForm from "../../Reports/components/ModalForm";
import DrawerPrintPreview from "../../Reports/components/DrawerPrintPreview";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const Reports = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const options = [
    { label: "Active", value: "ACTIVE" },
    { label: "Active with Illness", value: "ACTIVE_WITH_ILLNESS" },
    { label: "Deceased", value: "DECEASED" },
  ];

  const options2 = [
    { label: "Social", value: "social" },
    { label: "Private", value: "private" },
    { label: "None", value: "none" },
  ];

  const [filterOpt, setFilterOpt] = useState({
    title: "",
    open: false,
    checked: ["ACTIVE"],
    pstatus: [""],
    options: [],
  });

  const resetFilter = () =>
    setFilterOpt({
      title: "",
      open: false,
      checked: ["ACTIVE"],
      pstatus: ["social"],
      options: [],
    });

  const fetchSenior = async () => {
    if (
      (filterOpt.title == "Living Status" && filterOpt.checked.length == 0) ||
      (filterOpt.title == "Pension Status" && filterOpt.pstatus.length == 0)
    ) {
      message.warning("Select atleast 1 status");
      return;
    }
    message.info("Generating reports....");
    const { data } = await axios.get("/api/senior", {
      params: {
        mode: "senior-with-filter",
        [filterOpt.title == "Living Status" ? "status" : "pstatus"]:
          JSON.stringify(
            filterOpt.title == "Living Status"
              ? filterOpt.checked
              : filterOpt.pstatus
          ),
      },
    });

    if (data.status == 200) {
      message.success("Generate success");
      setSeniors(data.senior);
      setOpenDrawer(true);
      setFilterOpt({ ...filterOpt, open: false });
    }
  };

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
      {/* FIlter form */}
      <Modal
        title={filterOpt.title}
        open={filterOpt.open}
        onCancel={() => resetFilter()}
        footer={[
          <Button
            key="btn-1"
            onClick={() =>
              setFilterOpt({
                ...filterOpt,
                checked: ["ACTIVE"],
                pstatus: ["social"],
              })
            }
          >
            Clear All
          </Button>,
          <Button key="btn-2" type="primary" onClick={fetchSenior}>
            Apply Filter
          </Button>,
        ]}
        destroyOnClose
      >
        <Checkbox.Group
          defaultValue={
            filterOpt.title == "Living Status"
              ? filterOpt.checked
              : filterOpt.pstatus
          }
          value={
            filterOpt.title == "Living Status"
              ? filterOpt.checked
              : filterOpt.pstatus
          }
          onChange={(v) =>
            setFilterOpt({
              ...filterOpt,
              [filterOpt.title == "Living Status" ? "checked" : "pstatus"]: v,
            })
          }
          style={{ marginTop: 10 }}
        >
          <Space direction="vertical">
            {filterOpt.options.map((e, i) => (
              <Checkbox key={`checkbox_${i}`} value={e.value}>
                {e.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Modal>
      {/* end */}
      <Card>
        <Row>
          <Col span={8}>
            <Space direction="vertical">
              <Typography.Title level={4}>General</Typography.Title>
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
              <Button
                onClick={() =>
                  setFilterOpt({
                    title: "Living Status",
                    open: true,
                    checked: ["ACTIVE"],
                    options: options,
                  })
                }
              >
                Living Status
              </Button>
              <Button
                onClick={async () =>
                  setFilterOpt({
                    title: "Pension Status",
                    open: true,
                    pstatus: ["social"],
                    options: options2,
                  })
                }
              >
                Pension Status
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical">
              <Typography.Title level={4}>Forms</Typography.Title>
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
