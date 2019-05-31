import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";

import { Alert, message } from "antd";
import Login from "@/components/Login";
import styles from "./Login.less";

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "account"
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(["mobile"], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: "login/getCaptcha",
            payload: values.mobile
          })
            .then(resolve)
            .catch(reject);
          message.warning(
            formatMessage({ id: "app.login.verification-code-warning" })
          );
        }
      });
    });

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          ...values
        }
      });
    }
  };

  renderMessage = content => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab={formatMessage({ id: "app.login.tab-login-credentials" })}
          >
            {login.status === "error" &&
              !submitting &&
              this.renderMessage(
                login.message ||
                  formatMessage({ id: "app.login.message-invalid-credentials" })
              )}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: "app.login.userName" })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: "validation.userName.required" })
                }
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: "app.login.password" })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: "validation.password.required" })
                }
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
