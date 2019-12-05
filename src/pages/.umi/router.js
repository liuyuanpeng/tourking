import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/liuyuanpeng/Documents/tourking/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/404",
    "name": "404 page",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__404" */'../404'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
    "exact": true
  },
  {
    "path": "/user",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "layouts__UserLayout" */'../../layouts/UserLayout'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "name": "login",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__User__models__register.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__User__Login" */'../User/Login'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/register",
        "name": "register",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__User__models__register.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__User__Register" */'../User/Register'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/register-result",
        "name": "register.result",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__User__models__register.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__User__RegisterResult" */'../User/RegisterResult'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__404" */'../404'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "path": "/",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Home__index" */'../Home/index'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/shop",
        "name": "shop",
        "icon": "shop",
        "authority": [
          "book",
          "shopaccount",
          "shopaddress"
        ],
        "routes": [
          {
            "path": "/shop/book",
            "name": "book",
            "authority": "book",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Shop__models__shopAddress.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Shop/models/shopAddress.js').then(m => { return { namespace: 'shopAddress',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Shop__Book" */'../Shop/Book'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/shop/account",
            "name": "account",
            "authority": "shopaccount",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Shop__models__shopAddress.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Shop/models/shopAddress.js').then(m => { return { namespace: 'shopAddress',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Shop__Account" */'../Shop/Account'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/shop/shopaddress",
            "name": "shopaddress",
            "authority": "shopaddress",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Shop__models__shopAddress.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Shop/models/shopAddress.js').then(m => { return { namespace: 'shopAddress',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Shop__ShopAddress" */'../Shop/ShopAddress'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/order",
        "name": "order",
        "icon": "bars",
        "authority": [
          "shuttle",
          "dispatch",
          "chartered"
        ],
        "routes": [
          {
            "path": "/order/shuttle",
            "name": "shuttle",
            "authority": "shuttle",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Order__models__shuttle.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/shuttle.js').then(m => { return { namespace: 'shuttle',...m.default}}),
  import(/* webpackChunkName: 'p__Order__models__warning.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/warning.js').then(m => { return { namespace: 'warning',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Order__Shuttle" */'../Order/Shuttle'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/order/chartered",
            "name": "chartered",
            "authority": "chartered",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Order__models__shuttle.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/shuttle.js').then(m => { return { namespace: 'shuttle',...m.default}}),
  import(/* webpackChunkName: 'p__Order__models__warning.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/warning.js').then(m => { return { namespace: 'warning',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Order__Chartered" */'../Order/Chartered'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/order/dispatch",
            "name": "dispatch",
            "authority": "dispatch",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Order__models__shuttle.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/shuttle.js').then(m => { return { namespace: 'shuttle',...m.default}}),
  import(/* webpackChunkName: 'p__Order__models__warning.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Order/models/warning.js').then(m => { return { namespace: 'warning',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Order__Dispatch" */'../Order/Dispatch'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/usermanager",
        "name": "usermanager",
        "authority": [
          "role",
          "account",
          "shopmanager",
          "drivermanager"
        ],
        "icon": "user",
        "routes": [
          {
            "path": "/usermanager/role",
            "name": "role",
            "authority": "role",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__UserManager__models__weixin.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/UserManager/models/weixin.js').then(m => { return { namespace: 'weixin',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__UserManager__Role" */'../UserManager/Role'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/usermanager/account",
            "name": "account",
            "authority": "account",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__UserManager__models__weixin.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/UserManager/models/weixin.js').then(m => { return { namespace: 'weixin',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__UserManager__Account" */'../UserManager/Account'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/usermanager/shopmanager",
            "name": "shopmanager",
            "authority": "shopmanager",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__UserManager__models__weixin.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/UserManager/models/weixin.js').then(m => { return { namespace: 'weixin',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__UserManager__ShopManager" */'../UserManager/ShopManager'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/usermanager/drivermanager",
            "name": "drivermanager",
            "authority": "drivermanager",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__UserManager__models__weixin.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/UserManager/models/weixin.js').then(m => { return { namespace: 'weixin',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__UserManager__DriverManager" */'../UserManager/DriverManager'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/base",
        "name": "base",
        "authority": [
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
        "icon": "setting",
        "routes": [
          {
            "path": "/base/coversmanager",
            "name": "coversmanager",
            "authority": "coversmanager",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__CoversManager" */'../Base/CoversManager'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/charteredmanager",
            "name": "charteredmanager",
            "authority": "charteredmanager",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__CharteredManager" */'../Base/CharteredManager'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/stepform",
            "name": "stepform",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__StepForm" */'../Base/StepForm'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/base/pricestrategy",
            "name": "pricestrategy",
            "authority": "pricestrategy",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__PriceStrategy" */'../Base/PriceStrategy'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/cartype",
            "name": "cartype",
            "authority": "cartype",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__CarType" */'../Base/CarType'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/carlevel",
            "name": "carlevel",
            "authority": "carlevel",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__CarLevel" */'../Base/CarLevel'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/carmanager",
            "name": "carmanager",
            "authority": "carmanager",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__CarManager" */'../Base/CarManager'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/dispatchStrategy",
            "name": "dispatchstrategy",
            "authority": "dispatchstrategy",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__DispatchStrategy" */'../Base/DispatchStrategy'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/address",
            "name": "address",
            "authority": "address",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__Address" */'../Base/Address'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/base/driver",
            "name": "driver",
            "authority": "driver",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Base__models__chartered.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/chartered.js').then(m => { return { namespace: 'chartered',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__comments.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/comments.js').then(m => { return { namespace: 'comments',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__covers.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/covers.js').then(m => { return { namespace: 'covers',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__dispatchStrategy.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/dispatchStrategy.js').then(m => { return { namespace: 'dispatchStrategy',...m.default}}),
  import(/* webpackChunkName: 'p__Base__models__formStepForm.js' */'/Users/liuyuanpeng/Documents/tourking/src/pages/Base/models/formStepForm.js').then(m => { return { namespace: 'formStepForm',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Base__Driver" */'../Base/Driver'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/settlement",
        "name": "settlement",
        "authority": "settlement",
        "icon": "fund",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Settlement" */'../Settlement'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/refund",
        "name": "refund",
        "authority": "refund",
        "icon": "pay-circle",
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Refund" */'../Refund'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__404" */'../404'),
  LoadingComponent: require('/Users/liuyuanpeng/Documents/tourking/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/liuyuanpeng/Documents/tourking/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
