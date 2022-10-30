import React, { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import {
  Modal,
  Button,
  Input,
  Form,
  Space,
  Radio,
  InputNumber,
  Tooltip,
  Checkbox,
  Select,
} from "antd";

const Filter = ({ open, close }) => {
  const [minAge, setMinAge] = useState(60);

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      onOk={close}
      title="Filter"
      footer={[
        <Button type="primary" icon={<CheckOutlined />}>
          Apply Filter
        </Button>,
      ]}
    >
      <Form
        labelCol={{
          flex: "110px",
        }}
        labelAlign="left"
        wrapperCol={{
          flex: 1,
        }}
        colon={false}
      >
        <Form.Item label="By Gender:">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="By Age:">
          <Tooltip
            trigger={["focus"]}
            title="You can enter specific only if other input is blank"
          >
            <InputNumber
              width={30}
              defaultValue={60}
              onChange={(e) => setMinAge(e)}
            />{" "}
          </Tooltip>
          -{" "}
          <Tooltip trigger={["focus"]}>
            <InputNumber width={30} defaultValue={90} min={minAge} />
          </Tooltip>
        </Form.Item>
        <Form.Item label="With Pension:">
          <Checkbox />
        </Form.Item>
        <Form.Item label="By status:">
          <Select
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="You can select 1 or more"
          >
            {/* sample only */}
            <Select.Option key="active">Active</Select.Option>
            <Select.Option key="deceased">Deceased</Select.Option>
            <Select.Option key="health">Health</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Filter;
