import React, { useEffect, useState } from "react";
import { ConfigProvider, message } from "antd";
import Head from "next/head";
import "../styles/main.styles.css";
import axios from "axios";
import json from "./assets/json/constant.json";
import Cookies from "js-cookie";

function MyApp({ Component, pageProps }) {
  const [color, setColor] = useState("#00b96b");

  useEffect(() => {
    (async (_) => {
      let { data } = await _.get("/api/etc", {
        params: {
          mode: "check-admin-exist",
        },
      });

      if (data.status == 200)
        if (data.data?.length == 0) {
          let res = await _.post("/api/etc", {
            payload: {
              mode: "init",
            },
          });

          if (res.data.status == 200) message.success(res.data.message);
        }
    })(axios);
    setColor(
      Cookies.get("barangay") != "false" && Cookies.get("barangay") != undefined
        ? json["barangay-color-theme"][Cookies.get("barangay")]
        : "#00b96b"
    );
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color,
        },
      }}
    >
      <Head>
        {/* <link rel='shortcut icon' href='/logo-icon.svg' /> */}
        <title>MANAGEMENT INFORMATION SYSTEM</title>
        <meta
          name="description"
          content="This system develop for DSWD to help Senior Citizen data and information to be manage."
        />
      </Head>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
