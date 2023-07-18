import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Tag,
  Typography,
  Space,
  Tooltip,
  AutoComplete,
  List,
  Modal,
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
import dayjs from "dayjs";

const AdminPage = () => {
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSenior, setUpdateSenior] = useState({ open: false, data: null });
  const [seniors, setSeniors] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [_searchName, setSearchName] = useState("");
  const timerRef = useRef(null);
  const [openHistory, setOpenHistory] = useState({ open: false, data: null });
  const [openModal, setOpenModal] = useState({ open: false, id: null });
  const [filter, setFilter] = useState({});
  const [openRepresentative, setOpenRepresentatives] = useState({
    open: false,
    data: null,
  });

  const column = [
    {
      title: "Senior ID",
      render: (_, row) => <Typography>{row?.name?.id}</Typography>,
    },
    {
      title: "Name",
      render: (_, row) => (
        <Typography>
          {row?.name?.name}
          {row?.name?.middlename ? " " + row?.name?.middlename : ""}{" "}
          {row?.name?.lastname}
        </Typography>
      ),
    },
    {
      title: "Barangay",
      render: (_, row) => <Typography>{row?.barangay}</Typography>,
    },
    {
      title: "Gender",
      width: 150,
      align: "center",
      render: (_, row) => <Typography>{row?.gender}</Typography>,
    },
    {
      title: "Age",
      width: 100,
      render: (_, row) => (
        <Typography>
          {dayjs().diff(
            dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
            "years",
            false
          )}
        </Typography>
      ),
    },
    {
      title: "Social Pensioner",
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
      title: "Private Pensioner",
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
      title: "Representative(s)",
      width: 150,
      align: "center",
      render: (_, row) => (
        <Typography.Link
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenRepresentatives({
              open: true,
              data: row?.authorizedRepresentative,
            });
          }}
        >
          Click to view
        </Typography.Link>
      ),
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
                setOpenHistory({ open: true, id: __?._id });
              }}
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="New Release">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal({ open: true, id: __?._id });
              }}
              icon={<FileAddOutlined />}
            />
          </Tooltip>
          <Tooltip title="Edit Senior">
            <Button
              icon={<EditOutlined />}
              onClick={() => setUpdateSenior({ open: true, data: __ })}
            />
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

  const RepresentativeList = () => (
    <Modal
      open={openRepresentative.open}
      closable={false}
      title={null}
      footer={null}
      onCancel={() => setOpenRepresentatives({ open: false, data: null })}
    >
      <List
        header="List of all authorized representative(s)"
        footer={`Total of: ${openRepresentative.data?.length ?? 0}`}
        bordered
        dataSource={openRepresentative.data ?? []}
        renderItem={(item, i) => (
          <List.Item>
            <Typography.Text mark>{`${i + 1}.`}</Typography.Text> {item}
          </List.Item>
        )}
      />
    </Modal>
  );

  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/senior", {
        params: { mode: "fetch-all", search: _searchName },
      });
      if (data.status == 200) {
        setSeniors(data.senior);
      }
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
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 500 }}
        rowKey={(row) => row._id}
        style={{ width: 1200 }}
      />
      <RepresentativeList />
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
        refresh={() => setTrigger(trigger + 1)}
        id={updateSenior.data?._id}
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
        open={openHistory.open}
        close={() => {
          setOpenHistory({ open: false, data: null });
        }}
        id={openHistory.id}
      />
      <AddHistory
        open={openModal.open}
        close={() => setOpenModal({ open: false, id: null })}
        id={openModal.id}
      />
    </div>
  );
};

export default AdminPage;
