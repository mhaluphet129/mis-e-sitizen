import React, { useEffect } from "react";
import { ConfigProvider, message } from "antd";
import Head from "next/head";
import "../styles/main.styles.css";
import axios from "axios";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    (async () => {
      let { data } = await axios.get("/api/etc", {
        params: {
          mode: "check-admin-exist",
        },
      });

      console.log(data);

      if (data.status == 200)
        if (data.data?.length == 0) {
          let res = await axios.post("/api/etc", {
            payload: {
              mode: "init",
            },
          });

          if (res.data.status == 200) message.success(res.data.message);
        }
    })();
  }, []);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
        },
      }}
    >
      <Head>
        {/* <link rel='shortcut icon' href='/logo-icon.svg' /> */}
        <title>INFORMATION AND HEALTH MONITORING SYSTEM</title>
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
