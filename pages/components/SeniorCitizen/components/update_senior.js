import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  Form,
  Radio,
  Space,
  DatePicker,
  InputNumber,
  Button,
  Select,
  message,
  Typography,
  Table,
  Steps,
  Tooltip,
  Image,
  theme,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { PickerDropPane } from "filestack-react";

import JASON from "../../../assets/json/constant.json";

const UpdateSenior = ({ open, close, refresh, id }) => {
  const { token } = theme.useToken();
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState([]);
  const [_label, _setLabel] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [sourceIncome, setSourceIncome] = useState();
  const [othersContent, setOthersContent] = useState("");
  const [othersIncome, setOthersIncome] = useState("");
  const [incomeIn6mos, setIncomeIn6mos] = useState("");
  const [image, setImage] = useState(null);

  const [initiateDone, setInitiateDone] = useState(false);

  const [data, setData] = useState({
    part1: {
      seniorInfo: {
        id: "",
        name: "",
        middlename: "",
        lastname: "",
        extensionName: "",
        gender: "male",
        dateOfBirth: "",
        maritalStatus: "married",
        barangay: "",
        contactNumber: "",
      },
      mothersInfo: {
        name: "",
        middlename: "",
        lastname: "",
      },
      guardian: {
        name: "",
        middlename: "",
        lastname: "",
        relationship: "",
      },
      etc: {
        authorizedRepresentative: [],
      },
    },
    part2: {
      sourceIncomeInfo: {
        receivedPension: null,
        receivedPension6mos: "",
        sourceOfIncome: {
          salary: {
            status: false,
            value: 0,
          }, // if not false, then true then render the value
          entrep: {
            status: false,
            value: 0,
          },
          householdMember: {
            status: false,
            value: 0,
          },
          domesticMember: {
            status: false,
            value: 0,
          },
          internationalMember: {
            status: false,
            value: 0,
          },
          fromFriends: {
            status: false,
            value: 0,
          },
          fromGovernment: {
            status: false,
            value: 0,
          },
          others: {
            status: false,
            value: 0,
          },
        },
      },
      livingWith: "",
      frailQuestion: {
        q1: false,
        q2: false,
        q3: false,
        q4: false,
        q5: false,
        q6: false,
      },
      isPwd: {
        status: null,
        name: "",
      },
      hasIllness: {
        status: null,
        name: "",
      },
      mealsPerDay: null,
    },
    part3: {
      description1: "",
    },
  });

  const description = [
    {
      label: "Food",
      value: "food",
    },
    {
      label: "Medicines and Vitamins",
      value: "medicines",
    },
    {
      label: "Health check-up and other hospital/medical services",
      value: "health",
    },
    {
      label: "Clothing",
      value: "clothing",
    },
    {
      label: "Utilities (e.g. electric and water bills)",
      value: "utilities",
    },
    {
      label: "Debt payment",
      value: "debt",
    },
    {
      label: "Livelihood/Entreprenurial Activities",
      value: "activities",
    },
    {
      label: "Others",
      value: "others",
    },
  ];

  const steps = [
    {
      title: "I. IDENTIFICATION",
      content: (
        <Form
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
          colon={false}
          layout="horizontal"
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
          form={form}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            I. IDENTIFICATION
          </Typography.Title>
          <div
            style={{
              backgroundColor: "#eee",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Typography.Title
              level={5}
              style={{ textAlign: "start", paddingTop: 10 }}
            >
              SENIOR INFORMATION
            </Typography.Title>
            <Form.Item label="Image Profile" style={{ marginTop: 20 }}>
              <div
                style={{ width: 255, cursor: "pointer" }}
                id="picker-container"
              >
                {(image == null || image == "") && initiateDone ? (
                  <PickerDropPane
                    apikey={"AKXY0x47MRoyw21abVGzJz"}
                    onUploadDone={(res) => setImage(res?.filesUploaded[0]?.url)}
                    pickerOptions={{ container: "picker-container" }}
                  />
                ) : null}
              </div>

              {image != null && image != "" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    position: "relative",
                    width: 200,
                  }}
                >
                  <Image src={image} alt="random_photo" width="100%" />
                  <Button
                    style={{
                      padding: 0,
                      fontSize: 15,
                      position: "absolute",
                      width: 32,
                      borderRadius: "100%",
                      aspectRatio: 1 / 1,
                      right: 5,
                      top: 5,
                    }}
                    danger
                    onClick={() => {
                      setImage(null);
                    }}
                  >
                    X
                  </Button>
                </div>
              ) : null}
            </Form.Item>
            <Form.Item
              label="Senior Citizen ID No."
              name="id"
              initialValue={data.part1.seniorInfo.id}
              style={{ textAlign: "start" }}
            >
              <InputNumber
                maxLength={6}
                controls={false}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        id: e,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="First Name" name="name">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        name: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Middle Name (Optional)" name="middlename">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        middlename: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Last Name" name="lastname">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        lastname: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Extension" name="extensionName">
              <Input
                style={{ width: 100, display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        extensionName: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Radio.Group
                style={{ display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        gender: e.target.value,
                      },
                    },
                  })
                }
              >
                <Space>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Date of Birth" name="dateOfBirth">
              <DatePicker
                style={{ display: "flex", width: 150 }}
                format="MMM DD, YYYY"
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        dateOfBirth: e,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Marital Status" name="maritalstatus">
              <Select
                style={{ width: 100, display: "flex" }}
                value={data.part1?.seniorInfo.maritalStatus}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        maritalStatus: e,
                      },
                    },
                  })
                }
              >
                <Select.Option value="single">Single</Select.Option>
                <Select.Option value="married">Married</Select.Option>
                <Select.Option value="widowed">Widowed</Select.Option>
                <Select.Option value="separated">Separated</Select.Option>
                <Select.Option value="livein">Live-in</Select.Option>
                <Select.Option value="others">Others</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Barangay" name="barangay">
              <Select
                showSearch
                value={data.part1?.seniorInfo.barangay}
                placeholder="Select a barangay"
                optionFilterProp="children"
                style={{ width: 150, display: "flex", textAlign: "start" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={JASON.barangay.map((_, i) => {
                  return {
                    label: _,
                    value: _,
                  };
                })}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        barangay: e,
                      },
                    },
                  })
                }
                allowClear
              />
            </Form.Item>
            <Form.Item label="Contact Number" name="contactInformation">
              <InputNumber
                style={{ width: 200, display: "flex" }}
                prefix="+63"
                maxLength={9}
                controls={false}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        contactNumber: e,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              MOTHERS MAIDEN NAME
            </Typography.Title>
            <Form.Item label="First Name" name="mothername">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      mothersInfo: {
                        ...data.part1.mothersInfo,
                        name: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Middle Name (Optional)" name="mothermiddlename">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      mothersInfo: {
                        ...data.part1.mothersInfo,
                        middlename: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Last Name" name="motherlastname">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      mothersInfo: {
                        ...data.part1.mothersInfo,
                        lastname: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              ETC
            </Typography.Title>
            <Form.Item label="Authorized Representative">
              <Input
                onChange={(e) => _setLabel(e.target.value)}
                value={_label}
                disabled={authorizedRepresentative?.length >= 3}
                style={{
                  marginBottom: 10,
                  width: 330,
                  display: "flex",
                }}
                prefix={
                  <Typography.Text type="secondary">Name: </Typography.Text>
                }
              />
              <InputNumber
                onChange={(e) => setContactNumber(e)}
                value={contactNumber}
                disabled={authorizedRepresentative?.length >= 3}
                style={{
                  marginBottom: 10,
                  width: 330,
                  display: "flex",
                }}
                maxLength={11}
                prefix={
                  <Typography.Text type="secondary">
                    Contact Number:{" "}
                  </Typography.Text>
                }
              />
              <Input
                onChange={(e) => setRelationship(e.target.value)}
                value={relationship}
                disabled={authorizedRepresentative?.length >= 3}
                style={{
                  marginBottom: 10,
                  width: 330,
                  display: "flex",
                }}
                prefix={
                  <Typography.Text type="secondary">
                    Relationship:{" "}
                  </Typography.Text>
                }
              />
              <Button
                disabled={authorizedRepresentative?.length >= 3}
                onClick={() => {
                  if (
                    authorizedRepresentative.filter((e) => e.name == _label)
                      .length > 0 ||
                    authorizedRepresentative?.length >= 3
                  )
                    return;

                  if (
                    _label == "" ||
                    contactNumber == "" ||
                    relationship == ""
                  ) {
                    message.warning("Please fill the blanks before adding");
                    return;
                  }
                  setAuthorizedRepresentative((e) => {
                    e.push({
                      name: _label,
                      contactNumber,
                      relationship,
                    });
                    return e;
                  });

                  _setLabel("");
                  setContactNumber("");
                  setRelationship("");
                }}
              >
                ADD
              </Button>

              {authorizedRepresentative?.map((e, index) => (
                <div
                  style={{ display: "flex", flexDirection: "row" }}
                  key={index}
                >
                  <div
                    style={{
                      borderRadius: 100,
                      border: ".5px solid rgba(255,0,0, 0.5)",
                      backgroundColor: "rgba(255,0,0, 0.1)",
                      width: 25,
                      height: 25,
                      lineHeight: "25px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginRight: 10,
                      marginTop: 5,
                      padding: 0,
                      color: "#F00",
                    }}
                    onClick={() =>
                      setAuthorizedRepresentative([
                        ...authorizedRepresentative.filter(
                          (_, i) => i != index
                        ),
                      ])
                    }
                  >
                    <CloseOutlined />
                  </div>
                  <Tooltip
                    title={
                      <>
                        {e.name} <br />
                        +63{e.contactNumber} <br />
                        {e.relationship}
                      </>
                    }
                  >
                    <div style={{ marginTop: 7 }}>{e.name}</div>
                  </Tooltip>
                </div>
              ))}
            </Form.Item>
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              GUARDIAN/CARE GIVER NAME
            </Typography.Title>
            <Form.Item label="First Name" name="guardianname">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      guardian: {
                        ...data.part1.guardian,
                        name: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Middle Name (Optional)" name="guardianmiddlename">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      guardian: {
                        ...data.part1.guardian,
                        middlename: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Last Name" name="guardianlastname">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      guardian: {
                        ...data.part1.guardian,
                        lastname: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Relationship"
              name="guardianrelationship"
              style={{ paddingBottom: 10 }}
            >
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      guardian: {
                        ...data.part1.guardian,
                        relationship: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      title: "II. SOCIOECONOMIC INFORMATION",
      content: (
        <Form
          layout="vertical"
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
          form={form2}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            II. SOCIOECONOMIC INFORMATION
          </Typography.Title>
          <div
            style={{
              backgroundColor: "#eee",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Typography.Title
              level={5}
              style={{ textAlign: "center", paddingTop: 10 }}
            >
              Income Sources and Financial Support
            </Typography.Title>
            <Form.Item
              label="Receive any form of pension ?"
              name="receivedPension"
              initialValue={
                data.part2?.sourceIncomeInfo?.receivedPension ?? false
              }
              // here
            >
              <Radio.Group
                style={{ display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      sourceIncomeInfo: {
                        ...data.part2.sourceIncomeInfo,
                        receivedPension: e.target.value,
                      },
                    },
                  })
                }
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
                <Radio value={null}>Don&apos;t Know</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Pension/s receive in the past 6 months?"
              name="receivedPension6mos"
              initialValue={data.part2?.sourceIncomeInfo?.receivedPension6mos}
            >
              <Radio.Group
                style={{ display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      sourceIncomeInfo: {
                        ...data.part2.sourceIncomeInfo,
                        receivedPension6mos: e.target.value,
                      },
                    },
                  })
                }
                value={
                  incomeIn6mos != ""
                    ? null
                    : data.part2?.sourceIncomeInfo?.receivedPension6mos
                }
              >
                {[
                  {
                    label: "DSWD Social Pension",
                    value: "dswd",
                  },
                  {
                    label: "GSIS",
                    value: "gsis",
                  },
                  {
                    label: "SSS",
                    value: "sss",
                  },
                  {
                    label: "AFPSLAI",
                    value: "afpslai",
                  },
                  {
                    label: "None",
                    value: "none",
                  },
                ].map((_) => (
                  <Radio value={_.value} key={_.value}>
                    {_.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item noStyle>
              <div style={{ display: "flex" }}>
                <Input
                  prefix={
                    <Typography.Text type="secondary">Others: </Typography.Text>
                  }
                  value={
                    incomeIn6mos != ""
                      ? incomeIn6mos
                      : !["dswd", "gsis", "sss", "afpslai", "none"].includes(
                          data.part2?.sourceIncomeInfo?.receivedPension6mos
                        )
                      ? data.part2?.sourceIncomeInfo?.receivedPension6mos
                      : ""
                  }
                  style={{
                    width: 200,
                    background: "#eee",
                    borderRadius: 0,
                  }}
                  onChange={(e) => {
                    setIncomeIn6mos(e.target.value);
                    setData({
                      ...data,
                      part2: {
                        ...data.part2,
                        sourceIncomeInfo: {
                          ...data.part2.sourceIncomeInfo,
                          receivedPension6mos: null,
                        },
                      },
                    });
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item
              label="What are your Sources of Income and Financial Support in the past 6 months? (other than your pension/s)? you ma y read the options. 
            for each options. For each source, indicate if it is regular then  record the estimated amount of income and devide by the household size, if applicable."
            >
              <Table
                columns={[
                  {
                    title: "A. Sources",
                    dataIndex: "question",
                  },
                  {
                    title: "B. Is it regular?",
                    render: (_, row, index) => {
                      let keys = [
                        "salary",
                        "entrep",
                        "householdMember",
                        "domesticMember",
                        "internationalMember",
                        "fromFriends",
                        "fromGovernment",
                        "others",
                      ];

                      if (index == 7) return <></>;
                      return (
                        <Radio.Group
                          value={
                            data.part2.sourceIncomeInfo.sourceOfIncome[
                              keys[index]
                            ]?.status ?? sourceIncome[keys[index]]?.status
                          }
                          onChange={(e) => {
                            setData({
                              ...data,
                              part2: {
                                ...data.part2,
                                sourceIncomeInfo: {
                                  ...data.part2.sourceIncomeInfo,
                                  sourceOfIncome: {
                                    ...data.part2.sourceIncomeInfo
                                      .sourceOfIncome,
                                    [keys[index]]: {
                                      status: e.target.value,
                                      value: !e.target.value
                                        ? 0
                                        : data.part2.sourceIncomeInfo
                                            .sourceOfIncome[keys[index]].value,
                                    },
                                  },
                                },
                              },
                            });
                          }}
                        >
                          <Radio value={false}>No</Radio>
                          <Radio value={true}>Yes</Radio>
                        </Radio.Group>
                      );
                    },
                  },
                  {
                    title: "C. Income",
                    render: (_, row, index) => {
                      let keys = [
                        "salary",
                        "entrep",
                        "householdMember",
                        "domesticMember",
                        "internationalMember",
                        "fromFriends",
                        "fromGovernment",
                        "others",
                      ];
                      return (
                        <>
                          Php{" "}
                          <Input
                            style={{ width: 100 }}
                            value={
                              data.part2.sourceIncomeInfo.sourceOfIncome[
                                keys[index]
                              ]?.value ?? sourceIncome[keys[index]]?.value
                            }
                            onChange={(e) => {
                              setData({
                                ...data,
                                part2: {
                                  ...data.part2,
                                  sourceIncomeInfo: {
                                    ...data.part2.sourceIncomeInfo,
                                    sourceOfIncome: {
                                      ...data.part2.sourceIncomeInfo
                                        .sourceOfIncome,
                                      [keys[index]]: {
                                        status:
                                          data.part2.sourceIncomeInfo
                                            .sourceOfIncome[keys[index]].status,
                                        value: e.target.value,
                                      },
                                    },
                                  },
                                },
                              });
                            }}
                          />
                        </>
                      );
                    },
                  },
                ]}
                dataSource={[
                  { question: "Wages/Salaries" },
                  { question: "Profits from Entrepreneurial Activities" },
                  { question: "Household Family Members/Relatives" },
                  { question: "Domestic Family Members/Relatives" },
                  { question: "International Family Members/Relatives" },
                  { question: "Friends/Neighbors" },
                  { question: "Transfer from the Government" },
                  {
                    question: (
                      <>
                        Others{" "}
                        <Input
                          style={{ width: 150 }}
                          onChange={(e) => setOthersIncome(e.target.value)}
                          value={
                            othersIncome != ""
                              ? othersIncome
                              : data.part2.sourceIncomeInfo.sourceOfIncome
                                  .others?.status == false
                              ? ""
                              : data.part2.sourceIncomeInfo.sourceOfIncome
                                  .others?.status
                          }
                        />
                      </>
                    ),
                  },
                ]}
                rowKey={(_) => _.question}
                pagination={false}
              />
            </Form.Item>
            <Form.Item label="Living With">
              <Radio.Group
                value={data.part2.livingWith}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      livingWith: e.target.value,
                    },
                  })
                }
                style={{
                  marginLeft: -180,
                }}
              >
                <Radio value="alone" style={{ display: "flex" }}>
                  Living alone
                </Radio>
                <Radio value="withSpouse" style={{ display: "flex" }}>
                  Living with Spouse
                </Radio>
                <Radio value="withChild" style={{ display: "flex" }}>
                  Living with a child (including adopted children), child-in-law
                  or grandchild
                </Radio>
                <Radio value="anotherRelative" style={{ display: "flex" }}>
                  Living with another relative (other than a spouse or
                  child/grandchild)
                </Radio>
                <Radio value="unrelatedPeople" style={{ display: "flex" }}>
                  Living with unrelated people only, apart from the older
                  person&apos;s spouse
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Frailty Questions">
              <Table
                columns={[
                  { dataIndex: "question" },
                  {
                    render: (_, row, index) => (
                      <Radio.Group
                        value={data.part2.frailQuestion[`q${index + 1}`]}
                        onChange={(e) => {
                          setData({
                            ...data,
                            part2: {
                              ...data.part2,
                              frailQuestion: {
                                ...data.part2.frailQuestion,
                                ["q" + (Number.parseInt(index) + 1)]:
                                  e.target.value,
                              },
                            },
                          });
                        }}
                      >
                        <Space direction="horizontal">
                          <Radio value={false}>No</Radio>
                          <Radio value={true}>Yes</Radio>
                        </Space>
                      </Radio.Group>
                    ),
                  },
                ]}
                dataSource={[
                  {
                    question: "Are you older than 85 years?",
                  },
                  {
                    question:
                      "In general, do you have any health problem that require you to limit your activities?",
                  },
                  {
                    question:
                      "Do you need someone to help you on regular basis?",
                  },
                  {
                    question:
                      "In general, do you have any health problems that requires  you to stay at home?",
                  },
                  {
                    question:
                      "If you need help, can you count on someone close to you?",
                  },
                  {
                    question:
                      "Do you regularly use a stick/walker/wheelchair to move about?",
                  },
                ]}
                pagination={false}
              />
            </Form.Item>
            <Form.Item label="Do you have any disability?">
              <Radio.Group
                style={{ display: "flex" }}
                value={data.part2.isPwd.status}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      isPwd: {
                        status: e.target.value,
                        name: data.part2.isPwd.name,
                      },
                    },
                  })
                }
              >
                <Radio value={true}>
                  YES - Disability:{" "}
                  <Input
                    style={{
                      width: 100,
                      background: "#eee",
                      border: "none",
                      borderBottom: "1px solid grey",
                      borderRadius: 0,
                    }}
                    value={data.part2.isPwd.name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        part2: {
                          ...data.part2,
                          isPwd: {
                            status: data.part2.isPwd.status,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </Radio>
                <Radio value={null}>None</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Do you have any critical illness or disease?">
              <Radio.Group
                style={{ display: "flex" }}
                value={data.part2.hasIllness.status}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      hasIllness: {
                        status: e.target.value,
                        name: data.part2.hasIllness.name,
                      },
                    },
                  })
                }
              >
                <Radio value={true}>
                  YES - Illness:{" "}
                  <Input
                    value={data.part2.hasIllness.name}
                    style={{
                      width: 100,
                      background: "#eee",
                      border: "none",
                      borderBottom: "1px solid grey",
                      borderRadius: 0,
                    }}
                    onChange={(e) =>
                      setData({
                        ...data,
                        part2: {
                          ...data.part2,
                          hasIllness: {
                            status: data.part2.hasIllness.status,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </Radio>
                <Radio value={null}>None</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="On the average, how many meals did you have in a day during the past week?">
              <Radio.Group
                style={{ display: "flex" }}
                value={
                  Number.parseInt(data.part2.mealsPerDay) > 3
                    ? "3"
                    : data.part2.mealsPerDay?.toString()
                }
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: { ...data.part2, mealsPerDay: e.target.value },
                  })
                }
              >
                <Radio value="1">Almost 1</Radio>
                <Radio value="2">Two</Radio>
                <Radio value="3">Atleast 3</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      title: "III. UTILIZATION OF SOCIAL PENSION",
      content: (
        <Form
          layout="vertical"
          style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            III. UTILIZATION OF SOCIAL PENSION
          </Typography.Title>
          <div
            style={{
              backgroundColor: "#eee",
            }}
          >
            <Form.Item label="Where do you spend your Social Pension? ">
              <Radio.Group
                onChange={(e) =>
                  setData({ ...data, part3: { description1: e.target.value } })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 10,
                }}
                value={
                  !description
                    .map((e) => e.value)
                    .includes(data.part3.description1) &&
                  !["", null, undefined].includes(data.part3.description1)
                    ? "others"
                    : data.part3.description1
                }
              >
                {description.map((e, i) => (
                  <Radio
                    value={e.value}
                    style={{
                      paddingBottom: 4,
                    }}
                    key={i}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {e.label}
                      {(data.part3.description1 == "others" ||
                        !description
                          .map((e) => e.value)
                          .includes(data.part3.description1)) &&
                        e.value == "others" && (
                          <Input
                            style={{ marginLeft: 10 }}
                            onChange={(e) => setOthersContent(e.target.value)}
                            value={
                              othersContent != ""
                                ? othersContent
                                : data.part3.description1
                            }
                          />
                        )}
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      ),
    },
  ];

  const handleFinish = async () => {
    const {
      gender,
      dateOfBirth,
      maritalStatus,
      contactNumber,
      name,
      middlename,
      lastname,
      extensionName,
      barangay,
    } = data.part1.seniorInfo;

    if (othersIncome != "")
      data.part2.sourceIncomeInfo.sourceOfIncome.others.status = othersIncome;

    if (incomeIn6mos != "")
      data.part2.sourceIncomeInfo.receivedPension6mos = incomeIn6mos;

    let updatedData = {
      //  PART 1
      name: {
        id: data.part1.seniorInfo.id,
        name,
        middlename,
        lastname,
        extensionName,
      },
      gender,
      dateOfBirth,
      maritalStatus,
      contactNumber,
      barangay,
      motherMaidenName: { ...data.part1.mothersInfo },
      authorizedRepresentative,
      guardian: data.part1.guardian,
      profileImage: image,
      // PART 2
      receivedPension: data.part2.sourceIncomeInfo.receivedPension,
      receivedPension6mos: data.part2.sourceIncomeInfo.receivedPension6mos,
      sourceOfIncome: { ...data.part2.sourceIncomeInfo.sourceOfIncome },
      livingWith: data.part2.livingWith,
      frailQuestion: { ...data.part2.frailQuestion },
      isPwd: { ...data.part2.isPwd },
      hasIllness: { ...data.part2.hasIllness },
      mealsPerDay: data.part2.mealsPerDay,
      description:
        data.part3.description1 == "others"
          ? othersContent
          : data.part3.description1,
    };

    let res = await axios.post("/api/senior", {
      payload: {
        mode: "update-senior",
        data: updatedData,
        id,
      },
    });

    if (res.data.status == 200) {
      message.success(res.data.message);
      close();
      refresh();
      setCurrent(0);
    } else message.error(res.data.message);
  };

  const checkValidate = () => {
    if (current == 0) {
      let missingFields = { seniorInfo: [], mothersInfo: [], guardian: [] };

      let age = dayjs().diff(
        dayjs(data.part1.seniorInfo.dateOfBirth).format("YYYY-MM-DD"),
        "years",
        false
      );

      if (age < 60) {
        message.warning(
          "Only senior with atleast 60 years of age is valid to register in the system."
        );
        return;
      }

      if (authorizedRepresentative.length <= 0) {
        message.warning("Please add a representative atleast one");
        return;
      }

      Object.keys(data.part1.seniorInfo).forEach((e) => {
        if (e != "extensionName" && data.part1.seniorInfo[e] == "")
          missingFields.seniorInfo.push(e);
      });
      Object.keys(data.part1.mothersInfo).forEach((e) => {
        if (data.part1.mothersInfo[e] == "") missingFields.mothersInfo.push(e);
      });
      Object.keys(data.part1.guardian).forEach((e) => {
        if (data.part1.guardian[e] == "") missingFields.guardian.push(e);
      });

      if (missingFields.seniorInfo.length > 0) {
        if (
          !(
            missingFields.seniorInfo.includes("middlename") &&
            missingFields.seniorInfo.length == 1
          )
        ) {
          message.error(
            `Please input missing fields. SENIOR (${missingFields.seniorInfo.join(
              ", "
            )})`
          );
          return;
        }
      }

      if (missingFields.mothersInfo.length > 0) {
        if (
          !(
            missingFields.mothersInfo.includes("middlename") &&
            missingFields.mothersInfo.length == 1
          )
        ) {
          message.error(
            `Please input missing fields. MOTHER (${missingFields.mothersInfo.join(
              ", "
            )})`
          );
          return;
        }
      }

      if (missingFields.guardian.length > 0) {
        if (
          !(
            missingFields.guardian.includes("middlename") &&
            missingFields.guardian.length == 1
          )
        ) {
          message.error(
            `Please input missing fields. GUARDIAN (${missingFields.guardian.join(
              ", "
            )})`
          );
          return;
        }
      }
    }
    setCurrent(current + 1);
  };

  useEffect(() => {
    (async () => {
      setInitiateDone(false);
      let res = await axios.get("/api/senior", {
        params: {
          mode: "search-senior-by-id",
          _id: id,
        },
      });

      if (res.data.status == 200) {
        setData({
          part1: {
            seniorInfo: {
              ...res.data.data?.name,
              gender: res.data.data?.gender,
              dateOfBirth: res.data.data?.dateOfBirth,
              maritalStatus: res.data.data?.maritalStatus,
              barangay: res.data.data?.barangay,
              contactNumber: res.data.data?.contactNumber,
            },
            mothersInfo: { ...res.data.data?.motherMaidenName },
            guardian: {
              ...res.data.data?.guardian,
            },
            etc: {
              authorizedRepresentative:
                res.data.data?.authorizedRepresentative ?? [],
            },
          },
          part2: {
            sourceIncomeInfo: {
              receivedPension: res.data.data?.receivedPension,
              receivedPension6mos:
                res.data.data?.receivedPension6mos != null
                  ? res.data.data?.receivedPension6mos
                  : "",
              sourceOfIncome: {
                ...res.data.data?.sourceOfIncome,
              },
            },
            livingWith: res.data.data?.livingWith,
            frailQuestion: {
              ...res.data.data?.frailQuestion,
            },
            isPwd: {
              ...res.data.data?.isPwd,
            },
            hasIllness: {
              ...res.data.data?.hasIllness,
            },
            mealsPerDay: res.data.data?.mealsPerDay,
          },
          part3: {
            description1: res.data.data?.description,
          },
        });
        let _ = res.data.data;
        form.setFieldsValue({
          id: _?.name.id,
          name: _?.name.name,
          middlename: _?.name.middlename,
          lastname: _?.name.lastname,
          extensionName: _?.name.extensionName,
          gender: _?.gender,
          dateOfBirth: dayjs(_?.dateOfBirth),
          maritalstatus: _?.maritalStatus,
          barangay: _?.barangay,
          contactInformation: _?.contactNumber,
          guardianname: _?.guardian.name,
          guardianmiddlename: _?.guardian.middlename,
          guardianlastname: _?.guardian.lastname,
          guardianrelationship: _?.guardian.relationship,
          mothername: _?.motherMaidenName.name,
          mothermiddlename: _?.motherMaidenName.middlename,
          motherlastname: _?.motherMaidenName.lastname,
        });

        form2.setFieldsValue({
          receivedPension: _?.receivedPension,
          receivedPension6mos: _?.receivedPension6mos,
        });
        setAuthorizedRepresentative(_?.authorizedRepresentative);
        setSourceIncome(_?.sourceOfIncome);
        setImage(_?.profileImage ?? null);
        setInitiateDone(true);
      }
      setInitiateDone(true);
    })();
  }, [id, open]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        close();
        setCurrent(0);
      }}
      closable={false}
      width={800}
      style={{ top: 10 }}
      footer={
        current == 2 && (
          <Button type="primary" onClick={handleFinish}>
            UPDATE
          </Button>
        )
      }
      destroyOnClose
    >
      <Steps
        current={current}
        items={steps.map((item) => ({
          key: item.title,
          title: item.title,
        }))}
      />
      <div
        style={{
          lineHeight: "260px",
          textAlign: "center",
          color: token.colorTextTertiary,
          backgroundColor: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
          marginTop: 16,
        }}
      >
        {steps[current].content}
      </div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && (
          <Button type="primary" onClick={checkValidate}>
            Next
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default UpdateSenior;
