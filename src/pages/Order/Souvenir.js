import React, { PureComponent } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Card,
  Form,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
  Popconfirm
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import LocationInput from "@/components/LocationInput";
import moment from "moment";
import NumberInput from "@/components/NumberInput";
import ORDER_STATUS from "./souvenirStatus";
import styles from "../index.less";
import OrderHistory from "@/components/OrderHistory";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const INIT_SCENE = "BANSHOU_PRIVATE";

const NewOrder = Form.create()(props => {
  const {
    type,
    handleEdit,
    modalVisible,
    form,
    handleModalVisible,
    formValues,
    updateFormValue
  } = props;

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  const readonly = type === "readonly";

  const okHandle = () => {
    if (readonly) return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const originChange = value => {
    updateFormValue({
      start_longitude: value.location.longitude,
      start_latitude: value.location.latitude,
      start_place: value.address
    });
  };

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={type === "edit" ? "编辑" : "详情"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="类型">
            <span>
              {formValues.scene === "DAY_PRIVATE" ? "按天包车" : "线路包车"}
            </span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车时间">
            {readonly ? (
              <span>
                {formValues.start_time
                  ? moment(formValues.start_time).format("YYYY-MM-DD HH:mm")
                  : ""}
              </span>
            ) : (
              form.getFieldDecorator("start_time", {
                rules: [
                  {
                    required: true,
                    message: "请选择上车时间"
                  }
                ],
                initialValue: formValues.start_time
                  ? moment(formValues.start_time)
                  : null
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  // showTime={{ format: "HH:mm" }}
                  placeholder="上车时间"
                  style={{ width: "100%" }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车地点">
            {readonly ? (
              <span>{formValues.start_place}</span>
            ) : (
              form.getFieldDecorator("start_location", {
                rules: [
                  {
                    required: true,
                    message: "请选择上车地点"
                  }
                ],
                initialValue:
                  type === "edit"
                    ? {
                        address: formValues.start_place,
                        location: {
                          longitude: formValues.start_longitude,
                          latitude: formValues.start_latitude
                        }
                      }
                    : undefined
              })(<LocationInput onChange={originChange} />)
            )}
          </FormItem>
        </Col>
        {formValues.price && (
          <Col>
            <FormItem {...labelLayout} label="价格">
              <span>{formValues.price || ""}</span>
            </FormItem>
          </Col>
        )}
        <Col>
          <FormItem {...labelLayout} label="乘客姓名">
            {readonly ? (
              <span>{formValues.username || ""}</span>
            ) : (
              form.getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "请输入乘客姓名"
                  }
                ],
                initialValue: formValues.username || ""
              })(<Input />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="联系电话">
            {readonly ? (
              <span>{formValues.mobile || ""}</span>
            ) : (
              form.getFieldDecorator("mobile", {
                rules: [
                  {
                    required: true,
                    message: "请输入联系电话"
                  },
                  {
                    len: 11,
                    message: "请输入正确的手机号码"
                  }
                ],
                initialValue: formValues.mobile || ""
              })(<NumberInput numberType="positive integer" />)
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ order, loading }) => ({
  loading: loading.effects["order/fetchOrderPage"],
  historyLoading: loading.effects["order/fetchOrderHistory"],
  data: order.list,
  page: order.page,
  total: order.total,
  orderHistory: order.history
}))
@Form.create()
class Souvenir extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    historyVisible: false,
    formValues: {},
    type: "readonly"
  };

  columns = [
    {
      title: "订单状态",
      dataIndex: "order_status",
      key: "order_status",
      render: text => {
        const status = ORDER_STATUS.find(item => item.name === text);
        return text && status ? status.desc : "";
      }
    },
    {
      title: "收货人姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "电话",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "收货地址",
      dataIndex: "receive_address",
      key: "receive_address",
      render: text => (
        <Tooltip title={text}>
          <div
            style={{
              width: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: "下单时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "订单ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "操作",
      fixed: "right",
      key: "aciton",
      width: 150,
      render: (text, record) => {
        const status = ORDER_STATUS.find(
          item => item.name === record.order_status
        );
        const statusName = status ? status.desc : "";
        
        return (
          <span className={styles.actionColumn}>
            <a href="javascript:;" onClick={() => this.onReadonly(record)}>
              查看
            </a>
            {(statusName === "待发货" || statusName === "已发货") && (
              <Divider type="vertical" />
            )}
            {statusName === "待发货" && (
              <Popconfirm
                title="确认现在发货？"
                onConfirm={() => {
                  this.handleDispatch(record);
                }}
                okText="是"
                cancelText="否"
              >
                <a href="javascript:;">发货</a>
              </Popconfirm>
            )}
            {statusName === "已发货" && (
              <Popconfirm
                title="确定该订单已交易完成？"
                onConfirm={() => {
                  this.handleFinish(record);
                }}
                okText="是"
                cancelText="否"
              >
                <a href="javascript:;">完成订单</a>
              </Popconfirm>
            )}
          </span>
        );
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = { scene: INIT_SCENE };
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取订单列表失败");
        }
      }
    });
  }

  onReadonly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly"
    });
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit"
    });
  };

  handleCancel = record => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "order/cancelOrder",
      payload: {
        id: record.id,
        ...this.searchKeys,
        page,
        size: 10,
        onSuccess: () => {
          message.success("取消订单成功");
        },
        onFailure: msg => {
          message.error(msg || "取消订单失败");
        }
      }
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleHistoryVisible = flag => {
    this.setState({
      historyVisible: !!flag
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });

      if (!this.searchKeys.scene) {
        this.searchKeys.scene = INIT_SCENE;
      }
      if (this.searchKeys.time_range) {
        delete this.searchKeys.time_range;
        this.searchKeys = {
          ...this.searchKeys,
          start: values.time_range[0].startOf("day").valueOf(),
          end: values.time_range[1].endOf("day").valueOf()
        };
      }
      const fileName = "订单列表.xls";
      dispatch({
        type: "order/exportOrder",
        payload: {
          ...this.searchKeys
        },
        callback: response => {
          if (response.type.indexOf("application/json") !== -1) {
            message.error(response.message || "导出失败");
            return;
          }
          const blob = new Blob([response], { type: "Files" });
          const aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = URL.createObjectURL(blob);
          aLink.download = fileName;
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
        }
      });
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });

      if (!this.searchKeys.scene) {
        this.searchKeys.scene = INIT_SCENE;
      }
      if (this.searchKeys.time_range) {
        delete this.searchKeys.time_range;
        this.searchKeys = {
          ...this.searchKeys,
          start: values.time_range[0].startOf("day").valueOf(),
          end: values.time_range[1].endOf("day").valueOf(),
          type: 1
        };
      }
      dispatch({
        type: "order/fetchOrderPage",
        payload: {
          page: 0,
          size: 10,
          ...this.searchKeys,
          onFailure: msg => {
            message.error(msg || "获取订单列表失败!");
          }
        }
      });
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.searchKeys = { scene: INIT_SCENE };
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取订单列表失败!");
        }
      }
    });
  };

  handleRefresh = () => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取订单列表失败!");
        }
      }
    });
  };

  disabledDate = current => {
    return current && current > moment().endOf("day");
  };

  handleEdit = info => {
    const { dispatch, page } = this.props;
    const { formValues } = this.state;
    const {
      start_time,
      car_config_id,
      start_location,
      end_location,
      route,
      ...others
    } = info;

    const params = {
      start_time: start_time.valueOf(),
      start_place: start_location.address,
      start_longitude: start_location.location.longitude,
      start_latitude: start_location.location.latitude,
      target_place: end_location.address,
      target_longitude: end_location.location.longitude,
      target_latitude: end_location.location.latitude
    };

    if (route && route.time && route.kilo) {
      params.priceParams = {
        kilo: route.kilo,
        time: route.time
      };
    }

    if (
      car_config_id !== formValues.car_config_id ||
      others.scene !== formValues.scene
    ) {
      if (!params.priceParams) {
        if (formValues.kilo && formValues.time) {
          params.priceParams = {
            kilo: formValues.kilo,
            time: formValues.time
          };
        } else {
          message.error("上车地点或者目的地数据有误，请重新编辑!");
          return;
        }
      }
    }

    dispatch({
      type: "order/updateOrder",
      payload: {
        data: {
          ...formValues,
          ...others,
          ...params,
          searchParams: {
            ...this.searchKeys,
            page,
            size: 10
          }
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
      modalVisible: false
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page,
        size,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取订单列表失败");
        }
      }
    });
  };

  updateFormValue = params => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      ...params
    };
    this.setState({
      formValues: {
        ...newFormValues,
        price: undefined
      }
    });

    const { dispatch } = this.props;
    const { scene, car_config_id, kilo, time, start_time } = newFormValues;
    if (scene && car_config_id && kilo && time) {
      dispatch({
        type: "order/getPrice",
        payload: {
          scene,
          car_config_id,
          kilo,
          time,
          start_time,
          onFailure: msg => {
            message.error(msg || "获取价格失败!");
          },
          onSuccess: price => {
            this.setState({
              formValues: {
                ...newFormValues,
                price
              }
            });
          }
        }
      });
    }
  };

  showHistory = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: "order/fetchOrderHistory",
      payload: {
        orderId: id,
        onSuccess: data => {
          if (!data || data.length <= 0) {
            message.info("暂无该订单的历史记录!");
          } else {
            this.handleHistoryVisible(true);
          }
        },
        onFailure: msg => {
          message.error(msg || "获取订单历史失败!");
        }
      }
    });
  };

  handleDispatch = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: "order/changeOrderStatus",
      payload: {
        order_id: id,
        order_status: "ON_THE_WAY",
        onSuccess: () => {
          this.handleRefresh();
          message.info("操作成功");
        },
        onFailure: msg => {
          message.info(msg || "操作失败");
        }
      }
    });
  };

  handleFinish = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: "order/changeOrderStatus",
      payload: {
        order_id: id,
        order_status: "DONE",
        onSuccess: () => {
          this.handleRefresh();
          message.info("操作成功");
        },
        onFailure: msg => {
          message.info(msg || "操作失败");
        }
      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={8}>
            <FormItem label="订单状态">
              {getFieldDecorator("order_status")(
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="WAIT_APPROVAL_OR_PAY">待付款</Option>
                  <Option value="WAIT_ACCEPT">待发货</Option>
                  <Option value="ON_THE_WAY">已发货</Option>
                  <Option value="DONE">已完成</Option>
                  <Option value="CANCEL_USER">已取消</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="下单时间">
              {getFieldDecorator("time_range")(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: "100%" }}
                  placeholder={[
                    formatMessage({ id: "form.date.placeholder.start" }),
                    formatMessage({ id: "form.date.placeholder.end" })
                  ]}
                />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="输入查找">
              {getFieldDecorator("value")(
                <Input placeholder="姓名/手机号/订单ID" />
              )}
            </FormItem>
          </Col>
          <Col>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
          </Col>
          <Col>
            <Button onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      historyLoading,
      data,
      page,
      total,
      orderHistory
    } = this.props;
    const { modalVisible, formValues, type, historyVisible } = this.state;

    const parentMethods = {
      type,
      formValues,
      handleModalVisible: this.handleModalVisible,
      handleEdit: this.handleEdit,
      updateFormValue: this.updateFormValue
    };

    const historyMethod = {
      data: orderHistory,
      modalVisible: historyVisible,
      handleModalVisible: this.handleHistoryVisible
    };

    return (
      <PageHeaderWrap title="伴手礼订单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="reload" type="primary" onClick={this.handleRefresh}>
                刷新
              </Button>
              <Button icon="export" type="primary" onClick={this.handleExport}>
                导出查询
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <Table
                rowKey={record => record.id}
                loading={loading || historyLoading}
                pagination={{
                  pageSize: 10,
                  current: page + 1,
                  total: total * 10,
                  onChange: (curPage, pageSize) => {
                    this.handlePageChange(curPage - 1, pageSize);
                  }
                }}
                dataSource={data}
                columns={this.columns}
                scroll={{ x: 1200 }}
              />
            </div>
          </div>
        </Card>
        <NewOrder {...parentMethods} modalVisible={modalVisible} />
        <OrderHistory {...historyMethod} isSouvenir />
      </PageHeaderWrap>
    );
  }
}
export default Souvenir;
