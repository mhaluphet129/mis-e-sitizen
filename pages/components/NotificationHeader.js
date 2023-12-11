import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Badge,
  Tabs,
  Card,
  Button,
  Typography,
  List,
  Skeleton,
  Modal,
  Tooltip,
  message,
  Empty,
  Popconfirm,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import { TbBellRinging, TbBellRingingFilled } from "react-icons/tb";
import { AiOutlineNotification, AiFillNotification } from "react-icons/ai";
import axios from "axios";

const NotificationHeader = ({
  isAdmin = false,
  announcement = [],
  notif = [],
  id,
  setNotification,
  setAnnouncement,
}) => {
  const [selectedIndex, setSelectedIndex] = useState("2");
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, contextHolder2] = message.useMessage();
  const [viewData, setViewData] = useState({ open: false, data: null });
  const [loader, setLoader] = useState("");

  const handleClear = () => {
    setOpen(false);
    (async (_) => {
      let { data } = await _.delete("/api/notification", {
        params: {
          id: id,
        },
      });

      if (data?.success) {
        message.success("Sucessfully clear notification");
        setNotification([]);
      } else {
        message.error(data?.message ?? "Error in the server");
      }
    })(axios);
    // messageApi
    //   .open({
    //     type: "loading",
    //     content: "Action in progress..",
    //     duration: 2.5,
    //   })
    //   .then(() => message.success("Loading finished", 2.5));
  };

  const seen = (index, flag) => {
    (async (_) => {
      let { data } = await _.post("/api/notification", {
        payload: {
          mode: "seen-push",
          id,
          notifId:
            selectedIndex == "1" ? announcement[index]._id : notif[index]._id,
        },
      });

      if (data.success) {
        if (selectedIndex == "1")
          setAnnouncement((e) => {
            if (!flag) {
              if (e[index].seenBy != null) e[index].seenBy.push(id);
              else e[index].seenBy = [id];
            }

            return e;
          });
        else
          setNotification((e) => {
            if (!flag) e[index].isSeen = true;
            return e;
          });
      }
    })(axios);
  };

  const handleMarkAllAsRead = () => {
    if (selectedIndex == "1") {
      (async (_) => {
        let { data } = await _.post("/api/notification", {
          payload: {
            mode: "seen-push-all",
            id,
            notifIds: announcement.map((e) => e._id),
          },
        });
        if (data.success) {
          setAnnouncement((e) => {
            e.forEach((_, index) => {
              e[index].seenBy.push(id);
            });
            return e;
          });
          setOpen(false);
        }
      })(axios);
    } else {
      (async (_) => {
        let { data } = await _.post("/api/notification", {
          payload: {
            mode: "seen-push",
            id,
            notifId: notif.map((e) => e._id),
          },
        });
        if (data.success) {
          setNotification((e) => {
            e.forEach((_, index) => {
              e[index].isSeen = true;
            });
            return e;
          });
          setOpen(false);
        }
      })(axios);
    }
  };

  const ListCard = ({ data, index }) => {
    let flag =
      selectedIndex == "1"
        ? announcement[index]?.seenBy?.includes(id) ?? false
        : notif[index]?.isSeen ?? false;

    return (
      <List.Item
        onClick={() => {
          if (!flag) seen(index, flag);
          setViewData({ open: true, data });
          setOpen(false);
        }}
      >
        <Skeleton loading={false} active>
          <List.Item.Meta
            title={<Badge dot={!flag}>{data.title}</Badge>}
            description={
              <Typography.Paragraph
                ellipsis={{
                  rows: 3,
                }}
              >
                {data.content}
              </Typography.Paragraph>
            }
          />
        </Skeleton>
      </List.Item>
    );
  };

  const ModalNotifCard = ({ data, open, close }) => (
    <Modal open={open} onCancel={close} footer={null}>
      <Typography.Title level={3}>{data?.title ?? ""}</Typography.Title>
      <Typography.Paragraph>{data?.content ?? ""}</Typography.Paragraph>
    </Modal>
  );

  useEffect(() => {
    if (isAdmin) {
      setSelectedIndex("2");
    }
  }, []);

  return (
    <div>
      {/* context */}
      {contextHolder}
      {contextHolder2}
      <ModalNotifCard
        data={viewData.data}
        open={viewData.open}
        close={() => setViewData({ open: false, data: null })}
      />
      {/* end context */}
      <Dropdown
        trigger={["click"]}
        open={open}
        onOpenChange={(e) => setOpen(e)}
        overlayStyle={{
          zIndex: 1,
        }}
        dropdownRender={() => (
          <Card
            bodyStyle={{
              paddingTop: 1,
              paddingBottom: 10,
              paddingRight: 20,
              paddingLeft: 20,
              width: isAdmin ? 300 : null,
            }}
            actions={[
              <Typography.Text
                key="key1"
                /* style={{ color: "#aeaeae" }} */ onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Typography.Text>,
              <Popconfirm
                key="key2"
                title="Confirm Clear Notification ?"
                okText="CLEAR"
                onConfirm={handleClear}
                zIndex={999}
              >
                <Button type="text" danger>
                  CLEAR
                </Button>
              </Popconfirm>,
            ]}
          >
            <Tabs
              style={{ backgroundColor: "#fff" }}
              onTabClick={(e) => setSelectedIndex(e.toString())}
              activeKey={selectedIndex}
              centered
              items={[
                !isAdmin
                  ? {
                      key: "1",
                      label: (
                        <Typography>
                          {selectedIndex == 1 ? (
                            <AiFillNotification />
                          ) : (
                            <AiOutlineNotification />
                          )}{" "}
                          Announcement ({announcement.length})
                        </Typography>
                      ),
                      children:
                        announcement.length == 0 ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                          <List
                            style={{
                              maxHeight: 300,
                              overflow: "scroll",
                            }}
                            dataSource={announcement}
                            renderItem={(item, index) =>
                              ListCard({ data: item, index })
                            }
                          />
                        ),
                    }
                  : null,
                {
                  key: "2",
                  label: (
                    <Typography>
                      {selectedIndex == 2 ? (
                        <TbBellRingingFilled />
                      ) : (
                        <TbBellRinging />
                      )}{" "}
                      Notification ({notif.length})
                    </Typography>
                  ),
                  children:
                    notif.length == 0 ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      <List
                        style={{
                          maxHeight: 300,
                          overflow: "scroll",
                        }}
                        dataSource={notif}
                        renderItem={(item, index) =>
                          ListCard({ data: item, index })
                        }
                      />
                    ),
                },
              ]}
            />
          </Card>
        )}
      >
        <Badge
          count={
            (!isAdmin
              ? announcement.filter((e) => !e.seenBy.includes(id)).length
              : 0) + notif.filter((e) => !e.isSeen).length
          }
          style={{ zIndex: 99999 }}
        >
          <Tooltip title="Notification and Announcements">
            <Button
              size="large"
              icon={<BellOutlined />}
              style={{
                backgroundColor: "#aaa",
                color: "#fff",
                padding: 0,
              }}
            />
          </Tooltip>
        </Badge>
      </Dropdown>
    </div>
  );
};

export default NotificationHeader;
