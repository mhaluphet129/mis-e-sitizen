import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import axios from "axios";

const StatusChange = ({ open, close, value, refresh }) => {
  const [status, setStatus] = useState(value?.status);

  const handleUpdate = () => {
    (async (_) => {
      let { data } = await axios.get("/api/senior", {
        params: {
          mode: "update-status",
          id: value._id,
          status,
        },
      });

      if (data.status == 200) {
        message.success("Update successfully");
        refresh();
        close();
      } else message.error("Error in the server");
    })(axios);
  };

  useEffect(() => {
    setStatus(value?.status);
  }, [value]);

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={[
        <Button onClick={handleUpdate} disabled={value?.status == status}>
          UPDATE
        </Button>,
      ]}
      closable={false}
      title="Update Status"
    >
      <Select
        value={status}
        style={{
          width: "100%",
        }}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Deceased", value: "DECEASED" },
          { label: "Active with Illness", value: "ACTIVE_WITH_ILLNESS" },
        ]}
        onChange={(e) => setStatus(e)}
      />
    </Modal>
  );
};

export default StatusChange;
