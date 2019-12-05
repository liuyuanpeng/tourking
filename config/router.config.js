export default [
      {
        path: "404",
        name: '404 page',
        component: "404"
      },
  // user
  {
    path: "/user",
    component: "../layouts/UserLayout",
    routes: [
      { path: "/user", redirect: "/user/login" },
      { path: "/user/login", name: "login", component: "./User/Login" },
      {
        path: "/user/register",
        name: "register",
        component: "./User/Register"
      },
      {
        path: "/user/register-result",
        name: "register.result",
        component: "./User/RegisterResult"
      },
      {
        component: "404"
      }
    ]
  },
  // app
  {
    path: "/",
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    routes: [
      // home
      {
        path: "/",
        component: "./Home/index"
      },
      // shop
      {
        path: "/shop",
        name: "shop",
        icon: "shop",
        authority: ["book", "shopaccount", "shopaddress"],
        routes: [
          {
            path: "/shop/book",
            name: "book",
            authority: "book",
            component: "./Shop/Book"
          },
          {
            path: "/shop/account",
            name: "account",
            authority: "shopaccount",
            component: "./Shop/Account"
          },
          {
            path: "/shop/shopaddress",
            name: "shopaddress",
            authority: "shopaddress",
            component: "./Shop/ShopAddress"
          }
        ]
      },
      // order
      {
        path: "/order",
        name: "order",
        icon: "bars",
        authority: ["shuttle", "dispatch", "chartered"],
        routes: [
          {
            path: "/order/shuttle",
            name: "shuttle",
            authority: "shuttle",
            component: "./Order/Shuttle"
          },{
            path: "/order/chartered",
            name: "chartered",
            authority: "chartered",
            component: "./Order/Chartered"
          },
          {
            path: "/order/dispatch",
            name: "dispatch",
            authority: "dispatch",
            component: "./Order/Dispatch"
          }
        ]
      },
      // user
      {
        path: "/usermanager",
        name: "usermanager",
        authority: ["role", "account", "shopmanager", "drivermanager"],
        icon: "user",
        routes: [
          {
            path: "/usermanager/role",
            name: "role",
            authority: "role",
            component: "./UserManager/Role"
          },
          {
            path: "/usermanager/account",
            name: "account",
            authority: "account",
            component: "./UserManager/Account"
          },
          {
            path: "/usermanager/shopmanager",
            name: "shopmanager",
            authority: "shopmanager",
            component: "./UserManager/ShopManager"
          },
          {
            path: "/usermanager/drivermanager",
            name: "drivermanager",
            authority: "drivermanager",
            component: "./UserManager/DriverManager"
          }
        ]
      },
      // base
      {
        path: "/base",
        name: "base",
        authority: [
          "coversmanager",
          "charteredmanager",
          "pricestrategy",
          "cartype",
          "carlevel",
          "carmanager",
          "dispatchstrategy",
          "address",
          "dirver"
        ],
        icon: "setting",
        routes: [
          {
            path: "/base/coversmanager",
            name: "coversmanager",
            authority: "coversmanager",
            component: "./Base/CoversManager"
          },
          {
            path: "/base/charteredmanager",
            name: "charteredmanager",
            authority: "charteredmanager",
            component: "./Base/CharteredManager"
          },
          {
            path: "/base/stepform",
            name: "stepform",
            component: "./Base/StepForm",
            hideInMenu: true
          },
          {
            path: "/base/pricestrategy",
            name: "pricestrategy",
            authority: "pricestrategy",
            component: "./Base/PriceStrategy"
          },
          {
            path: "/base/cartype",
            name: "cartype",
            authority: "cartype",
            component: "./Base/CarType"
          },
          {
            path: "/base/carlevel",
            name: "carlevel",
            authority: "carlevel",
            component: "./Base/CarLevel"
          },
          {
            path: "/base/carmanager",
            name: "carmanager",
            authority: "carmanager",
            component: "./Base/CarManager"
          },
          {
            path: "/base/dispatchStrategy",
            name: "dispatchstrategy",
            authority: "dispatchstrategy",
            component: "./Base/DispatchStrategy"
          },
          {
            path: "/base/address",
            name: "address",
            authority: "address",
            component: "./Base/Address"
          },
          {
            path: "/base/driver",
            name: "driver",
            authority: "driver",
            component: "./Base/Driver"
          }
        ]
      },
      // settlement
      {
        path: "/settlement",
        name: "settlement",
        authority: "settlement",
        icon: "fund",
        component: "./Settlement"
      },
      // refund
      {
        path: "/refund",
        name: "refund",
        authority: "refund",
        icon: "pay-circle",
        component: "./Refund"
      },
      {
        component: "404"
      }
    ]
  }
];
