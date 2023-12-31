import { Card, Row, Col, Typography } from "antd";

const DashboardCards = (props) => {
  return (
    <Card
      bodyStyle={{ padding: 5 }}
      onClick={() => props.onClick()}
      style={{ width: "30%" }}
      hoverable
    >
      <Row gutter={[16, 0]}>
        <Col>
          <div
            style={{
              background: props.color,
              height: "100%",
              width: 65,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
              color: "#fff",
            }}
          >
            {props?.icon != null ? props.icon : ""}
          </div>
        </Col>
        <Col>
          <Typography.Title level={5}>{props.name}</Typography.Title>
          <Typography.Text style={{ fontSize: 40 }}>
            {props.value}
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardCards;
