import React, { useState } from "react";
import {
  Input,
  Modal,
  Form,
  Radio,
  Space,
  DatePicker,
  InputNumber,
  Checkbox,
  Button,
  Select,
  message,
  Typography,
  Table,
  Steps,
  theme,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

const AddSenior = ({ open, close, refresh }) => {
  const { token } = theme.useToken();
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState([]);
  const [_label, _setLabel] = useState("");
  const [current, setCurrent] = useState(0);
  const [checkFlag, setCheckFlag] = useState([false, false, false]);

  const [data, setData] = useState({
    part1: {
      seniorInfo: {
        id: "",
        name: "",
        middlename: "",
        lastname: "",
        extension: "",
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
        withSSS: false,
        withPension: false,
        pensionMonthly: 3000,
      },
    },
    part2: {
      sourceIncomeInfo: {
        receivedPension: null,
        receivedPension6mos: [],
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
    part3: {},
  });

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
            <Form.Item label="Senior Citizen ID No." name="id">
              <Input
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        id: e.target.value,
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
            <Form.Item label="Extension" name="extension">
              <Input
                style={{ width: 100, display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      seniorInfo: {
                        ...data.part1.seniorInfo,
                        extension: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Gender" name="gender" initialValue="male">
              <Radio.Group
                defaultValue="male"
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
                value={data.part1.seniorInfo.maritalStatus}
                defaultValue={data.part1.seniorInfo.maritalStatus}
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
                value={data.part1.seniorInfo.barangay}
                placeholder="Select a barangay"
                optionFilterProp="children"
                style={{ width: 150, display: "flex", textAlign: "start" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={Array(17)
                  .fill({})
                  .map((_, i) => {
                    return {
                      label: `Barangay ${i + 1}`,
                      value: `Barangay ${i + 1}`,
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
                  width: 300,
                  display: "flex",
                }}
                suffix={
                  <PlusOutlined
                    disabled={authorizedRepresentative?.length >= 3}
                    style={{
                      backgroundColor: "#eee",
                      padding: 10,
                      borderRadius: 100,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        authorizedRepresentative.filter((e) => e == _label)
                          .length > 0 ||
                        authorizedRepresentative?.length >= 3
                      )
                        return;

                      if (_label == "" || _label == null) {
                        message.warning("Can't add. Its empty dude");
                        return;
                      }
                      setAuthorizedRepresentative([
                        ...authorizedRepresentative,
                        _label,
                      ]);

                      _setLabel("");
                    }}
                  />
                }
              />

              {authorizedRepresentative.map((e, index) => (
                <div
                  style={{ display: "flex", flexDirection: "row" }}
                  key={index}
                >
                  <div
                    style={{
                      borderRadius: 100,
                      border: "1px solid rgb(255,0,0)",
                      backgroundColor: "rgba(255,0,0, 0.5)",
                      width: 30,
                      height: 30,
                      lineHeight: "30px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                    onClick={() =>
                      setAuthorizedRepresentative([
                        ...authorizedRepresentative.filter(
                          (_, i) => i != index
                        ),
                      ])
                    }
                  >
                    -
                  </div>
                  <div style={{ marginTop: 10 }}>{e}</div>
                </div>
              ))}
            </Form.Item>
            <Form.Item label="With SSS ?" name="withSSS">
              <Checkbox
                onChange={(e) => {
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      etc: { ...data.part1.etc, withSSS: e.target.checked },
                    },
                  });
                }}
                style={{ display: "flex" }}
              />
            </Form.Item>
            <Form.Item label="With Pension ?">
              <Checkbox
                value={data.part1.etc.withPension}
                onChange={(e) =>
                  setData({
                    ...data,
                    part1: {
                      ...data.part1,
                      etc: {
                        ...data.part1.etc,
                        withPension: e.target.checked,
                      },
                    },
                  })
                }
                style={{ display: "flex" }}
              />
            </Form.Item>
            {data.part1.etc.withPension && (
              <Form.Item label="Monthly Pension">
                <InputNumber
                  defaultValue={data.part1.etc.pensionMonthly}
                  formatter={(value) =>
                    `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\₱\s?|(,*)/g, "")}
                  style={{ width: 200 }}
                  onChange={(e) =>
                    setData({
                      ...data,
                      part1: {
                        ...data.part1,
                        etc: {
                          ...data.part1.etc,
                          pensionMonthly: e,
                        },
                      },
                    })
                  }
                  disabled={!data.part1.etc.withPension}
                />
              </Form.Item>
            )}
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
            <Form.Item label="Receive any form of pension ?">
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
                <Radio value={null}>Don't Know</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Pension/s receive in the past 6 months?">
              <Checkbox.Group
                options={[
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
                ]}
                style={{ display: "flex" }}
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      sourceIncomeInfo: {
                        ...data.part2.sourceIncomeInfo,
                        receivedPension6mos: e,
                      },
                    },
                  })
                }
              />
              <div style={{ display: "flex" }}>
                Others:{" "}
                <Input
                  style={{
                    width: 100,
                    border: "none",
                    borderBottom: "1px solid grey",
                    background: "#eee",
                    borderRadius: 0,
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item label="Sources of Income and Financial Support in the past 6 months? (other than pension/s)">
              <Table
                columns={[
                  {
                    title: "A. Sources",
                    dataIndex: "question",
                  },
                  {
                    title: "B. Is it regular?",
                    render: (_, row, index) => (
                      <Radio.Group
                        onChange={(e) => {
                          let keys = [
                            "salary",
                            "entrep",
                            "householdMember",
                            "domesticMember",
                            "internationalMember",
                            "fromFriends",
                            "fromGovernment",
                          ];
                          setData({
                            ...data,
                            part2: {
                              ...data.part2,
                              sourceIncomeInfo: {
                                ...data.part2.sourceIncomeInfo,
                                sourceOfIncome: {
                                  ...data.part2.sourceIncomeInfo.sourceOfIncome,
                                  [keys[index]]: {
                                    status: e.target.value,
                                    value:
                                      data.part2.sourceIncomeInfo
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
                    ),
                  },
                  {
                    title: "C. Income",
                    render: (_, row, index) => (
                      <>
                        Php{" "}
                        <Input
                          style={{ width: 100 }}
                          onChange={(e) => {
                            let keys = [
                              "salary",
                              "entrep",
                              "householdMember",
                              "domesticMember",
                              "internationalMember",
                              "fromFriends",
                              "fromGovernment",
                            ];
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
                    ),
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
                  // {
                  //   question: (
                  //     <>
                  //       Others <Input style={{ width: 150 }} />
                  //     </>
                  //   ),
                  // },
                ]}
                rowKey={(_) => _.question}
                pagination={false}
              />
            </Form.Item>
            <Form.Item label="Living With">
              <Radio.Group
                onChange={(e) =>
                  setData({
                    ...data,
                    part2: {
                      ...data.part2,
                      livingWith: e.target.value,
                    },
                  })
                }
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
                  person'sspouse
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
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Form.Item label="Where do you spend your Social Pension? "></Form.Item>
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
      id,
      name,
      middlename,
      lastname,
      extensionName,
      barangay,
    } = data.part1.seniorInfo;
    console.log(barangay);
    let updatedData = {
      //  PART 1
      name: { id, name, middlename, lastname, extensionName },
      gender,
      dateOfBirth,
      maritalStatus,
      contactNumber,
      barangay,
      motherMaidenName: { ...data.part1.mothersInfo },
      authorizedRepresentative,
      withSSS: data.part1.etc.withSSS,
      withPension: {
        status: data.part1.etc.withPension,
        value: data.part1.etc.pensionMonthly,
      },
      guardian: data.part1.guardian,
      // PART 2
      receivedPension: data.part2.sourceIncomeInfo.receivedPension,
      receivedPension6mos: data.part2.sourceIncomeInfo.receivedPension6mos,
      sourceOfIncome: { ...data.part2.sourceIncomeInfo.sourceOfIncome },
      livingWith: data.part2.livingWith,
      frailQuestion: { ...data.part2.frailQuestion },
      isPwd: { ...data.part2.isPwd },
      hasIllness: { ...data.part2.hasIllness },
      mealsPerDay: data.part2.mealsPerDay,
    };

    let res = await axios.post("/api/senior", {
      payload: {
        mode: "add-senior",
        senior: updatedData,
      },
    });

    console.log(res);
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
        if (e != "extension" && data.part1.seniorInfo[e] == "")
          missingFields.seniorInfo.push(e);
      });
      Object.keys(data.part1.mothersInfo).forEach((e) => {
        if (data.part1.mothersInfo[e] == "") missingFields.mothersInfo.push(e);
      });
      Object.keys(data.part1.guardian).forEach((e) => {
        if (data.part1.guardian[e] == "") missingFields.guardian.push(e);
      });

      if (missingFields.seniorInfo.length > 0) {
        message.error(
          `Please input missing fields. SENIOR (${missingFields.seniorInfo.join(
            ", "
          )})`
        );
        return;
      }
      if (missingFields.mothersInfo.length > 0) {
        message.error(
          `Please input missing fields. MOTHER (${missingFields.mothersInfo.join(
            ", "
          )})`
        );
        return;
      }
      if (missingFields.guardian.length > 0) {
        message.error(
          `Please input missing fields. GUARDIAN (${missingFields.guardian.join(
            ", "
          )})`
        );
        return;
      }
    }
    setCurrent(current + 1);
  };

  return (
    <Modal
      // title={"SENIOR CITIZEN INFORMATION REGISTRATION FORM"}
      open={open}
      onCancel={close}
      closable={false}
      width={800}
      style={{ top: 10 }}
      footer={
        current == 2 && (
          <Button type="primary" onClick={handleFinish}>
            Add Senior
          </Button>
        )
      }
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

export default AddSenior;
