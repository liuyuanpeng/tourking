import React, { PureComponent } from "react";
import {
  Card,
  Form,
  Button,
  Input,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import moment from "moment";
import styles from "./index.less";

const FormItem = Form.Item;
const { confirm } = Modal;

const NewAccount = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (type === "add") {
        handleAdd(fieldsValue);
      } else {
        handleEdit(fieldsValue);
      }
    });
  };

  const labelLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 }
  };

  const readonly = type === "readonly";

  const checkPassword = (rule, value, callback) => {
    if (!value && type === "edit") {
      callback();
      return;
    }
    if (value && value.length < 6) {
      callback("请输入大于6个字符的密码");
      return;
    }
    if (value && value.length > 20) {
      callback("密码长度不能超过20个字符");
      return;
    }
    callback();
  };
  
  return (
    <Modal
      destroyOnClose
      title={type === "add" ? "新增账号" : "编辑账号"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="手机号">
        {type === "edit" ? (
          <span>{formValues.mobile || ""}</span>
        ) : (
          form.getFieldDecorator("mobile", {
            initialValue: formValues.mobile || "",
            rules: [
              { required: true, message: "请输入手机号" },
              { len: 11, message: "请输入正确的手机号" }
            ]
          })(<NumberInput style={{ width: "100%" }} />)
        )}
      </FormItem>
      {type !== "readonly" && (
        <FormItem {...labelLayout} label="登录密码">
          {form.getFieldDecorator("password", {
            initialValue: formValues.password || "",
            rules: [
              { required: type === "add", message: "请输入登录密码" },
              { validator: checkPassword }
            ]
          })(
            <Input
              placeholder={type === "add" ? "" : "不填写密码不会修改密码"}
              style={{ width: "100%" }}
            />
          )}
        </FormItem>
      )}
      <FormItem {...labelLayout} label="员工姓名">
        {readonly ? (
          <span>{formValues.name || ""}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请输入员工姓名" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ user, loading }) => ({
  loading: loading.effects["user/fetchShopUserList"],
  data: user.shopUserList
}))
@Form.create()
class Account extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "添加时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => moment(text).format("YYYY-MM-DD hh:mm")
    },
    {
      title: "最后登录",
      dataIndex: "recent_login",
      key: "recent_login"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <a
            href="javascript:;"
            onClick={() => {
              this.onEdit(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该账号吗?"
            onConfirm={() => {
              this.handleDelete(record);
            }}
            okText="是"
            cancelText="否"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];

  componentDidMount() {
    const shop_id = localStorage.getItem("shop-id");
    const { dispatch } = this.props;
    dispatch({
      type: "user/fetchShopUserList",
      payload: {
        shop_id,
        onFailure: msg => {
          message.error(msg || "获取账号列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    const roles = JSON.parse(localStorage.getItem("roles"));
    const employeeRole = roles.find(
      item => item.role_type === "APPLICATION_ADMIN_INIT"
    );
    if (!employeeRole) {
      message.error("员工角色不存在,创建失败");
      return;
    }
    const shop_id = localStorage.getItem("shop-id");
    const shop_name = localStorage.getItem("shop-name");
    employeeRole &&
      shop_id &&
      shop_name &&
      dispatch({
        type: "user/tryCreateShopUser",
        payload: {
          data: {
            ...fields,
            role_id: employeeRole.id,
            shop_id,
            shop_name
          },
          onSuccess: () => {
            message.success("新增成功!");
          },
          onFailure: msg => {
            message.error(msg || "新增失败!");
          },
          onCanAddRole: payload => {
            confirm({
              title: "确认添加账号?",
              content: `该账号已存在，为该角色添加商家角色权限?`,
              onOk: () => {
                dispatch({
                  type: "user/addShopUserRole",
                  payload: {
                    user: payload.user,
                    params: payload.params,
                    onSuccess: () => {
                      message.success("成功添加角色");
                    },
                    onFailure: msg => {
                      msg && message.error(msg);
                    }
                  }
                });
              }
            });
          }
        }
      });
    this.handleModalVisible();
  };

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: "user/updateShopUser",
      payload: {
        data: {
          ...formValues,
          ...info,
          user_id: formValues.id
        },
        onSuccess: () => {
          message.success("操作成功");
        },
        onFailure: msg => {
          message.error(msg || "操作失败");
        }
      }
    });
    this.setState({
      formValues: {},
      modalVisible: false,
      type: "add"
    });
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit"
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/deleteShopUser",
      payload: {
        id: record.user.id,
        onSuccess: () => {
          message.success("删除成功");
        },
        onFailure: msg => {
          message.error(msg || "删除失败");
        }
      }
    });
  };

  render() {
    const { loading, data } = this.props;

    const { modalVisible, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues
    };
    return (
      <PageHeaderWrap title="账户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增账号
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                pagination={false}
                dataSource={data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewAccount {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}

export default Account;
