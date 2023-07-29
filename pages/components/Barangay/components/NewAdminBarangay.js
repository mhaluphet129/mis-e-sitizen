import React, { useRef, useState } from "react";
import { AutoComplete, Modal, Button, Space, message } from "antd";

import axios from "axios";

const NewAdminBarangay = ({ open, close, refresh, barangay }) => {
  const searchRef = useRef();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedtedAdmin, setSelectedAdmin] = useState("");
  const [adminOptions, setAdminOptions] = useState([]);
  const [value, setValue] = useState();

  const search = (_) => {
    setIsSearching(true);
    setValue(_);
    setSelectedAdmin("");
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      searchName(_);
    }, 500);
  };

  const searchName = (a) => {
    if (![null, ""].includes(a)) {
      (async (_) => {
        let { data } = await _.get("/api/barangay", {
          params: {
            mode: "fetch-senior-specific",
            searchKeyword: a,
          },
        });
        if (data.status == 200) setAdminOptions(data.data);
      })(axios);
    } else {
      setAdminOptions([]);
      setIsSearching(false);
    }
  };

  const handleAddAdmin = () => {
    if (selectedtedAdmin == "") {
      message.warning("Select an admin to proceed");
      return;
    }

    (async (_) => {
      let { data } = await _.get("/api/barangay", {
        params: {
          mode: "check-and-add-admin",
          id: selectedtedAdmin,
          barangay,
        },
      });

      if (data.status == 201) message.warning(data.message);
      else if (data.status == 200) {
        message.success(data.message);
        refresh();
      }
    })(axios);
  };

  return (
    <Modal
      title="Add Barangay Admin"
      open={open}
      onCancel={close}
      closable={false}
      footer={null}
      destroyOnClose
    >
      <Space>
        <AutoComplete
          options={adminOptions?.map((_) => {
            return {
              label: `${_?.name} ${_?.lastname} (${_?.email})`,
              value: _?._id,
            };
          })}
          value={value}
          onChange={(e) => search(e)}
          onSelect={(e) => {
            setSelectedAdmin(e);
            let admin = adminOptions?.filter((_) => _._id == e)[0];
            setValue(admin.name + " " + admin.lastname);
          }}
          style={{
            width: 400,
          }}
          loading={isSearching}
          allowClear
          autoFocus
        />
        <Button type="primary" onClick={handleAddAdmin}>
          ADD
        </Button>
      </Space>
    </Modal>
  );
};

export default NewAdminBarangay;
