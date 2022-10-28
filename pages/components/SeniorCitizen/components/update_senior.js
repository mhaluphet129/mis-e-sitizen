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
} from "antd";
import moment from "moment";

const UpdateSenior = ({ open, close, data }) => {
  const [edited, setEdited] = useState(false);
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

  useEffect(() => {
    setInputData(data);
  }, [data]);

  return (
    <>
      <Drawer
        open={open}
        onClose={close}
        width={500}
        title="Update Senior Citizen Information"
        extra={[
          <Space>
            <Button type="primary" disabled={!edited}>
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
            <Input value={inputData?.id || ""} />
          </Form.Item>
          <Form.Item label="First Name">
            <Input value={inputData?.name || ""} />
          </Form.Item>
          <Form.Item label="Middle Name (Optional)">
            <Input value={inputData?.middlename || ""} />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input value={inputData?.lastname || ""} />
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group value={inputData?.gender || ""}>
              <Space direction="vertical">
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Date of Birth">
            <DatePicker
            // value={
            //   moment(inputData?.dateOfBirth).format("MM/DD/YYYY") ||
            //   moment().format("MM/DD/YYYY")
            // }
            // format="MM/DD/YYYY"
            />
          </Form.Item>
          <Form.Item label="Age">
            <InputNumber value={inputData?.age || ""} />
          </Form.Item>
          <Form.Item label="Barangay">
            <Input value={inputData?.barangay || ""} />
          </Form.Item>
          <Form.Item label="Address">
            <Input value={inputData?.address || ""} />
          </Form.Item>
          <Form.Item label="Contact Number">
            <Input value={inputData?.contactInformation || ""} />
          </Form.Item>
          <Form.Item label="With Pension ?">
            <Checkbox checked={inputData?.pensionStatus?.withPension || ""} />
          </Form.Item>
          <Form.Item label="Monthly Pension">
            <InputNumber
              defaultValue={inputData?.pensionStatus?.monthlyPension || ""}
              formatter={(value) =>
                `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\₱\s?|(,*)/g, "")}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Radio.Group value={inputData?.status || ""}>
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
              />
              <Input
                placeholder="Contact Number"
                value={inputData?.emergencyContact?.contactNumber || ""}
              />
              <Input
                placeholder="Address"
                value={inputData?.emergencyContact?.address || ""}
              />
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateSenior;
