import React, { useState } from "react";
import { Button, Table, Tag, Typography, Space, Select } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { AddSenior, UpdateSenior, Filter } from "./components";

const AdminPage = () => {
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [updateSenior, setUpdateSenior] = useState({ open: false, data: null });

  const dummyData = [
    {
      name: "Lata1",
      lastname: "Cayetuna",
      email: "cayetunatuna@gmail.com",
      address: "kalibangon",
      status: "active",
      gender: "Female",
      age: 81,
      pensionStatus: {
        withPension: true,
      },
    },
  ];

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
      width: 150,
      align: "center",
      render: () => <Button icon={<SettingOutlined />}>Update</Button>,
    },
  ];
  return (
    <div>
      <Space style={{ marginBottom: 5 }}>
        <Button onClick={() => setShowAddSenior(true)}>Add Senior</Button>
        <Button onClick={() => setOpenFilter(true)}>Filter</Button>
      </Space>
      <Table
        dataSource={dummyData}
        columns={column}
        onRow={(data) => {
          return {
            onClick: () => setUpdateSenior({ open: true, data }),
          };
        }}
      />
      <AddSenior open={showAddSenior} close={() => setShowAddSenior(false)} />
      <UpdateSenior
        open={updateSenior.open}
        close={() => setUpdateSenior({ open: false, data: null })}
        data={updateSenior.data}
      />
      <Filter open={openFilter} close={() => setOpenFilter(false)} />
    </div>
  );
};

export default AdminPage;
