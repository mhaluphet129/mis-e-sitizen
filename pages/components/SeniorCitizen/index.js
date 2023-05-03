import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Tag,
  Typography,
  Space,
  Tooltip,
  AutoComplete,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  AddSenior,
  UpdateSenior,
  Filter,
  History,
  AddHistory,
} from "./components";
import axios from "axios";

const AdminPage = () => {
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSenior, setUpdateSenior] = useState({ open: false, data: null });
  const [seniors, setSeniors] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [_searchName, setSearchName] = useState("");
  const timerRef = useRef(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState({});

  const column = [
    {
      title: "Senior ID",
      render: (_, row) => <Typography>{row?.id}</Typography>,
    },
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
      title: "With SSS ?",
      width: 100,
      align: "center",
      render: (_, row) =>
        row?.withSSS ? (
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
      render: (_, __, ___) => (
        <Space>
          <Tooltip title="View History">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpenHistory(true);
              }}
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="Add History">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}
              icon={<FileAddOutlined />}
              disabled
            />
          </Tooltip>
          <Tooltip title="Edit Senior">
            <Button icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const searchName = async (keyword) => {
    if (keyword != "" && keyword != null) {
      let { data } = await axios.get("/api/senior", {
        params: {
          mode: "search-senior",
          searchKeyword: keyword,
        },
      });
      if (data.status == 200) {
        setSeniors(data.searchData);
        setLoading(false);
      }
    }
  };

  const runTimer = (key) => {
    setLoading(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(function () {
      searchName(key);
    }, 500);
  };

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/senior", {
        params: { mode: "fetch-all", search: _searchName },
      });
      if (data.status == 200) setSeniors(data.senior);
    })();
  }, [trigger]);

  return (
    <div>
      <Space style={{ marginBottom: 5 }}>
        <Button onClick={() => setShowAddSenior(true)}>Add Senior</Button>
        <AutoComplete
          style={{
            width: 200,
          }}
          loading={loading}
          placeholder="Search by name"
          filterOption={(inputValue, option) =>
            option.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={(_) => {
            runTimer(_);
            if (_?.length <= 0) {
              setSearchName("");
              setLoading(false);
              setTrigger(trigger + 1);
            }
          }}
          autoFocus
          allowClear
        />
        <Button icon={<SearchOutlined />} />
        <Tooltip title="More options">
          <Button
            onClick={() => setOpenFilter(true)}
            icon={<SettingOutlined />}
          />
        </Tooltip>
        <Typography>
          Gender: <Tag>{filter?.gender ?? ""}</Tag> Age:{" "}
          <Tag>
            {filter?.ageRange?.from ?? ""}-{filter?.ageRange?.to ?? ""}
          </Tag>{" "}
          Pension:{" "}
          <Tag>
            {" "}
            {filter?.withPension ? <CheckOutlined /> : <CloseOutlined />}
          </Tag>
          SSS:{" "}
          <Tag> {filter?.withSSS ? <CheckOutlined /> : <CloseOutlined />}</Tag>
          Status:{" "}
          <Tag>
            {filter?.status?.length != 0 ? filter?.status?.join(", ") : ""}
          </Tag>
          Address: <Tag>{filter?.address ?? ""}</Tag>
        </Typography>
      </Space>
      <Table
        dataSource={seniors}
        columns={column}
        onRow={(data) => {
          return {
            onClick: () => setUpdateSenior({ open: true, data }),
          };
        }}
        loading={loading}
        pagination={false}
        scroll={{ y: 500 }}
        rowKey={(row) => row._id}
      />
      <AddSenior
        open={showAddSenior}
        close={() => setShowAddSenior(false)}
        refresh={() => setTrigger(trigger + 1)}
      />
      <UpdateSenior
        open={updateSenior.open}
        close={() =>
          setUpdateSenior((e) => {
            return { open: false, data: { ...e.data } };
          })
        }
        updateOpen={() =>
          setUpdateSenior((e) => {
            return { open: true, data: { ...e.data } };
          })
        }
        data={updateSenior.data}
        refresh={() => setTrigger(trigger + 1)}
      />
      <Filter
        open={openFilter}
        close={() => setOpenFilter(false)}
        setSenior={(data) => {
          if (data != null) setSeniors(data);
          else setTrigger(trigger + 1);
        }}
        setFilter={(e) => setFilter(e)}
      />
      <History
        open={openHistory}
        close={() => {
          setOpenHistory(false);
        }}
        id="09"
      />
      <AddHistory open={openModal} close={() => setOpenModal(false)} />
    </div>
  );
};

export default AdminPage;
