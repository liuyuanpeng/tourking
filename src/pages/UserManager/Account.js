import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Tree,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  InputNumber,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "./Account.less";
import { local } from "d3-selection";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

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

  const checkDriverEvaluate = (rule, value, callback) => {
    if (value < 1 || value > 5) {
      callback("请输入范围1~5的整数");
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
        {form.getFieldDecorator("mobile", {
          initialValue: formValues.mobile || "",
          rules: [
            { required: true, message: "请输入手机号" },
            { len: 11, message: "请输入正确的手机号" }
          ]
        })(<NumberInput disabled={type !== "add"} style={{ width: "100%" }} />)}
      </FormItem>
      {type === "add" && (
        <FormItem {...labelLayout} label="登录密码">
          {form.getFieldDecorator("password", {
            initialValue: formValues.password || "",
            rules: [
              { required: true, message: "请输入登录密码" },
              { min: 5, message: "请输入大于6个字符的密码" },
              { max: 20, message: "密码长度不能超过20个字符" }
            ]
          })(<Input style={{ width: "100%" }} />)}
        </FormItem>
      )}
      <FormItem {...labelLayout} label="联系人">
        {form.getFieldDecorator("name", {
          initialValue: formValues.name || ""
        })(<Input style={{ width: "100%" }} />)}
      </FormItem>
      {type === "add" && (
        <FormItem {...labelLayout} label="分配角色">
          {form.getFieldDecorator("role_id", {
            rules: [{ required: true, message: "请选择角色" }]
          })(
            <Select
              onChange={handleRoleChange}
              placeholder="请选择角色"
              style={{ width: "100%" }}
            >
              {roleOptions.map(role => {
                return (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      )}
      {selectRole.role_type === "PLATFORM_USER_INIT" && (
        <FormItem {...labelLayout} label="商家名称">
          {form.getFieldDecorator("shop_name", {
            rules: [
              {
                required: true,
                message: "请输入商家名称"
              }
            ]
          })(<Input style={{ width: "100%" }} />)}
        </FormItem>
      )}
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

@connect(({ user, loading }) => ({
  loading: loading.effects["user/fetchUserList"],
  searchLoading: loading.effects["user/searchUser"],
  data: user.list,
  totalPages: user.total,
  currentPage: user.current
}))
@Form.create()
export default class Account extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    selectRole: {},
    roleOptions: [],
    currentRoleIndex: 0,
    type: "add"
  };

  componentDidMount() {
    try {
      const roles = JSON.parse(localStorage.getItem("roles"));
      this.setState({
        roleOptions: roles.filter(item => {
          return item.role_type !== "APPLICATION_ADMIN_INIT";
        })
      });
    } catch (error) {
      return;
    }

    this.props.dispatch({
      type: "user/fetchUserList",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg=>{
          message.error(msg || '获取账号列表失败')
        }
      }
    });
  }

  handleRoleChange = value => {
    this.state.roleOptions &&
      this.state.roleOptions.forEach(item => {
        if (item.id === value) {
          this.setState({
            selectRole: item
          });
          return;
        }
      });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.username
          ? dispatch({
              type: "user/searchUser",
              payload: values.username
            })
          : dispatch({
              type: "user/fetchUserList",
              payload: {
                page: 0,
                size: 10,
                onFailure: msg=>{
                  message.error(msg || '获取账号列表失败')
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/tryCreateUser",
      payload: {
        data: fields,
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
          let addRole = roleOptions.find(
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

  onSelectRole = value => {
    this.setState({
      currentRoleIndex: value
    });
  };

  renderForm = roleOptions => {
    const {
      searchLoading,
      form: { getFieldDecorator }
    } = this.props;
    const { currentRoleIndex } = this.state;
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
        let roles = [];
        record.roles &&
          record.roles.forEach(item => {
            item && roles.push(item.name);
          });
        return roles.toString();
      }
    },
    {
      title: "商家名称",
      dataIndex: "user.shop_name",
      key: "shop_name"
    },
    {
      title: "添加时间",
      dataIndex: "user.create_time",
      key: "create_time",
      render: text => moment(text).format("YYYY-MM-DD hh:mm:ss")
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

  handleEdit = info => {
    const { dispatch, currentPage } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: "user/updateUser",
      payload: {
        data: {
          ...formValues,
          ...info,
          user_id: formValues.id
        },
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
        onFailure: () => {
          message.error("删除失败");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "user/fetchUserList",
      payload: {
        page,
        size,
        onFailure: msg=>{
          message.error(msg || '获取账号列表失败')
        }
      }
    });
  };

  render() {
    const { loading, data, currentPage, totalPages } = this.props;

    const { modalVisible, roleOptions, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      selectRole: this.state.selectRole,
      roleOptions: roleOptions || [],
      handleRoleChange: this.handleRoleChange,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues
    };
    return (
      <PageHeaderWrap title="账户管理">
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
                  新增账号
                </Button>
              </div>
              <Table
                rowKey={record => record.user.id}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  current: currentPage,
                  total: totalPages,
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page, pageSize);
                  }
                }}
                loading={loading}
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
