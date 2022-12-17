import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import Cards from "./components/cards";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUserCheck, FaUserTimes, FaMale, FaFemale } from "react-icons/fa";
import { TbOld } from "react-icons/tb";
import axios from "axios";

const Dashboard = () => {
  let [data, setData] = useState({
    barangay: "-",
    senior: "-",
    withPension: "-",
    withoutPension: "-",
    male: "-",
    female: "-",
  });
  let dummy = [
    {
      name: "Barangay",
      value: data.barangay,
      color: "orange",
      icon: <BsFillHouseFill />,
    },
    {
      name: "Senior Citizens",
      value: data.senior,
      color: "green",
      icon: <TbOld />,
    },
    {
      name: "With Pensions",
      value: data.withPension,
      color: "#00dddd",
      icon: <FaUserCheck />,
    },
    {
      name: "Without Pensions",
      value: data.withoutPension,
      color: "#8b0000",
      icon: <FaUserTimes />,
    },
    { name: "Male", value: data.male, color: "#00a2ed", icon: <FaMale /> },
    {
      name: "Female",
      value: data.female,
      color: "blueviolet",
      icon: <FaFemale />,
    },
  ];

  useEffect(() => {
    (async () => {
      let res = await axios.get("/api/etc", {
        params: {
          mode: "dashboard-data",
        },
      });

      if (res.data.status == 200) {
        let _data = res?.data?.data?.seniors;
        setData({
          barangay: 14,
          senior: _data?.length,
          withPension: _data?.filter((e) => e?.pensionStatus?.withPension)
            ?.length,
          withoutPension: _data?.filter((e) => !e?.pensionStatus?.withPension)
            ?.length,
          male: _data?.filter((e) => e?.gender == "male")?.length,
          female: _data?.filter((e) => e?.gender == "female")?.length,
        });
      }
    })();
  }, []);
  return (
    <Row gutter={[16, 16]}>
      {dummy.map((e, i) => (
        <Col span={12} key={e?.name + i}>
          <Cards
            key={e?.name + i}
            name={e?.name}
            value={e?.value}
            color={e?.color}
            icon={e?.icon}
          />
        </Col>
      ))}
    </Row>
  );
};

export default Dashboard;
