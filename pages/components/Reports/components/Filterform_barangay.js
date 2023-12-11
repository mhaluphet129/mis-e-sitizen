import React, { useEffect, useState } from "react";
import {
  Modal,
  Select,
  Button,
  Typography,
  InputNumber,
  Segmented,
  DatePicker,
} from "antd";
import jason from "../../../assets/json/constant.json";
import dayjs from "dayjs";

const FilterFormBarangay = ({ open, close, barangay, selectedBarangay }) => {
  const [_, __] = useState("");
  const [date, setDate] = useState({ year: null, month: null, day: null });
  const [mode, setMode] = useState("Specific");
  const [selectedDates, setSelectedDates] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const resetFields = () => {
    setDate({ year: null, month: null, day: null });
    setSelectedDates([]);
    __("");
  };

  useEffect(() => {
    if (open) {
      __("");
    }
    if (barangay != "") __(barangay);
  }, [open, barangay]);

  return (
    <Modal
      closable={false}
      footer={null}
      open={open}
      onCancel={() => {
        resetFields();
        close();
        setMode("Specific");
      }}
      title="Filter Form"
      destroyOnClose
    >
      {barangay == null && (
        <>
          <Typography.Text>Select Barangay</Typography.Text>
          <br />
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
          <br />
        </>
      )}

      <Typography.Text>Timestamp</Typography.Text>
      <br />
      <Segmented
        options={["Specific", "Range"]}
        value={mode}
        style={{ padding: 5, marginBottom: 5 }}
        onChange={(e) => setMode(e)}
      />
      {mode == "Specific" ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <InputNumber
            placeholder="Year"
            style={{ width: 70, marginRight: 5 }}
            min={1900}
            max={dayjs().year()}
            value={date.year}
            onChange={(e) => {
              setDate({ year: e, month: null, day: null });
            }}
          />
          <Select
            placeholder="Month"
            value={months[date.month]}
            options={months.map((e) => {
              return {
                label: e,
                value: e.toLocaleLowerCase(),
              };
            })}
            style={{ width: 100, marginRight: 5 }}
            disabled={date.year == null}
            onChange={(e) =>
              setDate({
                ...date,
                month: months.map((q) => q.toLocaleLowerCase()).indexOf(e),
                day: null,
              })
            }
          />
          <InputNumber
            placeholder="Day"
            value={date.day}
            style={{ width: 70 }}
            min={1}
            disabled={date.month == null}
            onChange={(e) => setDate({ ...date, day: e })}
            max={dayjs().month(date.month).daysInMonth()}
          />
        </div>
      ) : (
        <div>
          <DatePicker.RangePicker
            value={selectedDates}
            format="MMMM DD, YYYY"
            style={{ width: 350 }}
            onChange={(e) => setSelectedDates(e)}
          />
        </div>
      )}

      <br />
      <Button
        onClick={() => resetFields()}
        style={{ width: "20%", marginRight: "2%" }}
      >
        reset
      </Button>
      <Button
        onClick={() => {
          selectedBarangay(_, date, selectedDates);
          close();
        }}
        type="primary"
        style={{ width: "78%" }}
      >
        Generate
      </Button>
    </Modal>
  );
};

export default FilterFormBarangay;
