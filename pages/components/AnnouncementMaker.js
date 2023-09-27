import React, { useState } from "react";
import { Button, Input, Modal, Typography, message } from "antd";
import axios from "axios";

const AnnouncementMaker = ({ open, close }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = () => {
    if (title == "" || content == "") {
      message.warning("Some Input is blank. Please provide.");
      return;
    }

    (async (_) => {
      setLoader(true);
      let res = await _.post("/api/notification", {
        payload: {
          mode: "announce",
          title,
          content,
        },
      });

      if (res.data?.success) {
        message.success(res.data?.message ?? "Success");
        setLoader(false);
        close();
      } else {
        message.error(res.data?.message ?? "Error in the server");
        setLoader(false);
      }
    })(axios);
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={[
        <Button
          type="primary"
          loading={loader}
          onClick={handleSubmit}
          key="key1"
        >
          Submit
        </Button>,
      ]}
      closable={false}
      title={
        <>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Make an announcement
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 10 }}>
            (This will notify all barangay admins)
          </Typography.Text>
        </>
      }
      destroyOnClose
    >
      <Typography.Text strong>Title</Typography.Text>
      <Input onChange={(e) => setTitle(e.target.value)} />
      <Typography.Text>Content</Typography.Text>
      <Input.TextArea
        showCount
        minLength={100}
        maxLength={null}
        style={{
          marginBottom: 24,
        }}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Announcement"
      />
    </Modal>
  );
};

export default AnnouncementMaker;
