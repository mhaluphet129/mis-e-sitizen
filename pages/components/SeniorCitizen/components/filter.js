import React, { useState } from "react";
import { CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons";
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
  message,
} from "antd";
import axios from "axios";

const Filter = ({ open, close, setSenior }) => {
  const [minAge, setMinAge] = useState(60);
  const [ageRange, setAgeRange] = useState({ from: 60, to: 90 });
  const [withPension, setWithPension] = useState(false);
  const [reset, setReset] = useState(false);
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      onOk={close}
      title="Filter Search"
      footer={[
        <Button
          onClick={() => {
            setReset(true);
            close();
            setSenior(null);
          }}
        >
          Reset
        </Button>,
        <Button type="primary" icon={<CheckOutlined />} onClick={form.submit}>
          Apply Filter
        </Button>,
      ]}
      destroyOnClose={reset}
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
        form={form}
        onFinish={async (val) => {
          val = { ...val, ageRange, withPension };
          let { data } = await axios.get("/api/senior", {
            params: {
              mode: "filter-senior",
              filter: JSON.stringify(val),
            },
          });

          if (data.status == 200) {
            message.success("Search done.");
            close();
            setSenior(data.searchData);
          }
        }}
      >
        <Form.Item label="By Gender:" name="gender">
          <Radio.Group>
            <Space>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={
            <div>
              By Age:{" "}
              <Tooltip title="test">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          }
        >
          <InputNumber
            width={30}
            defaultValue={60}
            onChange={(e) => {
              setMinAge(e);
              setAgeRange((_) => {
                return { ..._, from: e };
              });
            }}
          />{" "}
          -{" "}
          <InputNumber
            width={30}
            defaultValue={90}
            min={minAge}
            onChange={(e) => {
              setAgeRange((_) => {
                return { ..._, to: e };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="With Pension:" name="withPension">
          <Checkbox
            onChange={(e) => {
              setWithPension(e.target.checked);
            }}
          />
        </Form.Item>
        <Form.Item label="By Address:" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="By status:" name="status">
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
