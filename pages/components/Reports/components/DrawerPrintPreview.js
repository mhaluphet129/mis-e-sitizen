import React, { useRef } from "react";
import { Button, Drawer } from "antd";
import { useReactToPrint } from "react-to-print";

class PDF extends React.Component {
  render() {
    return { ...this.props.children };
  }
}

const DrawerPrintPreview = ({ open, close, title, children }) => {
  const ref = useRef();

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <Drawer
      open={open}
      onClose={close}
      title={title}
      placement="bottom"
      height="100%"
      extra={[
        <Button onClick={handlePrint} key="key-1">
          PRINT
        </Button>,
      ]}
      style={{
        width: 900,
        marginLeft: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <PDF ref={ref}>{children}</PDF>
    </Drawer>
  );
};

export default DrawerPrintPreview;
