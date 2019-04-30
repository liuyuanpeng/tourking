import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from 'moment'
import {
  Tree,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  Table,
  Divider,
  Modal
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import styles from "./Role.less";

const { TextArea } = Input;
const FormItem = Form.Item;
const { TreeNode } = Tree;

const NewRole = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const labelLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 }
  };

  return (
    <Modal
      destroyOnClose
      title="新增角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="角色名称">
            {form.getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入角色名称"
                }
              ]
            })(<Input />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="角色描述">
            {form.getFieldDecorator("desc")(<TextArea row={4} />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

const PermissionSetting = Form.create()(props => {
  const {
    modalVisible,
    selectKeys,
    form,
    handlePermissionSetting,
    handlePermissionModalVisible
  } = props;

  let result;

  const okHandle = () => {
    handlePermissionSetting(result);
  };

  const onSelect = (selectKeys, e) => {
    console.log("selectkets: ", selectKeys, e);
    result = selectKeys;
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  const labelLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
  };

  const treeData = [
    {
      title: "合作商家",
      key: "shop",
      children: [
        {
          title: "预约订单",
          key: "book"
        },
        {
          title: "账户管理",
          key: "shopaccount"
        }
      ]
    },
    {
      title: "用户管理",
      key: "usermanager",
      children: [
        {
          title: "角色管理",
          key: "role"
        },
        {
          title: "账户管理",
          key: "account"
        },
        {
          title: "司机评级",
          key: "driver"
        }
      ]
    },
    {
      title: "基础配置",
      key: "base",
      children: [
        {
          title: "价格策略",
          key: "pricestrategy"
        },
        {
          title: "车型分级",
          key: "cartype"
        },
        {
          title: "车辆管理",
          key: "carmanager"
        },
        {
          title: "派单策略",
          key: "dispatchstrategy"
        },
        {
          title: "常用地址",
          key: "address"
        }
      ]
    },
    {
      title: "结算管理",
      key: "settlement"
    },
    {
      title: "退款管理",
      key: "refund"
    }
  ];

  return (
    <Modal
      destroyOnClose
      title="权限设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handlePermissionModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout}>
            {form.getFieldDecorator("permission")(
              <Tree
              autoExpandParent
                onCheck={(selectKeys, e) => {
                  onSelect(selectKeys, e);
                }}
                selectKeys={selectKeys}
                checkable
              >
                {renderTreeNodes(treeData)}
              </Tree>
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ role, loading }) => ({
  submitting: loading.effects["form/submitRegularForm"],
  data: role.roles
}))
@Form.create()
export default class Role extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  };

  state = {
    permissionModalVisible: false,
    modalVisible: false,
    formValues: {}
  };

  componentDidMount() {
    this.props.dispatch({
      type: "role/getRoles",
      payload: {
        page: 0,
        size: 10
      }
    });
  }

  handleSearch = () => {};

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    console.log("handleAdd: ", fields);
    this.handleModalVisible();
  };

  handlePermissionModalVisible = flag => {
    this.setState({
      permissionModalVisible: !!flag
    });
  };

  handlePermissionSetting = result => {
    console.log("result: ", result);
    this.handlePermissionModalVisible();
  };

  onPermissionClick = record => {
    record.extend && (this.selectKeys = record.extend.split(","));
    this.handlePermissionModalVisible(true);
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced arrangement>
          <Col span={5}>
            <FormItem label="精确查找">
              {getFieldDecorator("key")(<Input placeholder="角色名称" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button
              onClick={() => {
                this.handleSearch;
              }}
            >
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "职责描述",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "添加时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text, record) => (
        moment(text).format('YYYY-MM-DD hh:mm:ss')
      )
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.onPermissionClick(record)}>
            权限设置
          </a>
          <Divider type="vertical" />
          <a href="javascript:;">删除角色</a>
        </span>
      )
    }
  ];

  render() {
    const { loading, data = [] } = this.props;
    const { modalVisible, permissionModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };

    const permissionMethod = {
      handlePermissionSetting: this.handlePermissionSetting,
      handlePermissionModalVisible: this.handlePermissionModalVisible,
      selectKeys: this.selectKeys || []
    };

    return (
      <PageHeaderWrap title="角色管理">
        <Card bordered={false}>
          <div className={styleMedia.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增角色
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={this.props.data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewRole {...parentMethods} modalVisible={modalVisible} />
        <PermissionSetting
          {...permissionMethod}
          modalVisible={permissionModalVisible}
        />
      </PageHeaderWrap>
    );
  }
}
