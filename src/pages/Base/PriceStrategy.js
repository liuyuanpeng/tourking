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
  Icon,
  List
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";
import DistanceAndPriceInput from "./DistanceAndPriceInput";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const STRATEGY_PLANS = [
  {
    name: "方案1",
    plan_type: "ONE",
    plan_description: "总费用=(公里数×里程费)*(1+夜间服务费)"
  },
  {
    name: "方案2",
    plan_type: "TWO",
    plan_description: "总费用=(基础费+公里数×里程费)*(1+夜间服务费)"
  },
  {
    name: "方案3",
    plan_type: "THREE",
    plan_description: "总费用=(基础费+时长(四舍五入)×时长费)*(1+夜间服务费)"
  },
  {
    name: "方案4",
    plan_type: "FOUR",
    plan_description:
      "总费用=(基础费+(公里数-起步公里数)×里程费)*(1+夜间服务费)"
  },
  {
    name: "方案5",
    plan_type: "FIVE",
    plan_description:
      "总费用=(基础费+公里数×里程费+时长×时长费+(公里数-远途界限)×远途费)*(1+夜间服务费)"
  },
  {
    name: "方案6",
    plan_type: "SIX",
    plan_description: "总费用=(价格区间收费 + 超出公里数×里程费)*(1+夜间服务费)"
  }
];

let id = 0;

const NewStrategy = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    currentPlan,
    handlePlanChange,
    type,
    handleEdit
  } = props;

  const SELECT_PLAN = STRATEGY_PLANS.find(
    item => item.plan_type === currentPlan
  );

  const remove = k => {
    const keys = form.getFieldValue("keys");
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  const add = () => {
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };
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
      } else if (type === "edit") {
        handleEdit(fieldsValue);
      }
    });
  };

  const labelLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  const formItemLayout = {};

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
    }
  };

  const readonly = type === "readonly";

  let keyValues = [];
  let distanceArr = [];
  let distanceObj = {};
  if (formValues.distance) {
    try {
      distanceObj = JSON.parse(formValues.distance);
      Object.keys(distanceObj).forEach((item, index) => {
        distanceArr.push({ distance: item, price: distanceObj[item] });
      });
    } catch (error) {
      console.log("parse error: ", error);
    }
  }
  if (type === "edit") {
    Object.keys(distanceObj).forEach((item, index) => {
      keyValues.push(index);
    });
    id = Object.keys(distanceObj).length;
  }
  form.getFieldDecorator("keys", { initialValue: keyValues });
  const keys = form.getFieldValue("keys");

  const formItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? labelLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? "分段收费" : ""}
      required={false}
      key={k}
    >
      {form.getFieldDecorator(`distance[${k}]`, {
        initialValue: type === "edit" ? distanceArr[k] : {},
        rules: [
          {
            required: true,
            message: "请输入完整数据或者删除此项"
          }
        ]
      })(<DistanceAndPriceInput />)}
      {keys.length > 1 ? (
        <a
          href="javascript:void();"
          style={{ verticalAlign: "top", marginLeft: "10px" }}
          onClick={() => remove(k)}
        >
          删除
        </a>
      ) : null}
    </Form.Item>
  ));

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
      <FormItem {...labelLayout} label="价格策略">
        {readonly ? (
          <span>{formValues.strategy_name}</span>
        ) : (
          form.getFieldDecorator("strategy_name", {
            initialValue: formValues.strategy_name || "",
            rules: [{ required: true, message: "请输入策略名称" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="备注">
        {readonly ? (
          <span>{formValues.strategy_description}</span>
        ) : (
          form.getFieldDecorator("strategy_description", {
            initialValue: formValues.strategy_description || ""
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="价格策略方案">
        {readonly ? (
          <span>{SELECT_PLAN.name}</span>
        ) : (
          form.getFieldDecorator("plan_type", {
            initialValue: formValues.plan_type || "ONE",
            rules: [{ required: true, message: "请选择价格策略方案" }]
          })(
            <Select onChange={handlePlanChange} style={{ width: "100%" }}>
              {STRATEGY_PLANS.map((item, index) => {
                return (
                  <Option key={`${index}`} value={item.plan_type}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="方案备注">
        <span>
          {formValues.plan_description || SELECT_PLAN.plan_description}
        </span>
      </FormItem>
      {currentPlan === "SIX" && readonly ? (
        <FormItem {...labelLayout} label="分段收费">
          <List
            bordered
            itemLayout="horizontal"
            dataSource={formValues.distance ? distanceArr : []}
            renderItem={(item, index) => (
              <List.Item key={index}>
                {`${item.distance}公里: ${item.price}元`}
              </List.Item>
            )}
          />
        </FormItem>
      ) : (
        formItems
      )}
      {currentPlan === "SIX" && !readonly && (
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={add} style={{ width: "60%" }}>
            <Icon type="plus" /> 新增分段里程
          </Button>
        </Form.Item>
      )}
      {currentPlan !== "ONE" && currentPlan !== "SIX" && (
        <FormItem {...labelLayout} label="基础费">
          {readonly ? (
            <span>{formValues.base_price}</span>
          ) : (
            form.getFieldDecorator("base_price", {
              initialValue: formValues.base_price || "",
              rules: [{ required: true, message: "请输入基础费" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      {currentPlan !== "THREE" && (
        <FormItem {...labelLayout} label="里程费">
          {readonly ? (
            <span>{formValues.kilo_price}</span>
          ) : (
            form.getFieldDecorator("kilo_price", {
              initialValue: formValues.kilo_price || "",
              rules: [{ required: true, message: "请输入里程费" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      {["THREE", "FIVE"].indexOf(currentPlan) !== -1 && (
        <FormItem {...labelLayout} label="时长费">
          {readonly ? (
            <span>{formValues.time_price}</span>
          ) : (
            form.getFieldDecorator("time_price", {
              initialValue: formValues.time_price || "",
              rules: [{ required: true, message: "请输入时长费" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      {currentPlan === "FOUR" && (
        <FormItem {...labelLayout} label="起步公里数">
          {readonly ? (
            <span>{formValues.start_kilo}</span>
          ) : (
            form.getFieldDecorator("start_kilo", {
              initialValue: formValues.start_kilo || "",
              rules: [{ required: true, message: "请输入起步公里数" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      {currentPlan === "FIVE" && (
        <FormItem {...labelLayout} label="界限公里数">
          {readonly ? (
            <span>{formValues.limit_kilo}</span>
          ) : (
            form.getFieldDecorator("limit_kilo", {
              initialValue: formValues.limit_kilo || "",
              rules: [{ required: true, message: "请输入界限公里数" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      {currentPlan === "FIVE" && (
        <FormItem {...labelLayout} label="远途费">
          {readonly ? (
            <span>{formValues.long_price}</span>
          ) : (
            form.getFieldDecorator("long_price", {
              initialValue: formValues.long_price || "",
              rules: [{ required: true, message: "请输入远途费" }]
            })(<NumberInput style={{ width: "100%" }} />)
          )}
        </FormItem>
      )}
      <FormItem {...labelLayout} label="夜间服务费">
        {readonly ? (
          <span>{formValues.night_percent}</span>
        ) : (
          form.getFieldDecorator("night_percent", {
            initialValue: formValues.night_percent || "",
            rules: [{ required: true, message: "请输入夜间服务费(22:00~7:00)" }]
          })(
            <NumberInput
              style={{ width: "100px", textAlign: "right" }}
              addonAfter="%"
            />
          )
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ price, loading }) => ({
  loading: loading.effects["price/fetchPriceStrategyList"],
  data: price.list
}))
@Form.create()
export default class PriceStrategy extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    currentPlan: "ONE",
    type: "add"
  };

  componentDidMount() {
    this.props.dispatch({
      type: "price/fetchPriceStrategyList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取价格策略列表失败");
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
    let distance = {};
    fields.distance &&
      fields.distance.forEach(item => {
        distance[item.distance] = item.price;
      });
    delete fields.keys;
    if (Object.keys(distance).length) {
      fields.distance = JSON.stringify(distance);
    } else if (fields.distance) {
      delete fields.distance;
    }
    dispatch({
      type: "price/savePriceStrategy",
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
      title: "价格策略",
      dataIndex: "strategy_name",
      key: "strategy_name"
    },
    {
      title: "备注",
      dataIndex: "strategy_description",
      key: "strategy_description"
    },
    {
      title: "价格策略方案",
      dataIndex: "plan_type",
      key: "plan_type",
      render: (text, record) => {
        const plan = STRATEGY_PLANS.find(
          item => item.plan_type === record.plan_type
        );
        return plan.name;
      }
    },
    {
      title: "总费用公式",
      dataIndex: "plan_description",
      key: "plan_description"
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
          <Divider type="vertical" />
          <a
            href="javascript:;"
            onClick={() => {
              this.onEdit(record);
            }}
          >
            编辑
          </a>
          {/* <Divider type="vertical" />
          <Popconfirm
            title="确定删除该价格策略吗?"
            onConfirm={() => {
              this.handleDelete(record);
            }}
            okText="是"
            cancelText="否"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm> */}
        </span>
      )
    }
  ];

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    let distance = {};
    info.distance &&
      info.distance.forEach(item => {
        distance[item.distance] = item.price;
      });
    delete info.keys;
    if (Object.keys(distance).length) {
      info.distance = JSON.stringify(distance);
    } else if (info.distance) {
      delete info.distance;
    }
    dispatch({
      type: "price/savePriceStrategy",
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
      type: "edit",
      currentPlan: record.plan_type
    });
  };

  onReadOnly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly",
      currentPlan: record.plan_type
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "price/deletePriceStrategy",
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
      currentPlan: this.state.currentPlan,
      handlePlanChange: this.handlePlanChange,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues
    };
    return (
      <PageHeaderWrap title="价格策略配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增价格策略
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                columns={this.columns}
                scroll={{ x: 3000 }}
              />
            </div>
          </div>
        </Card>
        <NewStrategy {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
