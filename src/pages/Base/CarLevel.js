import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Tree,
  Card,
  Form,
  Row,
  Col,
  Icon,
  Button,
  Select,
  Input,
  InputNumber,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message,
  List
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "./index.less";
import moment from "moment";
import CarStrategySelection from "./CarStrategySelection";
import { uniqArr } from "@/utils/utils";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

let id = 0;

const NewLevel = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit
  } = props;

  const { getFieldDecorator, getFieldValue } = form;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { car_levels } = fieldsValue;
      const car_type_ids = car_levels
        .map(item => item.config_id)
        .filter(item => item);
      const car_type_ids_fixed = uniqArr(car_type_ids).filter(item => item);

      if (car_type_ids_fixed.length !== car_type_ids.length) {
        message.error("不允许对同一个类型的车型使用两种价格策略");
        return;
      }
      form.resetFields();
      if (type === "add") {
        handleAdd(fieldsValue);
      } else if (type === "edit") {
        handleEdit(fieldsValue);
      }
    });
  };

  const labelLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15 }
  };

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
  const readonly = type === "readonly";

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

  const checkSelection = (rule, value, callback) => {
    if (value && value.config_id && value.price_strategy_id) {
      callback();
    }
    callback("请输入完整数据或者删除此项");
  };

  let keyValues = [];
  if (type === "edit") {
    formValues.car_levels.forEach((item, index) => {
      keyValues.push(index);
    });
    id = formValues.car_levels.length;
  }
  getFieldDecorator("keys", { initialValue: keyValues });
  const keys = getFieldValue("keys");

  const formItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? "分级收费" : ""}
      required={false}
      key={k}
    >
      {getFieldDecorator(`car_levels[${k}]`, {
        initialValue:
          formValues.car_levels.length && formValues.car_levels[k]
            ? {
                config_id: formValues.car_levels[k].config_id,
                price_strategy_id: formValues.car_levels[k].price_strategy_id
              }
            : {},
        rules: [
          {
            required: true,
            message: "请输入完整数据或者删除此项"
          },
          {
            validator: checkSelection
          }
        ]
      })(<CarStrategySelection />)}
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
        form.resetFields();
        handleModalVisible();
      }}
    >
      <Form>
        <FormItem {...labelLayout} label="用车场景">
          {readonly ? (
            <span>
              {formValues.consume.scene === "JIEJI" ? "接机" : "送机"}
            </span>
          ) : (
            form.getFieldDecorator("scene", {
              initialValue: formValues.consume.scene || "",
              rules: [{ required: true, message: "请输入用车场景" }]
            })(
              <Select style={{ width: "100%" }}>
                <Option key="JIEJI">接机</Option>
                <Option key="SONGJI">送机</Option>
              </Select>
            )
          )}
        </FormItem>
        <FormItem {...labelLayout} label="用车类型">
          {readonly ? (
            <span>
              {formValues.consume.common_scene === "NOW"
                ? "立即用车"
                : "预约用车"}
            </span>
          ) : (
            form.getFieldDecorator("common_scene", {
              initialValue: formValues.consume.common_scene || "",
              rules: [{ required: true, message: "请输入用车类型" }]
            })(
              <Select style={{ width: "100%" }}>
                <Option key="NOW">立即用车</Option>
                <Option key="ORDER">预约用车</Option>
              </Select>
            )
          )}
        </FormItem>
        {readonly ? (
          <FormItem {...labelLayout} label="分级收费">
            <List
              bordered
              itemLayout="horizontal"
              dataSource={formValues.car_levels}
              renderItem={item => (
                <List.Item key={item.config_id}>
                  {" "}
                  {`${item.config_name}: ${
                    item.price_strategy_name
                  }(${item.plan_description || ""})`}
                </List.Item>
              )}
            />
          </FormItem>
        ) : (
          formItems
        )}
        {!readonly && (
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={add} style={{ width: "60%" }}>
              <Icon type="plus" /> 新增自定义分级
            </Button>
          </Form.Item>
        )}
        <FormItem {...labelLayout} label="备注">
          {readonly ? (
            <span>{formValues.consume.description || ""}</span>
          ) : (
            form.getFieldDecorator("description", {
              initialValue: formValues.consume.description || ""
            })(<Input style={{ width: "100%" }} />)
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ consume, loading }) => ({
  loading: loading.effects["consume/fetchConsumeList"],
  data: consume.list
}))
@Form.create()
export default class CarManager extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {
      consume: {},
      car_levels: []
    },
    type: "add"
  };

  componentDidMount() {
    this.props.dispatch({
      type: "car_type/fetchCarTypes"
    });
    this.props.dispatch({
      type: "price/fetchPriceStrategyList"
    });
    this.props.dispatch({
      type: "consume/fetchConsumeList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取车型分级列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {
        consume: {},
        car_levels: []
      }
    });
  };

  handleAdd = fields => {
    const { dispatch, data } = this.props;
    const result = data.find(
      item =>
        item &&
        item.consume.scene === fields.scene &&
        item.consume.common_scene === fields.common_scene
    );
    if (result && result.length) {
      message.error("该用车类型已有车型分级");
      return;
    }
    const { car_levels, scene, common_scene, description } = fields;
    const params = {
      car_levels,
      consume: {
        common_scene,
        description,
        scene
      }
    };
    dispatch({
      type: "consume/saveConsume",
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
      title: "用车场景",
      dataIndex: "consume.scene",
      key: "consume.scene",
      render: text => (text === "JIEJI" ? "接机" : "送机")
    },
    {
      title: "用车类型",
      dataIndex: "consume.common_scene",
      key: "consume.common_scene",
      render: text => (text === "NOW" ? "立即用车" : "预约用车")
    },
    {
      title: "备注",
      dataIndex: "consume.description",
      key: "consume.description"
    },
    {
      title: "操作",
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
            title="确定删除该车型分级吗?"
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
      type: "consume/saveConsume",
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
      formValues: { consume: {}, car_levels: [] },
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

  onAdd = e => {
    e.preventDefault();
    id = 0;
    this.handleModalVisible(true);
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
      type: "consume/deleteConsume",
      payload: {
        data: record.consume.id,
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
      <PageHeaderWrap title="车型分级配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={this.onAdd}>
                  新增车型分级
                </Button>
              </div>
              <Table
                rowKey={record => record.consume.id}
                loading={loading}
                dataSource={data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewLevel {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
