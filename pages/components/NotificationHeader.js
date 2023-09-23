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

  const handleConfirm = () => {
    messageApi
      .open({
        type: "loading",
        content: "Action in progress..",
        duration: 2.5,
      })
      .then(() => message.success("Loading finished", 2.5));
  };

  const seen = (index, flag) => {
    (async (_) => {
      let { data } = await _.post("/api/notification", {
        payload:
          selectedIndex == "1"
            ? {
                mode: "seen-push",
                id,
                notifId: announcement[index]._id,
              }
            : {},
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
    }
  };

  const ListCard = ({ data, index }) => {
    let flag =
      selectedIndex == "1"
        ? announcement[index].seenBy?.includes(id) ?? false
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
                  rows: 2,
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
        dropdownRender={() => (
          <Card
            bodyStyle={{
              paddingTop: 1,
              paddingBottom: 10,
              paddingRight: 20,
              paddingLeft: 20,
              width: isAdmin ? 250 : null,
            }}
            actions={[
              <Typography.Text
                key="key1"
                /* style={{ color: "#aeaeae" }} */ onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Typography.Text>,
              <Tooltip title="Temporary Disabled">
                <Button
                  type="text"
                  key="key2"
                  danger
                  onClick={() => {
                    setOpen(false);
                    modal.confirm({
                      title: "Confirm Clear Notification?",
                      okText: "CLEAR",
                      onOk: handleConfirm,
                    });
                  }}
                  disabled
                >
                  clear
                </Button>
              </Tooltip>,
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
                        dataSource={notif}
                        renderItem={(item) => ListCard({ data: item })}
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
          d
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
