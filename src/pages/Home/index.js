import React from "react";
import QRCode from "react-qr-code";

export default () => (
  <div
    style={{
      position: "absolute",
      marginTop: "-50px",
      width: "100%",
      top: "20%",
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
      欢迎来到旅王后台管理系统
    </div>
    <div>
    司机端(安卓)下载:
    </div>
    <QRCode
      bgColor="#FFFFFF"
      fgColor="#000000"
      level="Q"
      style={{ width: 256 }}
      value="http://www.kingtrip.vip/download/tourking.apk"
    />
  </div>
);
