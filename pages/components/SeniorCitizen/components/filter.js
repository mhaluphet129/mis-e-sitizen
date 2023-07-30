import React, { useState } from "react";
import { CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Modal,
  Button,
  Form,
  Space,
  Radio,
  InputNumber,
  Tooltip,
  Select,
  message,
} from "antd";
import axios from "axios";

import json from "../../../assets/json/constant.json";

const Filter = ({ open, close, setSenior, setFilter }) => {
  const [minAge, setMinAge] = useState(60);
  const [ageRange, setAgeRange] = useState({ from: 60, to: 90 });
  const [pensionerType, setPensionerType] = useState(null);
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
          key="key 1"
          onClick={() => {
            setReset(true);
            setSenior(null);
            setPensionerType(null);
            setFilter({});
            form.resetFields();
            close();
          }}
        >
          Reset
        </Button>,
        <Button
          key="key 2"
          type="primary"
          icon={<CheckOutlined />}
          onClick={form.submit}
        >
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
          console.log(val);
          val = { ...val, ageRange };

          if (pensionerType != null) val = { ...val, pensionerType };
          setFilter(val);

          let { data } = await axios.get("/api/senior", {
            params: {
              mode: "filter-senior",
              filter: JSON.stringify(val),
            },
          });

          if (data.status == 200) {
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
        <Form.Item label="Pensioner Type:" name="pensionerType">
          <Select
            onChange={(e) => {
              setPensionerType(e);
            }}
          >
            {["social", "private"].map((_) => (
              <Select.Option key={_}>{_.toUpperCase()}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="By Address:" name="address">
          <Select
            mode="multiple"
            placeholder="You can select 1 or more"
            allowClear
            style={{
              width: "100%",
            }}
          >
            {json.barangay.map((_) => (
              <Select.Option key={_}>{_}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="By status:" name="status">
          <Select
            mode="multiple"
            placeholder="You can select 1 or more"
            allowClear
            style={{
              width: "100%",
            }}
          >
            <Select.Option key="ACTIVE">Active</Select.Option>
            <Select.Option key="DECEASED">Deceased</Select.Option>
            <Select.Option key="ACTIVE_WITH_ILLNESS">
              Actve with Illness
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Filter;
