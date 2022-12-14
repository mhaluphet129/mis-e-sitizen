import React, { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Space,
  Form,
  Input,
  Radio,
  InputNumber,
  DatePicker,
  Checkbox,
  Modal,
  message,
} from "antd";
import moment from "moment";
import axios from "axios";
import { History } from "../components";

const UpdateSenior = ({ open, close, data, refresh, updateOpen }) => {
  const [edited, setEdited] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [inputData, setInputData] = useState({
    id: "",
    name: "",
    middlename: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    barangay: "",
    address: "",
    contactInformation: "",
    pensionStatus: {
      withPension: null,
      monthlyPension: null,
    },
    status: "",
    emergencyContact: {
      name: "",
      contactNumber: "",
      address: "",
    },
  });

  const handleSave = async () => {
    let res = await axios.post("/api/senior", {
      payload: {
        mode: "update-senior",
        data: inputData,
        id: data._id,
      },
    });

    if (res.data.status == 200) {
      close();
      refresh();
      message.success(res.data.message);
    } else message.error(res.data.message);
  };

  useEffect(() => {
    setInputData(data);
  }, [data]);

  return (
    <>
      <Drawer
        open={open}
        onClose={close}
        width={500}
        title=" "
        extra={[
          <Space key="key 1">
            <Button
              type="link"
              onClick={() => {
                setOpenHistory(true);
                close();
              }}
            >
              View History
            </Button>
            <Button type="primary" disabled={!edited} onClick={handleSave}>
              SAVE
            </Button>
            <Button
              type="danger"
              onClick={() => {
                Modal.confirm({
                  title: "are you sure ?",
                  okText: "Confirm",
                  onOk: () => alert("sanaol"),
                });
              }}
            >
              DELETE
            </Button>
          </Space>,
        ]}
        closable={false}
      >
        <Form
          onChange={() => setEdited(true)}
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
          colon={false}
        >
          <Form.Item label="Senior Citizen ID No.">
            <Input
              value={inputData?.id || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, id: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="First Name">
            <Input
              value={inputData?.name || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, name: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Middle Name (Optional)">
            <Input
              value={inputData?.middlename || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, middlename: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              value={inputData?.lastname || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, lastname: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group
              value={inputData?.gender || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, gender: e.target.value };
                });
              }}
            >
              <Space>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Date of Birth">
            <DatePicker
              defaultValue={moment(inputData?.dateOfBirth)}
              format="MMM DD YYYY"
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, dateOfBirth: e };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Age">
            <InputNumber
              value={inputData?.age || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, age: e };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Barangay">
            <Input
              value={inputData?.barangay || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, barangay: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              value={inputData?.address || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, address: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Contact Number">
            <Input
              value={inputData?.contactInformation || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, contactInformation: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="With Pension ?">
            <Checkbox
              checked={inputData?.pensionStatus?.withPension || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return {
                    ..._,
                    pensionStatus: {
                      ..._.pensionStatus,
                      withPension: e.target.checked,
                    },
                  };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Monthly Pension">
            <InputNumber
              defaultValue={inputData?.pensionStatus?.monthlyPension || ""}
              formatter={(value) =>
                `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\₱\s?|(,*)/g, "")}
              style={{ width: 200 }}
              disabled={!inputData?.pensionStatus?.withPension}
              onChange={(e) => {
                setInputData((_) => {
                  return {
                    ..._,
                    pensionStatus: {
                      ..._.pensionStatus,
                      monthlyPension: e,
                    },
                  };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Radio.Group
              value={inputData?.status || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, status: e.target.value };
                });
              }}
            >
              <Space direction="vertical">
                <Radio value="active">Active</Radio>
                <Radio value="deceased">Deceased</Radio>
                <Radio value="health">Health</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Emergency Contact">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Name"
                value={inputData?.emergencyContact?.name || ""}
                onChange={(e) => {
                  setInputData((_) => {
                    return {
                      ..._,
                      emergencyContact: {
                        ..._.emergencyContact,
                        name: e.target.value,
                      },
                    };
                  });
                }}
              />
              <Input
                placeholder="Contact Number"
                value={inputData?.emergencyContact?.contactNumber || ""}
                onChange={(e) => {
                  setInputData((_) => {
                    return {
                      ..._,
                      emergencyContact: {
                        ..._.emergencyContact,
                        contactNumber: e.target.value,
                      },
                    };
                  });
                }}
              />
              <Input
                placeholder="Address"
                value={inputData?.emergencyContact?.address || ""}
                onChange={(e) => {
                  setInputData((_) => {
                    return {
                      ..._,
                      emergencyContact: {
                        ..._.emergencyContact,
                        address: e.target.value,
                      },
                    };
                  });
                }}
              />
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
      <History
        open={openHistory}
        close={() => {
          setOpenHistory(false);
          updateOpen();
        }}
        id="09"
      />
    </>
  );
};

export default UpdateSenior;
