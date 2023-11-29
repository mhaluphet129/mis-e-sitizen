import React, { useEffect, useState } from "react";
import { Modal, Select, Button } from "antd";
import jason from "../../../assets/json/constant.json";

const FilterFormBarangay = ({ open, close, selectedBarangay }) => {
  const [_, __] = useState("");

  useEffect(() => {
    if (open) {
      __("");
    }
  }, [open]);

  return (
    <Modal
      title="Select Barangay"
      closable={false}
      footer={null}
      open={open}
      onCancel={close}
      destroyOnClose
    >
      <Select
        options={jason.barangay.map((e) => {
          return {
            value: e,
            label: e,
          };
        })}
        onChange={(e) => __(e)}
        style={{ width: 300 }}
      />
      <Button
        onClick={() => {
          selectedBarangay(_);
          close();
        }}
        style={{ marginLeft: 10 }}
      >
        Generate
      </Button>
    </Modal>
  );
};

export default FilterFormBarangay;
