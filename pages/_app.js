import React from "react";
import { ConfigProvider } from "antd";
import Head from "next/head";
import "../styles/main.styles.css";

function MyApp({ Component, pageProps }) {
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
