import { Col, Row } from "antd";
import Cards from "./components/cards";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUserCheck, FaUserTimes, FaMale, FaFemale } from "react-icons/fa";
import { TbOld } from "react-icons/tb";

const Dashboard = () => {
  let dummy = [
    { name: "Barangay", value: 42, color: "orange", icon: <BsFillHouseFill /> },
    { name: "Senior Citizens", value: 100, color: "green", icon: <TbOld /> },
    {
      name: "With Pensions",
      value: 75,
      color: "#00dddd",
      icon: <FaUserCheck />,
    },
    {
      name: "Without Pensions",
      value: 25,
      color: "#8b0000",
      icon: <FaUserTimes />,
    },
    { name: "Male", value: 55, color: "#00a2ed", icon: <FaMale /> },
    { name: "Female", value: 45, color: "blueviolet", icon: <FaFemale /> },
  ];
  return (
    <Row gutter={[16, 16]}>
      {dummy.map((e, i) => (
        <Col span={12}>
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
