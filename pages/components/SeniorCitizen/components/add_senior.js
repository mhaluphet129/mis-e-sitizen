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
  message,
} from "antd";
import axios from "axios";

const AddSenior = ({ open, close, refresh }) => {
  const [pension, setPension] = useState({ withPension: false, pension: 3000 });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });
  let [form] = Form.useForm();

  const handleFinish = async (val) => {
    val = { ...val, pensionStatus: pension, emergencyContact };

    let { data } = await axios.post("/api/senior", {
      payload: {
        mode: "add-senior",
        senior: val,
      },
    });

    if (data.status == 200) {
      close();
      refresh();
      message.success(data.message);
    } else message.error(data.mesasge);
  };

  return (
    <Modal
      title={"SENIOR CITIZEN INFORMATION REGISTRATION FORM"}
      open={open}
      onCancel={close}
      closable={false}
      width={550}
      footer={
        <Button type="primary" onClick={form.submit}>
          Add Senior
        </Button>
      }
    >
      <Form
        form={form}
        labelCol={{
          flex: "110px",
        }}
        labelAlign="left"
        labelWrap
        wrapperCol={{
          flex: 1,
        }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Senior Citizen ID No."
          name="id"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="name"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Middle Name (Optional)" name="middlename">
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender" initialValue="male">
          <Radio.Group defaultValue="male">
            <Space>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Barangay"
          name="barangay"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact Number"
          name="contactInformation"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="With Pension ?">
          <Checkbox
            value={pension.withPension}
            onChange={(_) =>
              setPension((e) => {
                return { ...e, withPension: _.target.checked };
              })
            }
          />
        </Form.Item>
        <Form.Item label="Monthly Pension">
          <InputNumber
            defaultValue={3000}
            formatter={(value) =>
              `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\₱\s?|(,*)/g, "")}
            style={{ width: 200 }}
            onChange={(_) =>
              setPension((e) => {
                return { ...e, pension: _ };
              })
            }
            disabled={!pension.withPension}
          />
        </Form.Item>
        <Form.Item label="Status" name="status" initialValue="active">
          <Radio.Group defaultValue="active">
            <Space direction="vertical">
              <Radio value="active">Active</Radio>
              <Radio value="deceased">Deceased</Radio>
              <Radio value="health">Health</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Emergency Contact"
          name="emergencyContact"
          rules={[
            {
              required: true,
              message: "This is required.",
            },
          ]}
        >
          <Space direction="vertical" style={{ width: 300 }}>
            <Input
              placeholder="Name"
              onChange={(_) =>
                setEmergencyContact((e) => {
                  return { ...e, name: _.target.value };
                })
              }
              required
            />
            <Input
              placeholder="Contact Number"
              onChange={(_) =>
                setEmergencyContact((e) => {
                  return { ...e, contactNumber: _.target.value };
                })
              }
              required
            />
            <Input
              placeholder="Address"
              onChange={(_) =>
                setEmergencyContact((e) => {
                  return { ...e, address: _.target.value };
                })
              }
              required
            />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSenior;
