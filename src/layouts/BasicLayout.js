import React from "react";
import { Layout, notification, Icon, Modal } from "antd";
import DocumentTitle from "react-document-title";
import { connect } from "dva";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import Media from "react-media";
import logo from "../assets/logo.png";
import Header from "./Header";
import Context from "./MenuContext";
import SiderMenu from "@/components/SiderMenu";
import getPageTitle from "@/utils/getPageTitle";
import styles from "./BasicLayout.less";

const { confirm } = Modal;

const newOrderAudio = document.createElement("audio");
newOrderAudio.src = "http://www.kingtrip.vip/sound/new_order.mp3";
const newDispatchAudio = document.createElement("audio");
newDispatchAudio.src = "http://www.kingtrip.vip/sound/new_dispatch.mp3";

function tryPlay() {
  newOrderAudio.muted = true;
  newDispatchAudio.muted = true;
  newOrderAudio.play();
  newDispatchAudio.play();
  document.onclick = null;
}

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import("@/components/SettingDrawer"));

const { Content } = Layout;

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599
  },
  "screen-xxl": {
    minWidth: 1600
  }
};

class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority }
    } = this.props;
    // 全局属性获取
    dispatch({
      type: "user/fetchUser",
      payload: {
        isAdmin: () => {
          document.onclick = tryPlay;
          localStorage.setItem("WARNING_COUNT", 0);
          setInterval(() => {
            // 检测新订单
            dispatch({
              type: "order/fetchNewOrder",
              payload: {
                onSuccess: data => {
                  if (data && data.length) {
                    const newestOrder = data[0];
                    const latestOrder = localStorage.getItem("LATEST_ORDER");
                    if (latestOrder) {
                      if (newestOrder.create_time > parseInt(latestOrder, 10)) {
                        notification.open({
                          message: "有新订单",
                          description: "请在订单管理页面中刷新查看",
                          icon: <Icon type="smile" style={{ color: "#108ee9" }} />
                        });
                        newOrderAudio.muted = false
                        newOrderAudio.play();
                      }
                    }
                    localStorage.setItem("LATEST_ORDER", newestOrder.create_time);
                  }
                }
              }
            });

            // 检测预警订单
            dispatch({
              type: "warning/fetchNewWarning",
              payload: {
                onSuccess: count => {
                  if (count) {
                    const latestCount = localStorage.getItem("WARNING_COUNT");
                    if (!latestCount || count > latestCount) {
                      notification.open({
                        message: "有预警订单",
                        description: "请在派单预警管理页面中刷新查看",
                        icon: <Icon type="smile" style={{ color: "#108ee9" }} />
                      });
                      newDispatchAudio.muted = false
                      newDispatchAudio.play();
                    }
                    localStorage.setItem("WARNING_COUNT", count);
                  }
                }
              }
            });
          }, 5000);
        }
      }
    });
    dispatch({
      type: "role/getRoles",
      payload: {
        page: 0,
        size: 10
      }
    });
    dispatch({
      type: "setting/getSetting"
    });
    dispatch({
      type: "menu/getMenuData",
      payload: { routes, path, authority }
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== "topmenu" && !isMobile) {
      return {
        paddingLeft: collapsed ? "80px" : "256px"
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === "production" && window.APP_TYPE !== "site") {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader
    } = this.props;

    const isTop = PropsLayout === "topmenu";
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {children}
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {/* <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense> */}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
