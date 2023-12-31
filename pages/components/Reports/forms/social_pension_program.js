import { Typography, Input } from "antd";

const Home = ({ setData }) => {
  return (
    <div className="document-paper">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography.Title level={4} style={{ fontWeight: 700, margin: 0 }}>
          SOCIAL PENSION PROGRAM
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Region X
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Province of Bukidnon
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Municipality of Kadingilan
        </Typography.Title>
      </div>

      <Typography.Title
        level={4}
        style={{ textAlign: "center", letterSpacing: 4, fontWeight: 500 }}
      >
        AUTHORIZATION
      </Typography.Title>

      <Typography.Title level={5} style={{ fontWeight: 400 }}>
        To Whom It May Concern:
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400 }}>
        This is to certify that{" "}
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 500, marginBottom: 10, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, name: e.target.value };
              });
            }}
          />
          <label>(name of authorized representative)</label>
        </div>
        identified to
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400, marginBottom: 10 }}>
        be the
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 200, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, relationship: e.target.value };
              });
            }}
          />
          <label>(relationship to beneficiary)</label>
        </div>
        of
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 300, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, beneName: e.target.value };
              });
            }}
          />
          <label>(name of beneficiary)</label>
        </div>
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400 }}>
        authorized to claim the
        <div class="label-under">
          <Input
            className="input"
            style={{
              width: 30,
              textAlign: "center",
              background: "rgba(0,0,0,0)",
            }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, semester: e.target.value };
              });
            }}
          />
        </div>
        semester Social Pension stipend amounting 3,000.00 as
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400, marginBottom: 40 }}>
        expressly authorized by the concerning beneficiary.
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400, marginBottom: 50 }}>
        Issued this{" "}
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 70, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, day: e.target.value };
              });
            }}
          />
        </div>
        of August
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 70, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, year: e.target.value };
              });
            }}
          />
        </div>
        at
        <div class="label-under">
          <Input
            className="input"
            style={{ width: 150, textAlign: "center" }}
            onChange={(e) => {
              setData((_) => {
                return { ..._, place: e.target.value };
              });
            }}
          />
        </div>
        .
      </Typography.Title>
      <Typography.Title level={5} style={{ fontWeight: 400, marginBottom: 40 }}>
        Certified by:{" "}
        <div class="label-under">
          <strong className="input" style={{ width: "100%", border: "none" }}>
            <u>HYDIE C. PUABEN, RSW</u>
          </strong>
          <label style={{ top: 15 }}>MSWDO</label>
        </div>
      </Typography.Title>
    </div>
  );
};

export default Home;
