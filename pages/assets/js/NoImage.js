import { Typography } from "antd";

const NoImage = () => {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1/1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(200,200,200,0.75)",
        borderRadius: 10,
        borderStyle: "dashed",
        borderWidth: 0.5,
        borderColor: "rgb(150,150,150)",
      }}
    >
      <Typography.Text type="secondary" italic>
        No Image
      </Typography.Text>
    </div>
  );
};

export default NoImage;
