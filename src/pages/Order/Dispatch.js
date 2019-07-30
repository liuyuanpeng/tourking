import React, { PureComponent } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Button,
  Table,
  Card,
  Form,
  Row,
  Col,
  message,
  Divider,
  Badge,
  Tooltip
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import moment from "moment";
import RangeInput from "./rangeInput";
import ORDER_STATUS from "./orderStatus";
import DriverInput from "../Base/DriverInput";
import styles from "../index.less";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const OrderDetail = Form.create()(props => {
  const { modalVisible, handleModalVisible, formValues } = props;

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  const orderStatus = ORDER_STATUS.find(
    item => item.order_status === formValues.name
  );
  const orderStatusDesc = orderStatus ? orderStatus.desc : "";
  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title="订单详情"
      visible={modalVisible}
      onCancel={() => {
        handleModalVisible();
      }}
      footer={null}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="订单ID">
            <span>{formValues.id || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="类型">
            <span>
              {formValues.scene === "JIEJI"
                ? "接机/站"
                : formValues.scene === "SONGJI"
                ? "送机/站"
                : "预约用车"}
            </span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="下单时间">
            <span>
              {formValues.create_time
                ? moment(formValues.create_time).format("YYYY-MM-DD HH:mm")
                : ""}
            </span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车时间">
            <span>
              {formValues.start_time
                ? moment(formValues.start_time).format("YYYY-MM-DD HH:mm")
                : ""}
            </span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车地点">
            <span>{formValues.start_place || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="目的地">
            <span>{formValues.target_place || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="航班号">
            <span>{formValues.air_no || ""}</span>
          </FormItem>
        </Col>

        <Col>
          <FormItem {...labelLayout} label="乘车人姓名">
            <span>{formValues.username || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="联系电话">
            <span>{formValues.mobile || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人">
            <span>{formValues.contact || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人电话">
            <span>{formValues.contact_mobile || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="用户备注">
            <span>{formValues.remark || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="订单状态">
            <span>{orderStatusDesc}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="结算时间">
            <span>
              {formValues.settled_time
                ? formValues.settled_time.format("YYYY-MM-DD HH:mm")
                : ""}
            </span>
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

const DriverDispatch = Form.create()(props => {
  const {
    modalVisible,
    handleModalVisible,
    formValues,
    handleDriverDispatch,
    form
  } = props;

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleDriverDispatch(formValues.id, fieldsValue.driver_user_id);
    });
  };

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title="选择司机"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="选择司机">
            {form.getFieldDecorator("driver_user_id", {
              rules: [
                {
                  required: true,
                  message: "请选择司机"
                }
              ]
            })(<DriverInput />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ warning, loading }) => ({
  submitting: loading.effects["warning/fetchWarningPage"],
  data: warning.list,
  page: warning.page,
  total: warning.total,
  warning_no: warning.warning_no,
  urgent_no: warning.urgent_no,
  warning_and_urgent: warning.warning_and_urgent
}))
@Form.create()
class Dispatch extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    driverVisible: false,
    formValues: {},
    currentSelect: ""
  };

  columns = [
    {
      title: "上车时间",
      dataIndex: "start_time",
      key: "start_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "类型",
      dataIndex: "scene",
      key: "scene",
      render: text =>
        text === "JIEJI"
          ? "接机/站"
          : text === "SONGJI"
          ? "送机/站"
          : "预约用车"
    },
    {
      title: "状态",
      dataIndex: "auto_dispatch_time",
      key: "auto_dispatch_time",
      render: text => {
        return `已派单${
          text
            ? (
                moment()
                  .subtract(text)
                  .valueOf() /
                1000 /
                60
              ).toFixed(1)
            : 0
        }分钟`;
      }
    },
    {
      title: "下单时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "上车地点",
      dataIndex: "start_place",
      key: "start_place",
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
      title: "目的地",
      dataIndex: "target_place",
      key: "target_place",
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
      title: "预估时间",
      dataIndex: "time",
      key: "time"
    },
    {
      title: "用户姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "联系方式",
      dataIndex: "mobile",
      key: "mobile"
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
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a href="javascript:;" onClick={() => this.onReadonly(record)}>
            查看
          </a>
          <Divider type="vertical" />

          <a href="javascript:;" onClick={() => this.onDispatch(record)}>
            指派
          </a>
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = {};
    dispatch({
      type: "warning/fetchWarningPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取派单预警列表失败");
        }
      }
    });
  }

  onReadonly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true
    });
  };

  onDispatch = record => {
    this.setState({
      formValues: { ...record },
      driverVisible: true
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleDriverVisible = flag => {
    this.setState({
      driverVisible: !!flag
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;
    const { currentSelect } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      const {
        time_range,
        order_date,
        price_range,
        ...others
      } = this.searchKeys;

      this.searchKeys = { ...others, warning_status: currentSelect };

      if (order_date) {
        this.searchKeys = {
          ...this.searchKeys,
          create_start: order_date.startOf("day").valueOf(),
          create_end: order_date.endOf("day").valueOf()
        };
      }
      if (time_range) {
        this.searchKeys = {
          ...this.searchKeys,
          execute_start: values.time_range[0].startOf("day").valueOf(),
          execute_end: values.time_range[1].endOf("day").valueOf()
        };
      }

      if (price_range && (price_range.min || price_range.min === 0)) {
        this.searchKeys = {
          ...this.searchKeys,
          low_price: price_range.min
        };
      }
      if (price_range && (price_range.max || price_range.max === 0)) {
        this.searchKeys = {
          ...this.searchKeys,
          high_price: price_range.max
        };
      }
      dispatch({
        type: "order/exportWarning",
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
          aLink.download = "预警订单.xls";
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
        }
      });
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    const { currentSelect } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      const {
        time_range,
        order_date,
        price_range,
        ...others
      } = this.searchKeys;

      this.searchKeys = { ...others, warning_status: currentSelect };

      if (order_date) {
        this.searchKeys = {
          ...this.searchKeys,
          create_start: order_date.startOf("day").valueOf(),
          create_end: order_date.endOf("day").valueOf()
        };
      }
      if (time_range) {
        this.searchKeys = {
          ...this.searchKeys,
          execute_start: values.time_range[0].startOf("day").valueOf(),
          execute_end: values.time_range[1].endOf("day").valueOf()
        };
      }

      if (price_range && (price_range.min || price_range.min === 0)) {
        this.searchKeys = {
          ...this.searchKeys,
          low_price: price_range.min
        };
      }
      if (price_range && (price_range.max || price_range.max === 0)) {
        this.searchKeys = {
          ...this.searchKeys,
          high_price: price_range.max
        };
      }
      dispatch({
        type: "warning/fetchWarningPage",
        payload: {
          page: 0,
          size: 10,
          ...this.searchKeys,
          onFailure: msg => {
            message.error(msg || "获取派单预警列表失败!");
          }
        }
      });
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.setState({
      currentSelect: ""
    });
    this.searchKeys = { warning_status: "" };
    dispatch({
      type: "warning/fetchWarningPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取派单预警列表失败!");
        }
      }
    });
  };

  handleRefresh = () => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "warning/fetchWarningPage",
      payload: {
        page,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取派单预警列表失败!");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "warning/fetchWarningPage",
      payload: {
        page,
        size,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取派单预警列表失败");
        }
      }
    });
  };

  updateFormValue = params => {
    const { formValues } = this.state;
    this.setState({
      formValues: {
        ...formValues,
        ...params
      }
    });
  };

  onChangeSelect = select => {
    const { dispatch } = this.props;
    this.setState({
      currentSelect: select
    });
    this.searchKeys = {
      ...this.searchKeys,
      warning_status: select
    };
    dispatch({
      type: "warning/fetchWarningPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys
      },
      onFailure: msg => {
        message.error(msg || "获取派单预警列表失败!");
      }
    });
  };

  handleDriverDispatch = (order_id, driver_user_id) => {
    const { dispatch, page } = this.props;
    if (order_id && driver_user_id) {
      dispatch({
        type: "warning/dispatchDriver",
        payload: {
          data: {
            order_id,
            driver_user_id
          },
          params: {
            ...this.searchKeys,
            page,
            size: 10
          },
          onFailure: msg => {
            message.error(msg || "指派司机失败!");
          }
        }
      });
    }
    this.handleDriverVisible();
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={8}>
            <FormItem label="用户姓名">
              {getFieldDecorator("username")(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="订单ID">
              {getFieldDecorator("order_id")(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="目的地">
              {getFieldDecorator("target_place")(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="上车点">
              {getFieldDecorator("start_place")(<Input />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="下单日期">
              {getFieldDecorator("order_date")(<DatePicker />)}
            </FormItem>
          </Col>

          <Col>
            <FormItem label="上车时间">
              {getFieldDecorator("time_range")(
                <RangePicker
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
            <FormItem label="价格区间">
              {getFieldDecorator("price_range", {
                initialValue: { min: "", max: "" }
              })(<RangeInput />)}
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
      data,
      page,
      total,
      warning_no,
      urgent_no,
      warning_and_urgent
    } = this.props;
    const {
      modalVisible,
      driverVisible,
      formValues,
      currentSelect
    } = this.state;

    const parentMethods = {
      formValues,
      handleModalVisible: this.handleModalVisible
    };

    const driverMethods = {
      formValues,
      handleModalVisible: this.handleDriverVisible,
      handleDriverDispatch: this.handleDriverDispatch
    };

    return (
      <PageHeaderWrap title="派单预警">
        <Badge showZero className={styles.tabLabel} count={warning_and_urgent}>
          <a
            onClick={() => {
              this.onChangeSelect();
            }}
            style={{ color: currentSelect === "" ? "blue" : "#1890FF" }}
            href="javascript:;"
          >
            全部
          </a>
        </Badge>
        <Badge showZero className={styles.tabLabel} count={warning_no}>
          <a
            onClick={() => {
              this.onChangeSelect("WARNING");
            }}
            style={{ color: currentSelect === "WARNING" ? "blue" : "#1890FF" }}
            href="javascript:;"
          >
            警告
          </a>
        </Badge>
        <Badge showZero className={styles.tabLabel} count={urgent_no}>
          <a
            onClick={() => {
              this.onChangeSelect("URGENT");
            }}
            style={{ color: currentSelect === "URGENT" ? "blue" : "#1890FF" }}
            href="javascript:;"
          >
            紧急
          </a>
        </Badge>
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
                loading={loading}
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
                scroll={{ x: 2000 }}
              />
            </div>
          </div>
        </Card>
        <OrderDetail {...parentMethods} modalVisible={modalVisible} />
        <DriverDispatch {...driverMethods} modalVisible={driverVisible} />
      </PageHeaderWrap>
    );
  }
}
export default Dispatch;
