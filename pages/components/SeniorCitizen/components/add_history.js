import { Button, Checkbox, Input, InputNumber, Modal, message } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import { useState } from "react";

const AddHistory = ({ open, close, id }) => {
  let [loading, setLoading] = useState("");
  let [amount, setAmount] = useState(null);
  let [note, setNote] = useState(null);
  let [isSenior, setIsSenior] = useState(true);
  let [name, setName] = useState(null);

  const validate = async () => {
    setLoading("loading");
    if (!amount) {
      message.error("Please enter an amount.");
      return;
    }

    let { data } = await axios.post("/api/history", {
      payload: {
        mode: "add-history",
        id,
        amount,
        note,
        authorizedName: name,
      },
    });

    if (data.status == 200) {
      message.success(data.message);
      close();
      setLoading("");
    } else {
      setLoading("");

      message.error(data.message);
      return;
    }
  };
  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      footer={
        <Button type="primary" onClick={validate}>
          SUBMIT
        </Button>
      }
      destroyOnClose
    >
      <div>
        Name: <br />
        <Input
          disabled={isSenior}
          placeholder={
            isSenior ? "Senior is selected" : "Enter Authorized Person Name"
          }
          suffix={
            <Checkbox
              value={isSenior}
              onChange={(e) => setIsSenior(e.target.checked)}
            >
              Senior
            </Checkbox>
          }
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        Amount: <br />
        <InputNumber
          prefix="₱"
          style={{ width: 300 }}
          onChange={(e) => setAmount(e)}
        />
      </div>
      <div>
        Note: <Input.TextArea onChange={(e) => setNote(e.target.value)} />
      </div>
    </Modal>
  );
};

export default AddHistory;
