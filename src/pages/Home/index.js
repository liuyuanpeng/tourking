import React from "react";
import QRCode from "react-qr-code";

export default () => (
  <div
    style={{
      position: "absolute",
      marginTop: "-50px",
      width: "100%",
      top: "calc(50% - 50px)",
      height: "100px%",
      textAlign: "center",
      lineHeight: "100px"
    }}
  >
    <div
      style={{
        fontWeight: "bold",
        fontSize: "xx-large"
      }}
    >
      欢迎来到旅王出行后台管理系统
    </div>
  </div>
);
