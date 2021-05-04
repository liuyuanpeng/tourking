const ORDER_STATUS = [
  { name: "WAIT_APPROVAL_OR_PAY", desc: "待审核(待支付)" },
  {
    name: "WAIT_ACCEPT",
    desc: "等待派单"
  },
  {
      name: "AUTO",
      desc: "自动派单中"
  },
  {
    name: "ACCEPTED",
    desc: "已接单"
  },
  {
    name: "ON_THE_WAY",
    desc: "行程中"
  },
  {
    name: "DONE",
    desc: "已完成"
  },
  {
    name: "SETTLED",
    desc: "已结算"
  },
  {
    name: "CANCEL_CONSOLE",
    desc: "已取消(后台)"
  },
  {
    name: "CANCEL_SHOP",
    desc: "已取消(商户)"
  },
  {
    name: "CANCEL_USER",
    desc: "已取消(用户)"
  }
];

export default ORDER_STATUS;
