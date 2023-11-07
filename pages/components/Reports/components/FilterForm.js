import React, { useEffect, useState } from "react";
import { Modal, Select, Checkbox, Space, Button } from "antd";
import JASON from "../../../assets/json/constant.json";

const FilterForm = ({
  title,
  open,
  close,
  submit,
  checkValues,
  setCheckValues,
}) => {
  const [barangay, setBarangay] = useState("");
  const [enabledOptions, setEnabledOptions] = useState([]);
  const options = [
    { label: "Active", value: "ACTIVE" },
    { label: "Active with Illness", value: "ACTIVE_WITH_ILLNESS" },
    { label: "Deceased", value: "DECEASED" },
  ];
  const options2 = [
    { label: "Social", value: "social" },
    { label: "Private", value: "private" },
    { label: "None", value: "none" },
  ];

  const reset = () => {
    setCheckValues(["ACTIVE"]);
    setBarangay("");
  };

  useEffect(() => {
    if (title == "Living Status") setEnabledOptions(options);
    else setEnabledOptions(options2);
  }, [title]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        reset();
        close();
      }}
      footer={[
        <Button key="btn-1" onClick={reset}>
          Clear All
        </Button>,
        <Button
          key="btn-2"
          type="primary"
          onClick={() => {
            let obj = {};
            if (checkValues.length != 0) obj.status = checkValues;
            if (barangay != "") obj.barangay = barangay;
            submit(obj);
            reset();
            close();
          }}
        >
          Apply Filter
        </Button>,
      ]}
      destroyOnClose
    >
      <Select
        showSearch
        value={barangay}
        placeholder="Select a barangay"
        optionFilterProp="children"
        style={{ width: 250, display: "flex", textAlign: "start" }}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={JASON.barangay.map((_, i) => {
          return {
            label: _,
            value: _,
          };
        })}
        onChange={(v) => setBarangay(v)}
        allowClear
      />
      <Checkbox.Group
        defaultValue={checkValues}
        value={checkValues}
        onChange={(v) => setCheckValues(v)}
        style={{ marginTop: 10 }}
      >
        <Space direction="vertical">
          {enabledOptions.map((e, i) => (
            <Checkbox key={`checkbox_${i}`} value={e.value}>
              {e.label}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </Modal>
  );
};

export default FilterForm;
