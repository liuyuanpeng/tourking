import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
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
  Icon,
  DatePicker,
  message,
  Tooltip
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";
import DriverInput from "./DriverInput";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

const CommentSetting = Form.create()(props => {
  const {
    modalVisible,
    comments,
    form,
    count,
    handleModalVisible,
    handleEdit
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const remove = k => {
    const keys = getFieldValue("keys");
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };
  const add = () => {
    const keys = getFieldValue("keys");
    const nextKeys = keys.concat(keys.length + 1);
    setFieldsValue({
      keys: nextKeys
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
    }
  };

  let keyValues = [];
  for (let i = 0; i < count; i++) {
    keyValues.push(i);
  }
  getFieldDecorator("keys", { initialValue: keyValues });
  const keys = getFieldValue("keys");
  const formItems = keys.map((k, index) => (
    <FormItem
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? "评价项" : ""}
      required={false}
      key={k}
    >
      {getFieldDecorator(`name[${k}]`, {
        initialValue: comments[k] || "",
        rules: [
          {
            required: true,
            message: "请输入数据或者删除此项"
          }
        ]
      })(<Input style={{ width: "calc(100% - 24px" }} />)}
      {keys.length > 1 ? (
        <Icon
          className="dynamic-delete-button"
          style={{ marginLeft: "10px" }}
          type="minus-circle-o"
          onClick={() => remove(k)}
        />
      ) : null}
    </FormItem>
  ));

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={"评价项设置"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        handleModalVisible();
      }}
    >
      {formItems}
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: "60%" }}>
          <Icon type="plus" /> 新增评价项
        </Button>
      </Form.Item>
    </Modal>
  );
});

@connect(({ driver, comments, loading }) => ({
  loading: loading.effects["driver/fetchDriverEvaluatePage"],
  data: driver.evaluate,
  page: driver.evaluatePage,
  total: driver.evaluateTotal,
  commentList: comments.list
}))
@Form.create()
export default class Driver extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.searchKeys = {};
  }

  state = {
    modalVisible: false,
    comments: [],
    timeEnable: false
  };

  componentDidMount() {
    this.searchParams = null;
    this.props.dispatch({
      type: "comments/fetchComments"
    });
    this.props.dispatch({
      type: "driver/fetchDriverEvaluatePage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取司机评价列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      comments: []
    });
  };

  columns = [
    {
      title: "司机姓名",
      dataIndex: "driver.name",
      key: "driver.name"
    },
    {
      title: "评分",
      dataIndex: "driver_evaluate.evaluate",
      key: "driver_evaluate.evaluate"
    },
    {
      title: "评价内容",
      dataIndex: "driver_evaluate.content",
      key: "driver_evaluate.content"
    },
    {
      title: "乘客",
      dataIndex: "order_user.nick_name",
      key: "order_user.nick_name",
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text || record.name}</span>
        </Tooltip>
      )
    },
    {
      title: "订单ID",
      dataIndex: "driver_evaluate.order_id",
      key: "driver_evaluate.order_id"
    },
    {
      title: "下单时间",
      dataIndex: "driver_evaluate.order_create_time",
      key: "driver_evaluate.order_create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "上车时间",
      dataIndex: "driver_evaluate.order_excute_time",
      key: "driver_evaluate.order_excute_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    }
  ];

  handleEdit = info => {
    const { dispatch } = this.props;
    dispatch({
      type: "comments/saveComments",
      payload: {
        data: {
          name: info.name ? info.name.filter(item => item).toString() : ""
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
      comments: [],
      modalVisible: false
    });
  };

  onEdit = e => {
    e.preventDefault();
    this.setState({
      comments: this.props.commentList,
      modalVisible: true
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.searchKeys = {};
        const { driver_user_id, time_range, type } = values;
        driver_user_id && (this.searchKeys.driver_user_id = driver_user_id);

        if (time_range && time_range.length == 2) {
          this.searchKeys.start = time_range[0].startOf("day").valueOf();
          this.searchKeys.end = time_range[0].endOf("day").valueOf();
        }
        type && (this.searchKeys.type = type);
        dispatch({
          type: "driver/fetchDriverEvaluatePage",
          payload: {
            ...this.searchKeys,
            page: 0,
            size: 10,
            onFailure: msg => {
              message.error(msg || "获取司机评价列表失败");
            }
          }
        });
      }
    });
  };

  disabledDate = current => {
    return current && current > moment().endOf("day");
  };

  onChangeType = type => {
    this.setState({
      timeEnable: true
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { timeEnable } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={9}>
            <FormItem label="服务司机">
              {getFieldDecorator("driver_user_id")(<DriverInput />)}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label="时间类型">
              {getFieldDecorator("type")(
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  onChange={this.onChangeType}
                >
                  <Option key="1">下单时间</Option>
                  <Option key="2">上车时间</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {timeEnable && (
            <Col span={9}>
              <FormItem label="选择时间">
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
          )}
          <Col span={5}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "driver/fetchDriverEvaluatePage",
      payload: {
        ...this.searchKeys,
        page,
        size,
        onFailure: msg => {
          message.error(msg || "获取司机评价列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, page, total } = this.props;

    const { modalVisible, comments } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleEdit: this.handleEdit,
      comments,
      count: comments ? comments.length : 0
    };
    return (
      <PageHeaderWrap title="司机评价">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button icon="setting" type="primary" onClick={this.onEdit}>
                  管理评价项
                </Button>
              </div>
              <Table
                rowKey={record => record.driver_evaluate.id}
                loading={loading}
                dataSource={data}
                pagination={{
                  pageSize: 10,
                  current: page + 1,
                  total: total * 10,
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page - 1, pageSize);
                  }
                }}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <CommentSetting {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
