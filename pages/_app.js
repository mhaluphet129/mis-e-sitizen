import "antd/dist/antd.css";
import Head from "next/head";
import React from "react";
import "../styles/main.styles.css";

function MyApp({ Component, pageProps }) {
  if (typeof window === "undefined") return <></>;
  else
    return (
      <>
        <Head>
          {/* <link rel='shortcut icon' href='/logo-icon.svg' /> */}
          <title>AgriSUPPORT</title>
          <meta
            name="description"
            content="This system develop to help MAGRO manage farmers, farmworkers and fisherfolk data and information to be manage."
          ></meta>
        </Head>
        <Component {...pageProps} />
      </>
    );
}

export default MyApp;
