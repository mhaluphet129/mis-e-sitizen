import React, { useState } from "react";
import { Button, Table, Tag, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import { AddAdmin, UpdateAdmin } from "./components";

const AdminPage = () => {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [updateAdmin, setUpdateAdmin] = useState({ open: false, data: null });

  const dummyData = [
    {
      name: "Lata",
      lastname: "Cayetuna",
      email: "cayetunatuna@gmail.com",
      role: "Admin",
    },
  ];

  const column = [
    {
      title: "Name",
      render: (_, row) => (
        <Typography>
          {row.name} {row.lastname}
        </Typography>
      ),
    },
    {
      title: "Role",
      render: (_, row) => <Tag color="blue">{row.role}</Tag>,
    },
    {
      title: "Email",
      render: (_, row) => <Typography>{row.email}</Typography>,
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
      <Button onClick={() => setShowAddAdmin(true)}>Add Admin</Button>
      <Table
        dataSource={dummyData}
        columns={column}
        onRow={(data) => {
          return {
            onClick: () => setUpdateAdmin({ open: true, data }),
          };
        }}
      />
      <AddAdmin open={showAddAdmin} close={() => setShowAddAdmin(false)} />
      <UpdateAdmin
        open={updateAdmin.open}
        close={() => setUpdateAdmin({ open: false, data: null })}
        data={updateAdmin.data}
      />
    </div>
  );
};

export default AdminPage;
