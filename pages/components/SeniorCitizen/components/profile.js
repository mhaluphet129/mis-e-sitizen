import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Tag, Typography } from "antd";
import NoImage from "../../../assets/js/NoImage";
import axios from "axios";
import dayjs from "dayjs";

const Profile = ({ id }) => {
  const [name, setName] = useState({});
  const [guardian, setGuardian] = useState({});
  const [user, setUser] = useState({});

  const customLabels = (_) => {
    let label = _;
    switch (_) {
      case "salary": {
        label = "Wages/Salaries";
        break;
      }
      case "entrep": {
        label = "Profits from Entrepreneurial Activities";
        break;
      }
      case "householdMember": {
        label = "Household Family Members/Relatives";
        break;
      }
      case "domesticMember": {
        label = "Domestic Family Members/Relatives";
        break;
      }
      case "internationalMember": {
        label = "International Family Members/Relatives";
        break;
      }
      case "fromFriends": {
        label = "Friends/Neighbors";
        break;
      }
      case "fromGovernment": {
        label = "Transfer from the Government";
        break;
      }
      case "others": {
        label = "Others";
        break;
      }
    }

    return label;
  };

  const customLabels2 = (_) => {
    let label = _;

    switch (_) {
      case "alone": {
        label = "Living alone";
        break;
      }
      case "withSpouse": {
        label = "Living with Spouse";
        break;
      }
      case "withChild": {
        label = "Living with a Child";
        break;
      }
      case "anotherRelative": {
        label = "Living with another relative";
        break;
      }
      case "unrelatedPeople": {
        label = "Living with unrelated people";
        break;
      }
    }

    return label;
  };

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/senior", {
        params: {
          mode: "search-senior-by-id",
          _id: id,
        },
      });

      if (data.status == 200) {
        setUser(data.data);
        setName(data.data.name);
        setGuardian(data.data.guardian);
      }
    })(axios);
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Typography.Title level={4} underline>
          Personal
        </Typography.Title>
        <div style={{ position: "relative" }}>
          <NoImage />
          {(user.status != null ||
            user.status != undefined ||
            user.status != "") && (
            <Tag
              color={
                user.status == "ACTIVE"
                  ? "green"
                  : user.status == "DECEASED"
                  ? "red"
                  : "lime"
              }
              style={{ position: "absolute", top: 10, left: 10 }}
            >
              {user.status == "ACTIVE"
                ? "Active"
                : user.status == "DECEASED"
                ? "Deceased"
                : "Active with Illness/PWD"}
            </Tag>
          )}
        </div>
        <small>id: {name.id}</small>
        <Typography.Title level={5}>
          {name?.name} {name?.middlename} {name.lastname}
        </Typography.Title>
        <Typography>
          {dayjs(user.dateOfBirth).format("MMMM DD, YYYY")}{" "}
          {`(${dayjs().diff(
            dayjs(user.dateOfBirth).format("YYYY-MM-DD"),
            "years",
            false
          )} years old)`}
        </Typography>
        <Typography>{user.gender}</Typography>
        <Typography>{user.maritalStatus}</Typography>
        <Typography>{user.barangay}, Kadingilan</Typography>
        <Typography>+63{user.contactNumber}</Typography>
        <Typography>
          Living with: <strong>{customLabels2(user.livingWith)}</strong>
        </Typography>
        <Typography>
          is PWD:{" "}
          <strong>
            {user?.isPwd?.status != null
              ? user.isPwd?.name != ""
                ? `PWD | ${user.isPwd.name}`
                : "PWD"
              : "No"}
          </strong>
        </Typography>
        <Typography>
          has illness:{" "}
          <strong>
            {user?.hasIllness?.status != null
              ? user.hasIllness.name != ""
                ? `Yes | ${user.hasIllness.name}`
                : "Yes"
              : "No"}
          </strong>
        </Typography>
        <Typography>
          Meals per day: <strong>{user.mealsPerDay}</strong>
        </Typography>
        <Divider style={{ maxWidth: 200 }} />
        <Typography>
          Is Receiving Pension:{" "}
          <strong>{user.receivedPension == true ? "Yes" : "No"}</strong>
        </Typography>
        <Typography>
          Received Pension in the last 6 months:{" "}
          <strong>{user.receivedPension6mos?.toUpperCase()}</strong>
          {user.receivedPension6mos?.length == 0 && <strong>None</strong>}
        </Typography>

        <Typography>Source of income: </Typography>
        <div style={{ marginLeft: 30 }}>
          {Object.keys(user.sourceOfIncome ?? {}).map((e) => {
            if (user.sourceOfIncome[e].status)
              return (
                <>
                  {customLabels(e)}:{" "}
                  <strong>₱{user.sourceOfIncome[e].value}</strong>
                  <br />
                </>
              );
          })}
        </div>
      </Col>
      <Col span={8}>
        <Typography.Title level={4} underline>
          Guardian
        </Typography.Title>
        <Typography.Title level={5}>
          {guardian?.name} {guardian?.middlename} {guardian.lastname}
        </Typography.Title>
        <Typography>{guardian?.relationship}</Typography>
        <Typography.Title level={4} underline>
          Authorized Representative
        </Typography.Title>
        <Divider style={{ marginLeft: 10 }} />
        {user?.authorizedRepresentative?.map((e) => (
          <Typography style={{ marginLeft: 10 }}>
            {e.name} <br />
            {e.contactNumber} <br />
            {e.relationship}
            <Divider />
          </Typography>
        ))}
      </Col>
    </Row>
  );
};

export default Profile;