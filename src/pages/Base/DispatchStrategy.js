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
  message,
  Radio
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "./index.less";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

const NewDispatchStrategy = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    data
  } = props;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (type === "add") {
        const result =
          data instanceof Array
            ? data.find(item => item.weight === fieldsValue.weight)
            : null;
        if (result && result.length) {
          message.error("已存在同样的策略优先级，请修改!");
          return;
        }
        handleAdd(fieldsValue);
      } else if (type === "edit") {
        handleEdit(fieldsValue);
      }
    });
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const readonly = type === "readonly";

  const checkPositive = (rule, value, callback) => {
    if (value && value <= 0) {
      callback("请输入大于0的数字");
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={type === "add" ? "新增" : type === "readonly" ? "详情" : "编辑"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="派单策略">
        {readonly ? (
          <span>{formValues.strategy_name}</span>
        ) : (
          form.getFieldDecorator("strategy_name", {
            initialValue: formValues.strategy_name || "",
            rules: [{ required: true, message: "请输入策略名称" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="适用场景">
        {<span>接送机</span>}
      </FormItem>
      <FormItem {...labelLayout} label="触发条件">
        {readonly ? (
          <span>{`用车前${
            formValues.before_use_dispatch_hour
          }小时,触发自动派单`}</span>
        ) : (
          <div>
            用车前
            {form.getFieldDecorator("before_use_dispatch_hour", {
              initialValue:
                (formValues.before_use_dispatch_hour &&
                  formValues.before_use_dispatch_hour) ||
                "",
              rules: [
                { required: true, message: "请输入触发条件" },
                { validator: checkPositive }
              ]
            })(
              <NumberInput
                numberType="natural decimal"
                style={{ maxWidth: "60px" }}
              />
            )}
            小时，触发自动派单
          </div>
        )}
      </FormItem>
      <FormItem {...labelLayout} label="司机条件">
        {readonly ? (
          <span>
            {formValues.driver_status === "IDLE" ? "当前空闲" : "所有司机"}
          </span>
        ) : (
          form.getFieldDecorator("driver_status", {
            initialValue:
              formValues.driver_status === "IDLE" ? "IDLE" : "UNKNOWN",
            rules: [{ required: true, message: "请选择司机条件" }]
          })(
            <RadioGroup>
              <Radio value={"IDLE"}>当前空闲</Radio>
              <Radio value={"UNKNOWN"}>所有司机</Radio>
            </RadioGroup>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="距离条件">
        {readonly ? (
          <span>
            {formValues.distance_scope && formValues.distance_scope > 0
              ? `距离上车地点${formValues.distance_scope}公里以内`
              : "无限制"}
          </span>
        ) : (
          form.getFieldDecorator("distance_limit", {
            initialValue:
              formValues.distance_scope && formValues.distance_scope > 0
                ? "LIMITED"
                : "UNLIMITED",
            rules: [
              { required: true, message: "请选择距离条件" },
              {
                validator: checkPositive
              }
            ]
          })(
            <RadioGroup>
              <Radio value={"UNLIMITED"}>当前空闲</Radio>
              <Radio value={"LIMITED"}>
                距离上车地点
                {form.getFieldDecorator("distance_scope", {
                  initialValue:
                    formValues.distance_scope > 0
                      ? formValues.distance_scope
                      : ""
                })(
                  <NumberInput
                    numberType={"natural decimal"}
                    style={{ maxWidth: "60px" }}
                    disabled={
                      form.getFieldValue("distance_limit") !== "LIMITED"
                    }
                  />
                )}
                公里以内
              </Radio>
            </RadioGroup>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="司机评分">
        {readonly ? (
          <span>
            {formValues.driver_evaluate > 0
              ? `评分不低于${formValues.driver_evaluate}`
              : "无限制"}
          </span>
        ) : (
          form.getFieldDecorator("driver_evaluate_limit", {
            initialValue:
              formValues.driver_evaluate > 0 ? "LIMITED" : "UNLIMITED",
            rules: [{ required: true, message: "请选择距离条件" }]
          })(
            <RadioGroup>
              <Radio value={"UNLIMITED"}>无限制</Radio>
              <Radio value={"LIMITED"}>
                评分不低于
                {form.getFieldDecorator("driver_evaluate", {
                  initialValue:
                    formValues.driver_evaluate && formValues.driver_evaluate > 0
                      ? formValues.driver_evaluate
                      : ""
                })(
                  <NumberInput
                    numberType={"positive integer"}
                    style={{ width: "60px" }}
                    disabled={
                      form.getFieldValue("driver_evaluate_limit") !== "LIMITED"
                    }
                  />
                )}
              </Radio>
            </RadioGroup>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="执行时间">
        {readonly ? (
          <span>{formValues.auto_time}</span>
        ) : (
          form.getFieldDecorator("auto_time", {
            initialValue: formValues.auto_time || "",
            rules: [{ required: true, message: "请输入执行时间" }]
          })(
            <NumberInput
              numberType={"positive integer"}
              addonAfter={"秒"}
              style={{ width: "100%" }}
            />
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="策略优先级">
        {readonly ? (
          <span>{formValues.weight}</span>
        ) : (
          form.getFieldDecorator("weight", {
            initialValue: formValues.weight || "",
            rules: [{ required: true, message: "请输入策略优先级" }]
          })(
            <NumberInput
              numberType={"positive integer"}
              style={{ width: "100%" }}
            />
          )
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ dispatchStrategy, loading }) => ({
  loading: loading.effects["dispatchStrategy/fetchStrategyList"],
  data: dispatchStrategy.list
}))
@Form.create()
export default class PriceStrategy extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  componentDidMount() {
    this.props.dispatch({
      type: "dispatchStrategy/fetchStrategyList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取派单策略列表失败");
        }
      }
    });
  }

  handlePlanChange = value => {
    this.setState({
      currentPlan: value
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
    fields.before_use_dispatch_hour = fields.before_use_dispatch_hour;
    fields.strategy_description = fields.strategy_name;
    dispatch({
      type: "dispatchStrategy/saveStrategy",
      payload: {
        data: fields,
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
      title: "派单策略",
      dataIndex: "strategy_name",
      key: "strategy_name"
    },
    {
      title: "适用场景",
      dataIndex: "scene",
      key: "scene",
      render: text => "用于接送机"
    },
    {
      title: "触发条件",
      dataIndex: "before_use_dispatch_hour_description",
      key: "before_use_dispatch_hour_description",
      render: text => `用车前`
    },
    {
      title: "触发时间(小时)",
      dataIndex: "before_use_dispatch_hour",
      key: "before_use_dispatch_hour  "
    },
    {
      title: "司机条件",
      dataIndex: "driver_status",
      key: "driver_status",
      render: text => (text === "IDLE" ? "当前空闲" : "无限制")
    },
    {
      title: "距离条件",
      dataIndex: "driver_scope",
      key: "driver_scope",
      render: text => (text && parseInt(text) > 0 ? `${text}公里内` : "无限制")
    },
    {
      title: "司机评分",
      dataIndex: "driver_evaluate",
      key: "driver_evaluate",
      render: text => (text && parseInt(text) > 0 ? `不低于${text}` : "无限制")
    },
    {
      title: "策略优先级",
      dataIndex: "weight",
      key: "weight"
    },
    {
      title: "执行时间",
      dataIndex: "auto_time",
      key: "auto_time",
      render: text => (text ? text + "秒" : "")
    },
    {
      title: "操作",
      fixed: "right",
      key: "action",
      render: (text, record) => (
        <span>
          <a
            href="javascript:;"
            onClick={() => {
              this.onReadOnly(record);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
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
            title="确定删除该派单策略吗?"
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
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: "dispatchStrategy/saveStrategy",
      payload: {
        data: {
          ...formValues,
          ...info
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

  onReadOnly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly"
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "dispatchStrategy/deleteStrategy",
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

  render() {
    const { loading, data } = this.props;

    const { modalVisible, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      data
    };
    return (
      <PageHeaderWrap title="派单策略配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增派单策略
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                columns={this.columns}
                scroll={{ x: 1110 }}
              />
            </div>
          </div>
        </Card>
        <NewDispatchStrategy {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
