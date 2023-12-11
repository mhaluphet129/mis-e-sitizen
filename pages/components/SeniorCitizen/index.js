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
  message,
} from "antd";
import {
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
import Cookies from "js-cookie";

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
  const [openRepresentative, setOpenRepresentatives] = useState({
    open: false,
    data: null,
  });

  const barangay =
    Cookies.get("barangay") == "false" ? null : Cookies.get("barangay");

  const column = [
    {
      title: "Senior ID",
      width: 100,
      render: (_, row) => <Typography>{row?.name?.id}</Typography>,
    },
    {
      title: "Name",
      width: 230,
      render: (_, row) => (
        <Typography>
          {row?.name?.name}
          {row?.name?.middlename ? " " + row?.name?.middlename : ""}{" "}
          {row?.name?.lastname}{" "}
          {![null, undefined, ""].includes(row?.name?.extensionName)
            ? row?.name?.extensionName
            : ""}
        </Typography>
      ),
    },
    {
      title: "Barangay",
      width: 130,
      render: (_, row) => <Typography>{row?.barangay}</Typography>,
    },
    {
      title: "Gender",
      width: 90,
      render: (_, row) => <Typography>{row?.gender}</Typography>,
    },
    {
      title: "Age",
      width: 70,
      align: "center",
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
      title: "Status",
      width: 160,
      render: (_, row) => (
        <Tag
          color={
            row?.status == "ACTIVE"
              ? "green"
              : row?.status == "DECEASED"
              ? "red"
              : row?.status == "ACTIVE_WITH_ILLNESS"
              ? "yellow"
              : null
          }
        >
          {row?.status}
        </Tag>
      ),
    },
    {
      title: "Pensioner Type",
      width: 100,
      align: "center",
      render: (_, row) =>
        row?.pensionerType == "social" ? (
          <Tag color="green">Social</Tag>
        ) : row?.pensionerType == "private" ? (
          <Tag color="blue">Private</Tag>
        ) : row?.pensionerType == "none" ? (
          <Tag color="grey">For Validation</Tag>
        ) : (
          <Typography.Text type="secondary" italic>
            No Data``
          </Typography.Text>
        ),
    },
    {
      title: "Representative(s)",
      width: 160,
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
                if (
                  __?.pensionerType == "none" ||
                  __?.pensionerType == "private"
                ) {
                  message.warning(
                    "Cannot add new release to for validation or private pension type senior"
                  );
                  return;
                }

                setOpenModal({ open: true, id: __?._id });
              }}
              icon={<FileAddOutlined />}
            />
          </Tooltip>
          <Tooltip title="Edit Senior">
            <Button
              icon={<EditOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUpdateSenior({ open: true, data: __ });
              }}
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
            <Typography.Text mark>{`${i + 1}.`}</Typography.Text> {item.name} |{" "}
            {item.contactNumber} | {item.relationship}
          </List.Item>
        )}
      />
    </Modal>
  );

  useEffect(() => {
    setLoading(true);
    (async () => {
      let { data } = await axios.get("/api/senior", {
        params: { mode: "fetch-all", search: _searchName, barangay },
      });
      if (data.status == 200) {
        setLoading(false);
        setSeniors(data.senior);
      } else {
        message.error(data?.message ?? "Error in the Server.");
        setLoading(false);
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
      </Space>
      <Table
        dataSource={seniors}
        columns={column}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 500 }}
        rowKey={(row) => row._id}
        style={{ width: 1400 }}
        onRow={(data) => {
          return {
            onClick: () => setOpenHistory({ open: true, id: data?._id }),
          };
        }}
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
      />
      <History
        open={openHistory.open}
        close={() => {
          setOpenHistory({ open: false, data: null });
        }}
        id={openHistory.id}
        refresh={() => {
          setTrigger(trigger + 1);
        }}
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
