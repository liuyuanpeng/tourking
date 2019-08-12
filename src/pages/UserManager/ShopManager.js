import React, { PureComponent } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message,
  Spin
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import moment from "moment";
import styles from "../index.less";

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;

const NewAccount = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    selectRole,
    roleOptions,
    handleRoleChange,
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

  const checkDriverEvaluate = (rule, value, callback) => {
    if (value < 1 || value > 10) {
      callback("请输入范围1~10的整数");
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={type === "add" ? "新增账号" : "编辑账号"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="手机号">
        {form.getFieldDecorator("mobile", {
          initialValue: formValues.mobile || "",
          rules: [
            { required: true, message: "请输入手机号" },
            { len: 11, message: "请输入正确的手机号" }
          ]
        })(<NumberInput disabled={type !== "add"} style={{ width: "100%" }} />)}
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
      <FormItem {...labelLayout} label="商家名称">
        {form.getFieldDecorator("name", {
          initialValue: formValues.name || "",
          rules: [{ required: true, message: "请输入联系人" }]
        })(<Input style={{ width: "100%" }} />)}
      </FormItem>

      {selectRole.role_type === "APPLICATION_USER_CUSTOM" &&
        selectRole.is_init && (
          <FormItem {...labelLayout} label="司机评分">
            {form.getFieldDecorator("driver_evaluate", {
              rules: [
                {
                  required: true,
                  message: "请设置司机评分",
                  initialValue: 5
                },
                {
                  validator: checkDriverEvaluate
                }
              ]
            })(<NumberInput />)}
          </FormItem>
        )}
    </Modal>
  );
});

@connect(({ user, weixin, loading, role }) => ({
  loading: loading.effects["user/fetchUserList"],
  searchLoading: loading.effects["user/searchUser"],
  qrCodeLoading: loading.effects["weixin/fetchQRCode"],
  data: user.list,
  totalPages: user.total,
  currentPage: user.page,
  roleList: role.roles,
  qrCode: weixin.qrCode
}))
@Form.create()
class ShopManager extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    QRCodeVisible: false,
    loadingMessage: "",
    formValues: {},
    selectRole: {},
    roleOptions: [],
    type: "add"
  };

  columns = [
    {
      title: "账号",
      dataIndex: "user.mobile",
      key: "name"
    },
    {
      title: "联系人",
      dataIndex: "user.name",
      key: "contact"
    },
    {
      title: "角色名称",
      dataIndex: "role_name",
      key: "role_name",
      render: (text, record) => {
        const roles = [];
        if (record.roles) {
          record.roles.forEach(item => {
            item && roles.push(item.name);
          });
        }
        return roles.toString();
      }
    },
    {
      title: "添加时间",
      dataIndex: "user.create_time",
      key: "create_time",
      render: text => moment(text).format("YYYY-MM-DD HH:mm")
    },
    {
      title: "最后登录",
      dataIndex: "token_session.update_time",
      key: "token_session.update_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "二维码",
      key: "QRCode",
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a
            href="javascript:;"
            onClick={() => {
              this.onQRCode(record);
            }}
          >
            显示二维码
          </a>
        </span>
      )
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (text, record) => (
        <span className={styles.actionColumn}>
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
    try {
      const roles = JSON.parse(localStorage.getItem("roles"));
      this.setState({
        roleOptions: roles.filter(item => {
          return item.role_type !== "APPLICATION_ADMIN_INIT";
        })
      });
      const shopRole = roles.find(item => {
        return item.role_type === "PLATFORM_USER_INIT";
      });
      this.setState({ selectRole: shopRole });
      this.shopRoleId = shopRole ? shopRole.id : undefined;
    } catch (error) {
      return;
    }

    const { dispatch } = this.props;
    this.shopRoleId &&
      dispatch({
        type: "user/fetchUserList",
        payload: {
          role: this.shopRoleId,
          page: 0,
          size: 10,
          onFailure: msg => {
            message.error(msg || "获取账号列表失败");
          }
        }
      });
  }

  handleRoleChange = value => {
    const { roleOptions } = this.state;
    if (!roleOptions) return;
    roleOptions.forEach(item => {
      if (item.id === value) {
        this.setState({
          selectRole: item
        });
        return null;
      }
      return null;
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    if (!this.shopRoleId) return;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.username
          ? dispatch({
              type: "user/searchUser",
              payload: {
                keyword: values.username,
                role: this.shopRoleId
              }
            })
          : dispatch({
              type: "user/fetchUserList",
              payload: {
                role: this.shopRoleId,
                page: 0,
                size: 10,
                onFailure: msg => {
                  message.error(msg || "获取账号列表失败");
                }
              }
            });
      }
    });
  };

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {}
    });
  };

  handleQRCodeVisible = flag => {
    this.setState({
      QRCodeVisible: !!flag
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { selectRole } = this.state;
    const data = { ...fields, role_id: this.shopRoleId };
    if (selectRole.role_type === "PLATFORM_USER_INIT") {
      data.shop_name = fields.name;
    }
    dispatch({
      type: "user/tryCreateUser",
      payload: {
        data,
        onSuccess: () => {
          message.success("新增成功!");
        },
        onFailure: msg => {
          message.error(msg || "新增失败!");
        },
        onCreate: () => {
          message.error("该账号已存在!");
        },
        onCanAddRole: payload => {
          const { roleOptions } = this.state;
          const addRole = roleOptions.find(
            item => item.id === payload.params.role_id
          );
          confirm({
            title: "确认添加账号?",
            content: `该账号已存在，为该角色添加${addRole.name}权限?`,
            onOk: () => {
              dispatch({
                type: "user/addUserRole",
                payload: {
                  user: payload.user,
                  params: payload.params,
                  role: addRole,
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

  renderForm = () => {
    const {
      roleList,
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={9}>
            <FormItem label="精确查找">
              {getFieldDecorator("username")(
                <Input placeholder="用户名/手机号" />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button onClick={this.handleSearch} type="primary">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  handleEdit = info => {
    const { dispatch, currentPage } = this.props;
    const { formValues } = this.state;
    const { password, name } = info;
    const data = {
      ...formValues,
      name,
      user_id: formValues.id,
      role_id: this.shopRoleId
    };
    if (password) {
      data.password = password;
    }
    dispatch({
      type: "user/updateUser",
      payload: {
        data,
        page: currentPage,
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
      formValues: { ...record.user },
      modalVisible: true,
      type: "edit"
    });
  };

  onQRCode = record => {
    const { dispatch } = this.props;
    this.handleQRCodeVisible(true);
    dispatch({
      type: "weixin/fetchQRCode",
      payload: {
        user_id: record.user.id,
        onLoad: msg => {
          this.setState({
            loadingMessage: msg || ""
          });
        },
        onFailure: msg => {
          message.error(msg || "获取二维码失败");
        }
      }
    });
  };

  handleDelete = record => {
    const { dispatch, currentPage } = this.props;
    dispatch({
      type: "user/deleteUser",
      payload: {
        id: record.user.id,
        page: currentPage,
        onSuccess: () => {
          message.success("删除成功");
        },
        onFailure: msg => {
          message.error(msg || "删除失败");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/fetchUserList",
      payload: {
        role: this.shopRoleId,
        page,
        size,
        onFailure: msg => {
          message.error(msg || "获取账号列表失败");
        }
      }
    });
  };

  saveQRCode = () => {
    const { qrCode } = this.props;
    if (!qrCode) {
      message.error("当前没有为商家二维码图片");
      return;
    }

    const aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = qrCode;
    aLink.download = "商家二维码.jpeg";
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
  };

  render() {
    const {
      loading,
      data,
      currentPage,
      totalPages,
      qrCode,
      qrCodeLoading
    } = this.props;
    const {
      modalVisible,
      QRCodeVisible,
      roleOptions,
      type,
      formValues,
      selectRole,
      loadingMessage
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectRole,
      roleOptions: roleOptions || [],
      handleRoleChange: this.handleRoleChange,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues
    };
    return (
      <PageHeaderWrap title="商家管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm(roleOptions)}
            </div>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增商家
                </Button>
              </div>
              <Table
                rowKey={record => record.user.id}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  current: currentPage + 1,
                  total: 10 * totalPages,
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page - 1, pageSize);
                  }
                }}
                dataSource={data}
                columns={this.columns}
                scroll={{ x: 1200 }}
              />
            </div>
          </div>
        </Card>
        <NewAccount {...parentMethods} modalVisible={modalVisible} />
        <Modal
          destroyOnClose
          style={{
            textAlign: 'center'
          }}
          onOk={() => this.handleQRCodeVisible()}
          onCancel={() => this.handleQRCodeVisible()}
          footer={[
            <Button key="onSave" onClick={this.saveQRCode}>
              保存二维码
            </Button>,
            <Button
              key="onOK"
              type="primary"
              onClick={() => this.handleQRCodeVisible()}
            >
              关闭
            </Button>
          ]}
          title="商家二维码"
          visible={QRCodeVisible}
        >
          <Spin spinning={qrCodeLoading} tip={loadingMessage}>
            <img src={qrCode} />
          </Spin>
        </Modal>
      </PageHeaderWrap>
    );
  }
}

export default ShopManager;
