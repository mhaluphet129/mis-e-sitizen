import { Typography, Input } from "antd";

const Component = ({ data }) => {
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
        <Typography.Title level={4} style={{ margin: 0 }}>
          Republic of the Philippines
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
        style={{ textAlign: "center", fontWeight: 700 }}
      >
        CERTIFICATION
      </Typography.Title>
      <Typography.Text>TO WHOM IT MAY CONCERN:</Typography.Text> <br />
      <Typography.Text>
        THIS IS TO CERTIFY that{" "}
        <div class="label-under">
          <Input
            style={{ width: 300, textAlign: "center" }}
            value={data?.name}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        is a Social Pension beneficiary with Osca ID No.
      </Typography.Text>
      <Typography.Text>
        <div class="label-under">
          <Input
            style={{ width: 100, textAlign: "center" }}
            value={data?.id}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        of Barangay{" "}
        <div class="label-under">
          <Input
            style={{ width: 150, textAlign: "center" }}
            value={data?.brgy}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        in
        <div class="label-under">
          <Input
            style={{ width: 100, textAlign: "center" }}
            value={data?.day}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        ,
        <div class="label-under">
          <Input
            style={{ width: 150, textAlign: "center" }}
            value={data?.year}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        .
      </Typography.Text>
      <br />
      <br />
      <Typography.Text style={{ marginLeft: 50 }} italic>
        This is to certify that her / his name / OSCA ID was unintenionally
        misspelled or erroneously typed as
      </Typography.Text>
      <br />
      <Typography.Text>
        <div class="label-under">
          <Input
            style={{ width: 250, textAlign: "center" }}
            value={data?.name2}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        .
      </Typography.Text>
      <br />
      <br />
      <Typography.Text style={{ marginLeft: 50 }}>
        This certification is being issued upon request of the above-named
        person for the release of her / his{" "}
        <div class="label-under">
          <Input
            style={{ width: 100, textAlign: "center" }}
            value={data?.semester}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        Semester Social Pension
      </Typography.Text>
      <br />
      <br />
      <Typography.Text style={{ marginLeft: 50 }}>
        Given this day{" "}
        <div class="label-under">
          <Input
            style={{ width: 100, textAlign: "center" }}
            value={data?.day2}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        of
        <div class="label-under">
          <Input
            style={{ width: 100, textAlign: "center" }}
            value={data?.month}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        202
        <div class="label-under">
          <Input
            style={{ width: 40, textAlign: "center" }}
            value={data?.year2}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        at
        <div class="label-under">
          <Input
            style={{ width: 200, textAlign: "center" }}
            value={data?.place1}
            className="input disabled-preview-input"
            disabled
          />
        </div>
        ,
        <div class="label-under">
          <Input
            style={{ width: 200, textAlign: "center" }}
            value={data?.place2}
            className="input disabled-preview-input"
            disabled
          />
        </div>
      </Typography.Text>
      <br />
      <br />
      <div style={{ display: "grid" }}>
        <div
          style={{
            width: 250,
            height: 100,
            justifySelf: "flex-end",
          }}
        >
          <Typography.Text>Certified by:</Typography.Text>
          <Typography.Title level={5} style={{ float: "right" }}>
            <u>HYDIE C. PUABEN, RSW</u>
            <br />
            <span
              style={{
                display: "block",
                textAlign: "center",
                marginTop: -5,
              }}
            >
              MSWDO
            </span>
          </Typography.Title>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Component;
