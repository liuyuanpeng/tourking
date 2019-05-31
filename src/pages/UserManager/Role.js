import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Tree,
  Card,
  Form,
  Row,
  Col,
  Button,
  Input,
  Table,
  Divider,
  Modal,
  Popconfirm
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import styles from "./index.less";

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
            {form.getFieldDecorator("description")(<TextArea row={4} />)}
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
    handlePermissionSetting,
    handlePermissionModalVisible
  } = props;

  let result;

  const okHandle = () => {
    handlePermissionSetting(result);
  };

  const onSelect = keys => {
    result = keys;
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

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
      title: "订单管理",
      key: "order",
      children: [
        {
          title: "接送机站",
          key: "shuttle"
        },
        {
          title: "派单预警",
          key: "dispatch"
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
          title: "车辆分类",
          key: "cartype"
        },
        {
          title: "车型分级",
          key: "carlevel"
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
      <Tree
        autoExpandParent
        onCheck={(keysSelect, e) => {
          onSelect(keysSelect, e);
        }}
        defaultCheckedKeys={selectKeys}
        checkable
      >
        {renderTreeNodes(treeData)}
      </Tree>
    </Modal>
  );
});

@connect(({ role, loading }) => ({
  submitting: loading.effects["form/submitRegularForm"],
  data: role.roles
}))
@Form.create()
class Role extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  };

  static defaultProps = {
    role: {}
  }

  state = {
    permissionModalVisible: false,
    modalVisible: false
  };

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
      render: (text) => moment(text).format("YYYY-MM-DD hh:mm")
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) =>
        record.is_init ? null : (
          <span>
            <a
              href="javascript:;"
              onClick={() => this.onPermissionClick(record)}
            >
              权限设置
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该角色吗?"
              onConfirm={() => {
                this.confirmDelete(record);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">删除角色</a>
            </Popconfirm>
          </span>
        )
    }
  ];

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    const {dispatch} = this.props
    dispatch({
      type: "role/addRole",
      payload: {
        ...fields,
        role_type: "APPLICATION_USER_CUSTOM"
      }
    });
    this.handleModalVisible();
  };

  handlePermissionModalVisible = flag => {
    this.setState({
      permissionModalVisible: !!flag
    });
  };

  handlePermissionSetting = result => {
    if (result){
      const {dispatch} = this.props
      dispatch({
        type: "role/saveRole",
        payload: {
          ...this.record,
          extend: result.toString()
        }
      });}
    this.handlePermissionModalVisible();
  };

  onPermissionClick = record => {
    record.extend && (this.selectKeys = record.extend.split(","));
    record.id && (this.record = record);
    this.handlePermissionModalVisible(true);
  };

  confirmDelete = record => {
    if (record && record.role_type === "APPLICATION_USER_CUSTOM"){
      const {dispatch} = this.props
      dispatch({
        type: "role/deleteRole",
        payload: record.id
      });
    }
  };

  render() {
    const { loading, data } = this.props;
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
                dataSource={data}
                columns={this.columns}
                pagination={false}
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
export default Role;
