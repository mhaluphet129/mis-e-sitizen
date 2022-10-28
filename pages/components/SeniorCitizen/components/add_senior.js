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
} from "antd";

const AddSenior = ({ open, close }) => {
  let [form] = Form.useForm();
  return (
    <Modal
      title={"SENIOR CITIZEN INFORMATION REGISTRATION FORM"}
      open={open}
      onCancel={close}
      closable={false}
      width={700}
      footer={<Button type="primary">Add Senior</Button>}
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
      >
        <Form.Item label="Senior Citizen ID No.">
          <Input />
        </Form.Item>
        <Form.Item label="First Name">
          <Input />
        </Form.Item>
        <Form.Item label="Middle Name (Optional)">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item label="Gender">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Date of Birth">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Age">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Barangay">
          <Input />
        </Form.Item>
        <Form.Item label="Address">
          <Input />
        </Form.Item>
        <Form.Item label="Contact Number">
          <Input />
        </Form.Item>
        <Form.Item label="With Pension ?">
          <Checkbox />
        </Form.Item>
        <Form.Item label="Monthly Pension">
          <InputNumber
            defaultValue={3000}
            formatter={(value) =>
              `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\₱\s?|(,*)/g, "")}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="active">Active</Radio>
              <Radio value="deceased">Deceased</Radio>
              <Radio value="health">Health</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Emergency Contact">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input placeholder="Name" />
            <Input placeholder="Contact Number" />
            <Input placeholder="Address" />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSenior;
