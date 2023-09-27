import React, { useEffect, useState } from "react";
import {
  Col,
  Divider,
  Row,
  Spin,
  Tag,
  Typography,
  Image,
  Space,
  Button,
  Modal,
  message,
  Select,
} from "antd";
import NoImage from "../../../assets/js/NoImage";
import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import jason from "../../../assets/json/constant.json";

const Profile = ({ id }) => {
  const [name, setName] = useState({});
  const [guardian, setGuardian] = useState({});
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState("");
  const [modal, contextHolder] = Modal.useModal();
  const [currentUser, setCurrentUser] = useState({ name: "", lastname: "" });
  const [openMoveTo, setOpenMoveTo] = useState(false);
  const [tranferBrgy, setTransferBrgy] = useState("");

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

  const customLabels3 = (_) => {
    const labels = [
      {
        label: "Food",
        value: "food",
      },
      {
        label: "Medicines and Vitamins",
        value: "medicines",
      },
      {
        label: "Health check-up and other hospital/medical services",
        value: "health",
      },
      {
        label: "Clothing",
        value: "clothing",
      },
      {
        label: "Utilities (e.g. electric and water bills)",
        value: "utilities",
      },
      {
        label: "Debt payment",
        value: "debt",
      },
      {
        label: "Livelihood/Entreprenurial Activities",
        value: "activities",
      },
      {
        label: "Others",
        value: "others",
      },
    ];

    return labels.filter((e) => e.value == _)[0]?.label ?? _ ?? "None";
  };

  const confirmArchive = () => {
    (async (_) => {
      let { data } = await _.post("/api/senior", {
        payload: {
          mode: "archive-senior",
          seniorId: user._id,
          updaterId: currentUser._id,
        },
      });

      if (data.success) {
        message.success(data?.message ?? "Archived Successfully");
      } else {
        message.error("Error in the Server.");
      }
    })(axios);
  };

  const transferSenior = () => {
    (async (_) => {
      let { data } = await _.post("/api/senior", {
        payload: {
          mode: "transfer-senior",
          barangay: tranferBrgy,
          transferBy: currentUser._id,
          seniorId: user._id,
        },
      });

      if (data.success) {
        message.success(data?.message ?? "Tranfered Successfully");
      } else {
        message.error("Error in the Server.");
      }
    })(axios);
  };

  useEffect(() => {
    (async (_) => {
      setLoader("fetch-user");

      let { data } = await _.get("/api/senior", {
        params: {
          mode: "search-senior-by-id",
          _id: id,
        },
      });

      if (data.status == 200) {
        setUser(data.data);
        setName(data.data?.name);
        setGuardian(data.data.guardian);
        setLoader("");
      }
    })(axios);
    setCurrentUser(JSON.parse(Cookies.get("currentUser")));
  }, []);

  return (
    <Spin spinning={loader == "fetch-user"}>
      {contextHolder}
      <Modal
        title="Tranfer Senior"
        open={openMoveTo}
        closable={false}
        footer={null}
        onCancel={() => setOpenMoveTo(false)}
      >
        <Space>
          <Select
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label.toLocaleLowerCase() ?? "").includes(
                input.toLocaleLowerCase()
              )
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            showSearch
            options={jason.barangay.map((e) => {
              return { value: e, label: e };
            })}
            onChange={(e) => setTransferBrgy(e)}
          />
          <Button
            type="primary"
            disabled={tranferBrgy == ""}
            onClick={transferSenior}
          >
            Transfer
          </Button>
        </Space>
      </Modal>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Typography.Title level={4} underline>
            Personal
          </Typography.Title>
          <Typography>
            Time and Date added:{" "}
            {dayjs(user?.createdAt).format("hh:mm a, MM/DD/YYYY")}
          </Typography>
          <div style={{ position: "relative", width: 350 }}>
            {user?.profileImage ? (
              <Image src={user.profileImage} alt="random_photo" width="100%" />
            ) : (
              <NoImage />
            )}

            {(user?.status != null ||
              user?.status != undefined ||
              user?.status != "") && (
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
            {name?.name} {name?.middlename} {name.lastname}{" "}
            {![null, undefined, ""].includes(name?.extensionName)
              ? name.extensionName
              : ""}
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
              return (
                <>
                  {customLabels(e)}:{" "}
                  <strong>
                    {user.sourceOfIncome[e].status ? "Yes" : "No"} | ₱
                    {user.sourceOfIncome[e].value}
                  </strong>
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
          {user?.authorizedRepresentative?.map((e, i) => (
            <Typography style={{ marginLeft: 10 }} key={i}>
              {e.name} <br />
              {e.contactNumber} <br />
              {e.relationship}
              <Divider />
            </Typography>
          ))}
          <Typography.Title level={4} underline>
            UTILIZATION OF SOCIAL PENSION
          </Typography.Title>
          <Typography.Title level={5}>
            {customLabels3(user.description)}
          </Typography.Title>
        </Col>
        <Col span={8}>
          <Typography.Title level={4} underline>
            Functions
          </Typography.Title>
          <Space direction="vertical">
            {/* {currentUser.role == "superadmin" && ( */}
            <Button
              onClick={() => {
                modal.confirm({
                  title: "This senior ",
                  okText: "ARCHIVE",
                  onOk: confirmArchive,
                });
              }}
            >
              Archive
            </Button>
            {/* )} */}
            <Button onClick={() => setOpenMoveTo(true)}>
              Move to another Barangay
            </Button>
          </Space>
        </Col>
      </Row>
    </Spin>
  );
};

export default Profile;
