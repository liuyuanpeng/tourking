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
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import styles from "./index.less";
import NumberInput from "@/components/NumberInput";

const FormItem = Form.Item;
const { Option } = Select;

const RefundSetting = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleModalVisible,
    formValues,
    handleConfig
  } = props;

  const labelLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 18 }
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleConfig(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="退款设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        用车前
        <FormItem style={{ display: "inline-block", verticalAlign: "unset" }}>
          {form.getFieldDecorator("before_first_time", {
            initialValue: formValues.before_first_time || ""
          })(<NumberInput />)}
        </FormItem>
        小时，手续费
        <FormItem style={{ display: "inline-block", verticalAlign: "unset" }}>
          {form.getFieldDecorator("first_fund", {
            initialValue: formValues.first_fund || ""
          })(<NumberInput />)}
        </FormItem>
      </Row>
      <Row>
        用车前
        <FormItem style={{ display: "inline-block", verticalAlign: "unset" }}>
          {form.getFieldDecorator("before_second_time", {
            initialValue: formValues.before_second_time || ""
          })(<NumberInput />)}
        </FormItem>
        小时，手续费
        <FormItem style={{ display: "inline-block", verticalAlign: "unset" }}>
          {form.getFieldDecorator("second_fund", {
            initialValue: formValues.second_fund || ""
          })(<NumberInput />)}
        </FormItem>
      </Row>
      <Row>
        超过
        <FormItem style={{ display: "inline-block", verticalAlign: "unset" }}>
          {form.getFieldDecorator("limit_fund", {
            initialValue: formValues.limit_fund || ""
          })(<NumberInput />)}
        </FormItem>
        元，需人工审核
      </Row>
    </Modal>
  );
});

@connect(({ order, loading }) => ({
  loading: loading.effects["order/fetchRefundPage"],
  data: order.list,
  page: order.page,
  total: order.total,
  config: order.config
}))
@Form.create()
class Refund extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {}
  };

  columns = [
    {
      title: "退款状态",
      dataIndex: "order_status",
      key: "order_status",
      render: text =>
        text && text.indexOf("CANCEL") >= 0 ? "已退款" : "待退款"
    },
    {
      title: "微信号",
      dataIndex: "user_wxname",
      key: "user_wxname"
    },
    {
      title: "乘客姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "电话",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "订单金额",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "退款金额",
      dataIndex: "price",
      key: "refund_price"
    },
    {
      title: "申请时间",
      dataIndex: "time",
      key: "time"
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
        <span>
          <a href="javascript:;" onClick={() => this.handleRefund(record)}>
            放款
          </a>
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = {};
    dispatch({
      type: "order/fetchRefundConfig"
    });
    dispatch({
      type: "order/fetchRefundPage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取退款列表失败");
        }
      }
    });
  }

  handleRefund = record => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "order/refundOrder",
      payload: {
        id: record.id,
        ...this.searchKeys,
        page,
        size: 10,
        onSuccess: () => {
          message.success("已成功放款");
        },
        onFailure: msg => {
          message.error(msg || "放款失败");
        }
      }
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleSearch = e => {
    const { dispatch, page, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key=>{
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key]
        }
      })
      if (this.searchKeys.has_refund) {
        this.searchKeys.has_refund = this.searchKeys.has_refund === "true";
      }
      dispatch({
        type: "order/fetchRefundPage",
        payload: {
          page,
          size: 10,
          ...this.searchKeys,
          onFailure: msg => {
            message.error(msg || "获取退款列表失败!");
          }
        }
      });
    });
  };

  handleConfig = values => {
    const { dispatch, config } = this.props;
    dispatch({
      type: "order/saveRefundConfig",
      payload: {
        ...config,
        ...values,
        onSuccess: () => {
          message.success("设置成功");
        },
        onFailure: msg => {
          message.error(msg || "设置失败");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "order/fetchRefundPage",
      payload: {
        page,
        size,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取退款列表失败");
        }
      }
    });
  };

  onConfig = e => {
    const { config } = this.props;
    e.preventDefault();
    this.setState({
      formValues: {
        ...config
      },
      modalVisible: true
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { timeType } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={8}>
            <FormItem label="退款状态">
              {getFieldDecorator("has_refund")(
                <Select allowClear style={{ width: "100%" }}>
                  <Option value="true">已退款</Option>
                  <Option value="false">待退款</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="精确查找">
              {getFieldDecorator("value")(<Input placeholder="姓名/电话" />)}
            </FormItem>
          </Col>
          <Col>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, data, page, total } = this.props;
    const { modalVisible, formValues } = this.state;

    const parentMethods = {
      formValues,
      handleModalVisible: this.handleModalVisible,
      handleConfig: this.handleConfig
    };

    return (
      <PageHeaderWrap title="退款管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="setting" type="primary" onClick={this.onConfig}>
                退款设置
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
                scroll={{ x: 2080 }}
              />
            </div>
          </div>
        </Card>
        <RefundSetting {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
export default Refund;
