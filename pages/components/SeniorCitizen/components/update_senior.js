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
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
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
              danger
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
              value={inputData?.name.id || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, id: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="First Name">
            <Input
              value={inputData?.name.name || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, name: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Middle Name (Optional)">
            <Input
              value={inputData?.name.middlename || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, middlename: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              value={inputData?.name.lastname || ""}
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
              defaultValue={dayjs(
                dayjs(inputData?.dateOfBirth).format("YYYY/MM/DD"),
                "YYYY/MM/DD"
              )}
              format={"MMM DD, YYYY"}
            />
          </Form.Item>
          <Form.Item label="Barangay">
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              value={inputData?.barangay}
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
              allowClear
            />
          </Form.Item>
          <Form.Item label="Contact Number">
            <Input
              value={inputData?.contactNumber || ""}
              onChange={(e) => {
                setInputData((_) => {
                  return { ..._, contactInformation: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="With SSS ?">
            <Checkbox
              checked={inputData?.withSSS || ""}
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
          <Form.Item label="With Pension ?">
            <Checkbox
              checked={inputData?.withPension.status || ""}
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
              value={inputData?.withPension.value || ""}
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
