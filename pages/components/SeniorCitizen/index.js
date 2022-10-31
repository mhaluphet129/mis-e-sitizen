import React, { useState, useEffect } from "react";
import { Button, Table, Tag, Typography, Space, Input, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { AddSenior, UpdateSenior, Filter } from "./components";
import axios from "axios";

const AdminPage = () => {
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [updateSenior, setUpdateSenior] = useState({ open: false, data: null });
  const [seniors, setSeniors] = useState([]);
  const [trigger, setTrigger] = useState(0);

  const column = [
    {
      title: "Name",
      render: (_, row) => (
        <Typography>
          {row.name}
          {row?.middlename ? " " + row?.middlename : ""} {row.lastname}
        </Typography>
      ),
    },
    {
      title: "Address",
      render: (_, row) => <Typography>{row.address}</Typography>,
    },
    {
      title: "Gender",
      width: 150,
      align: "center",
      render: (_, row) => <Typography>{row?.gender}</Typography>,
    },
    {
      title: "Age",
      width: 50,
      render: (_, row) => <Typography>{row.age}</Typography>,
    },
    {
      title: "With Pension ?",
      width: 100,
      align: "center",
      render: (_, row) =>
        row?.pensionStatus?.withPension ? (
          <CheckOutlined style={{ color: "#42ba96" }} />
        ) : (
          <CloseOutlined style={{ color: "#ff0000" }} />
        ),
    },
    {
      title: "Status",
      width: 150,
      align: "center",
      render: (_, row) => <Tag>{row.status}</Tag>,
    },

    {
      title: "Function",
      align: "center",
      width: 150,
      render: () => <Button icon={<SettingOutlined />}>Update</Button>,
    },
  ];

  useEffect(async () => {
    let { data } = await axios.get("/api/senior");
    if (data.status == 200) setSeniors(data.senior);
  }, [trigger]);
  return (
    <div>
      <Space style={{ marginBottom: 5 }}>
        <Button onClick={() => setShowAddSenior(true)}>Add Senior</Button>
        <Input placeholder="Search by name" />
        <Input placeholder="Search by address" />
        <Button icon={<SearchOutlined />} />
        <Tooltip title="More options">
          <Button onClick={() => setOpenFilter(true)}>...</Button>
        </Tooltip>
      </Space>
      <Table
        dataSource={seniors}
        columns={column}
        onRow={(data) => {
          return {
            onClick: () => setUpdateSenior({ open: true, data }),
          };
        }}
        rowKey={(row) => row._id}
      />
      <AddSenior
        open={showAddSenior}
        close={() => setShowAddSenior(false)}
        refresh={() => setTrigger(trigger + 1)}
      />
      <UpdateSenior
        open={updateSenior.open}
        close={() => setUpdateSenior({ open: false, data: null })}
        data={updateSenior.data}
        refresh={() => setTrigger(trigger + 1)}
      />
      <Filter open={openFilter} close={() => setOpenFilter(false)} />
    </div>
  );
};

export default AdminPage;
