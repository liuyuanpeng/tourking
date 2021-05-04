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
  DatePicker,
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const NewCoupon = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    coupon_category,
    updateCouponCategory
  } = props;

  const handleTypeChange = value => {
    updateCouponCategory(value);
  };

  const readonly = type === "readonly";

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
      <FormItem {...labelLayout} label="类型">
        {readonly ? (
          <span>
            {formValues.coupon_category === "MANJIAN"
              ? "满减"
              : formValues.coupon_category === "XINYONGHU"
              ? "新用户"
              : "返利"}
          </span>
        ) : (
          form.getFieldDecorator("coupon_category", {
            initialValue: formValues.coupon_category || "MANJIAN",
            rules: [{ required: true, message: "请选择类型" }]
          })(
            <Select style={{ width: "100%" }} onChange={handleTypeChange}>
              <Option value="MANJIAN">满减</Option>
              <Option value="XINYONGHU">新用户</Option>
              <Option value="FANLI">返利</Option>
            </Select>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="优惠券名称">
        {readonly ? (
          <span>{formValues.name}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请填写名称" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="有效天数">
        {readonly ? (
          <span>{formValues.days}天</span>
        ) : (
          form.getFieldDecorator("days", {
            initialValue: formValues.days || "",
            rules: [{ required: true, message: "请填写有效天数" }]
          })(
            <NumberInput
              style={{ width: "100%" }}
              suffix="天"
              numberType="positive integer"
            />
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="库存">
        {readonly ? (
          <span>{formValues.total || "无限制"}</span>
        ) : (
          form.getFieldDecorator("total", {
            initialValue: formValues.total || ""
          })(
            <NumberInput
              style={{ width: "100%" }}
              numberType="positive integer"
              placeholder="不填写库存则无限制"
            />
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="满减金额">
        {readonly ? (
          <span>￥{formValues.limit_price}RMB</span>
        ) : (
          form.getFieldDecorator("limit_price", {
            initialValue: formValues.limit_price || "",
            rules: [{ required: true, message: "请填写满减金额" }]
          })(
            <NumberInput
              style={{ width: "100%" }}
              numberType="positive integer"
              prefix="￥"
              suffix="RMB"
            />
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="优惠金额">
        {readonly ? (
          <span>￥{formValues.price}RMB</span>
        ) : (
          form.getFieldDecorator("price", {
            initialValue: formValues.price || "",
            rules: [{ required: true, message: "请填写优惠金额" }]
          })(
            <NumberInput
              style={{ width: "100%" }}
              numberType="positive integer"
              prefix="￥"
              suffix="RMB"
            />
          )
        )}
      </FormItem>
      {coupon_category === "FANLI" && (
        <FormItem {...labelLayout} label="返利金额">
          {readonly ? (
            <span>￥{formValues.fanli}RMB</span>
          ) : (
            form.getFieldDecorator("fanli", {
              initialValue: formValues.fanli || "",
              rules: [{ required: true, message: "请填写返利金额" }]
            })(
              <NumberInput
                style={{ width: "100%" }}
                numberType="positive integer"
                prefix="￥"
                suffix="RMB"
              />
            )
          )}
        </FormItem>
      )}
      {coupon_category !== "XINYONGHU" && (
        <FormItem {...labelLayout} label="兑换开始">
          {readonly ? (
            <span>
              {formValues.start_time
                ? moment(formValues.start_time).format("YYYY-MM-DD HH:mm")
                : "无限制"}
            </span>
          ) : (
            form.getFieldDecorator("start_time", {
              initialValue: formValues.start_time
                ? moment(formValues.start_time)
                : null
            })(
              <DatePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
                placeholder="兑换开始时间,不填写无限制"
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            )
          )}
        </FormItem>
      )}
      {coupon_category !== "XINYONGHU" && (
        <FormItem {...labelLayout} label="兑换结束">
          {readonly ? (
            <span>
              {formValues.end_time
                ? moment(formValues.end_time).format("YYYY-MM-DD HH:mm")
                : "无限制"}
            </span>
          ) : (
            form.getFieldDecorator("end_time", {
              initialValue: formValues.end_time
                ? moment(formValues.end_time)
                : null
            })(
              <DatePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
                placeholder="兑换结束时间，不填写无限制"
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            )
          )}
        </FormItem>
      )}
    </Modal>
  );
});

@connect(({ coupon, loading }) => ({
  loading: loading.effects["coupon/fetchCouponList"],
  data: coupon.list
}))
@Form.create()
export default class Coupon extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add",
    coupon_category: ""
  };

  componentDidMount() {
    this.props.dispatch({
      type: "coupon/fetchCouponList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取活动优惠失败");
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
    const { dispatch, data } = this.props;
    const { start_time, end_time, ...others } = fields;
    const { coupon_category } = fields;
    if (coupon_category === "FANLI" || coupon_category === "XINYONGHU") {
      if (data && data.find(item => item.coupon_category === coupon_category)) {
        message.info("只能有一个返利或者新用户类型的活动优惠");
        this.handleModalVisible();
        return;
      }
    }

    const params = { ...others };
    if (start_time) {
      params.start_time = moment(start_time).valueOf();
    }
    if (end_time) {
      params.end_time = moment(end_time).valueOf();
    }
    dispatch({
      type: "coupon/saveCoupon",
      payload: {
        data: params,
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
      title: "类型",
      dataIndex: "coupon_category",
      key: "coupon_category",
      render: text =>
        text === "MANJIAN" ? "满减" : text === "XINYONGHU" ? "新用户" : "返利"
    },
    {
      title: "优惠券名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "满减金额",
      dataIndex: "limit_price",
      key: "limit_price"
    },
    {
      title: "优惠金额",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "有效天数",
      dataIndex: "days",
      key: "days"
    },
    {
      title: "返利金额",
      dataIndex: "fanli",
      key: "fanli"
    },
    {
      title: "兑换开始",
      dataIndex: "start_time",
      key: "start_time",
      render: start_time =>
        start_time ? moment(start_time).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      title: "兑换结束",
      dataIndex: "end_time",
      key: "end_time",
      render: end_time =>
        end_time ? moment(end_time).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      title: "库存",
      dataIndex: "total",
      key: "total"
    },
    {
      title: "已兑换",
      dataIndex: "receive",
      key: "receive"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a
            href="javascript:;"
            onClick={() => {
              this.onReadOnly(record);
            }}
          >
            查看
          </a>
          <Divider />
          <a
            href="javascript:;"
            onClick={() => {
              this.onEdit(record);
            }}
          >
            编辑
          </a>
        </span>
      )
    }
  ];

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const { start_time, end_time, ...others } = info;

    const data = { ...others };
    if (start_time) {
      data.start_time = moment(start_time).valueOf();
    }
    if (end_time) {
      data.end_time = moment(end_time).valueOf();
    }

    dispatch({
      type: "coupon/saveCoupon",
      payload: {
        data: {
          ...formValues,
          ...data
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
      type: "edit",
      coupon_category: record.coupon_category
    });
  };

  onReadOnly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly",
      coupon_category: record.coupon_category
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "coupon/deleteCoupon",
      payload: {
        data: record.id,
        onSuccess: () => {
          message.success("删除成功");
        },
        onFailure: msg => {
          message.error(msg || "删除失败");
        }
      }
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: "coupon/fetchCouponList",
          payload: {
            ...values,
            onFailure: msg => {
              message.error(msg || "获取活动优惠失败");
            }
          }
        });
      }
    });
  };

  updateCouponCategory = value => {
    this.setState({
      coupon_category: value
    });
  };

  render() {
    const { loading, data } = this.props;

    const { modalVisible, type, formValues, coupon_category } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      coupon_category,
      updateCouponCategory: this.updateCouponCategory
    };
    return (
      <PageHeaderWrap title="活动优惠">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增优惠券
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
        <NewCoupon {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
