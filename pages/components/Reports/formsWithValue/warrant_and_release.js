import { Image, Typography, Input } from "antd";

const Component = ({ data }) => {
  return (
    <div className="document-paper">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 20px 20px 20px",
        }}
      >
        <Image preview={false} src="/DSWD-Logo.png" width={150} />
        <strong style={{ fontStyle: "italic" }}>ANNEX 4</strong>
      </div>
      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        WARRANTY AND RELEASE FROM LIABILITY
      </Typography.Title>
      <Typography.Text>
        I, the undersigned, of legal age, Filipino, hereby state:
      </Typography.Text>
      <div style={{ marginLeft: 10 }}>
        <ol>
          <li style={{ textAlign: "justify", marginBottom: 30 }}>
            I am the (nearest relative / duty authorized representative of
            nearest surviving living relatives) of the hereunder beneficiary of
            the Social Pension for Indigent Senior Citizens of the Department of
            Social Welfare and Development (DSWD):
          </li>
          <div>
            <Input
              style={{
                width: 300,
                marginLeft: "50%",
                transform: "translateX(-50%)",
                border: "none",
                borderBottom: "1px solid #a0a0a0",
                borderRadius: 0,
                textAlign: "center",
              }}
              value={data?.name}
              className="disabled-preview-input"
              disabled
            />
            <p
              style={{
                textAlign: "center",
                marginBlockStart: 0,
                marginBlockEnd: 0,
                marginBottom: 30,
              }}
            >
              (Name of the Beneficiary)
            </p>
          </div>
          <li style={{ marginBottom: 30 }}>
            Said beneficiary died on{" "}
            <div class="label-under">
              <Input
                style={{ textAlign: "center" }}
                className="input disabled-preview-input"
                value={data?.dateDied}
                disabled
              />
              <label>(Date)</label>
            </div>
            at{" "}
            <div class="label-under">
              <Input
                style={{ width: 300, textAlign: "center" }}
                className="input disabled-preview-input"
                value={data?.placeOfDeath}
                disabled
              />
              <label>(Place of death)</label>
            </div>
          </li>
          <li style={{ textAlign: "justify", marginBottom: 30 }}>
            I hereby release and agree to hold free from any responsibility and
            liability the DWSD, and its officers and employees. if any other
            person/s should appear and represent to be the nearest relative or
            duty authorized representative of the nearest surviving living
            relatives of said beneficiary.
          </li>
          <div style={{ marginBottom: 20 }}>
            <Input
              style={{
                width: 500,
                textAlign: "center",
              }}
              className="document-paper-input disabled-preview-input"
              value={data?.signature}
              disabled
            />
            <p>(Signature over Full Name of Claimant)</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <Input
              style={{
                width: 500,
                textAlign: "center",
              }}
              className="document-paper-input disabled-preview-input"
              value={data?.addressAndContact}
              disabled
            />
            <p>(Address and Contact Number)</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <Input
              style={{
                width: 500,
                textAlign: "center",
              }}
              className="document-paper-input disabled-preview-input"
              value={data?.date}
              disabled
            />
            <p>(Date)</p>
          </div>
        </ol>
      </div>
    </div>
  );
};

export default Component;
