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
import styles from "../index.less";
import moment from "moment";
import shop from "@/models/shop";
import LocationInput from "@/components/LocationInput";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const NewCarType = Form.create()(props => {
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
    if (type === "readonly") {
      handleModalVisible();
      return;
    }
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
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const readonly = type === "readonly";

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={type === "add" ? "新增" : type === "readonly" ? "详情" : "编辑"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="目的地">
        {readonly ? (
          <span>{formValues.name}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请输入目的地" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="详细地址">
        {form.getFieldDecorator("address", {
          initialValue:
            formValues.id && formValues.address
              ? {
                  address: formValues.address.address,
                  location: {
                    longitude: formValues.address.location.longitude,
                    latitude: formValues.address.location.latitude
                  }
                }
              : "",
          rules: [
            {
              required: true,
              message: "请选择详细地址"
            }
          ]
        })(<LocationInput isShop />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ user, shopAddress, loading }) => ({
  loading: loading.effects["shopAddress/fetchCarTypes"],
  data: shopAddress.list,
  shop_id: user.shopId,
  shop_name: user.shopName
}))
@Form.create()
export default class CarType extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  componentDidMount() {
    const { dispatch, shop_id } = this.props;
    if (shop_id) {
      dispatch({
        type: "shopAddress/fetchShopAddressList",
        payload: {
          shopId: shop_id,
          onFailure: msg => {
            message.error(msg || "获取常用地址列表失败");
          }
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shop_id && this.props.shop_id != nextProps.shop_id) {
      this.props.dispatch({
        type: "shopAddress/fetchShopAddressList",
        payload: {
          shopId: nextProps.shop_id,
          onFailure: msg => {
            message.error(msg || "获取常用地址列表失败");
          }
        }
      });
    }
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {}
    });
  };

  handleAdd = fields => {
    const { dispatch, shop_id } = this.props;
    if (!shop_id) return;
    let name = null;
    try {
      name = JSON.stringify(fields);
    } catch (error) {
      console.log(error);
      return;
    }
    dispatch({
      type: "shopAddress/saveShopAddress",
      payload: {
        data: {
          shopId: shop_id,
          name
        },
        onSuccess: () => {
          message.success("新增成功!");
        },
        onFailure: msg => {
          message.error(msg || "新增失败!");
        }
      }
    });
    this.handleModalVisible();
  };

  columns = [
    {
      title: "常用地点",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "详细地址",
      dataIndex: "address.address",
      key: "detail"
    },
    {
      title: "添加时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => moment(text).format("YYYY-MM-DD HH:mm")
    },
    {
      title: "操作",
      key: "action",
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
            title="确定删除该常用地址吗?"
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
    const { dispatch, shop_id } = this.props;
    const { formValues } = this.state;
    if (!shop_id) return;
    const data = {
      ...formValues,
      ...info
    };

    const { name, address, ...others } = data;
    const newName = JSON.stringify({ name, address });
    dispatch({
      type: "shopAddress/saveShopAddress",
      payload: {
        data: {
          shopId: shop_id,
          ...others,
          name: newName
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
    const { dispatch, shop_id } = this.props;
    if (!shop_id) return;
    dispatch({
      type: "shopAddress/deleteShopAddress",
      payload: {
        data: record.id,
        shopId: shop_id,
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
      <PageHeaderWrap title="常用地址管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增常用地址
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewCarType {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
