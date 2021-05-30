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
import styles from "../index.less";
import moment from "moment";
import CarStrategySelection from "./CarStrategySelection";
import { uniqArr } from "@/utils/utils";
import SCENE from "../../constants/scene";

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
    handleEdit,
    city,
    changeState,
    isBAOCHE
  } = props;

  const { getFieldDecorator, getFieldValue } = form;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { car_levels } = fieldsValue;
      const car_type_ids = car_levels
        .map(item => item.chexing_id)
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
    if (value && value.chexing_id) {
      if (isBAOCHE && value.price) {
        callback();
      } else if (value.price_strategy_id && value.price) {
        callback();
      } else {
        callback("请输入完整数据或者删除此项");
      }
    }
    callback("请输入完整数据或者删除此项");
  };

  const changeScene = scene => {
    changeState({
      isBAOCHE: scene === "DAY_PRIVATE"
    });
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
                chexing_id: formValues.car_levels[k].chexing.id,
                price_strategy_id:
                  formValues.car_levels[k].price_strategy_id || "",
                zuowei_id: formValues.car_levels[k].zuowei.id,
                price: formValues.car_levels[k].price || ""
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
      })(<CarStrategySelection isBAOCHE={isBAOCHE} />)}
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
              {formValues.consume.scene === "JIEJI"
                ? "接机/站"
                : formValues.consume.scene === "SONGJI"
                ? "送机/站"
                : formValues.consume.scene === "JINGDIAN_PRIVATE"
                ? "景点包车"
                : formValues.consume.scene === "MEISHI_PRIVATE"
                ? "美食包车"
                : "按天包车"}
            </span>
          ) : (
            form.getFieldDecorator("scene", {
              initialValue: formValues.consume.scene || "",
              rules: [{ required: true, message: "请输入用车场景" }]
            })(
              <Select style={{ width: "100%" }} onChange={changeScene}>
                <Option value="JIEJI">接机/站</Option>
                <Option value="SONGJI">送机/站</Option>
                <Option value="DAY_PRIVATE">按天包车</Option>
                <Option value="JINGDIAN_PRIVATE">景点包车</Option>
                <Option value="MEISHI_PRIVATE">美食包车</Option>
              </Select>
            )
          )}
        </FormItem>
        <FormItem {...labelLayout} label="所属城市">
          {readonly ? (
            <span>
              {formValues.consume.city_id
                ? city.find(item => item.id === formValues.consume.city_id).name
                : ""}
            </span>
          ) : (
            form.getFieldDecorator("city_id", {
              initialValue: formValues.consume.city_id || "",
              rules: [{ required: true, message: "请选择所属城市" }]
            })(
              <Select style={{ width: "100%" }}>
                {city &&
                  city.map(item => (
                    <Option key={`${item.id}`} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            )
          )}
        </FormItem>
        {isBAOCHE && (
          <FormItem {...labelLayout} label="套餐选择">
            {readonly ? (
              <span>
                {formValues.consume.taocan === "meal_1"
                  ? "套餐一(8小时200公里)"
                  : "套餐二(8小时400公里)"}
              </span>
            ) : (
              form.getFieldDecorator("taocan", {
                initialValue: formValues.consume.taocan || "",
                rules: [{ required: true, message: "请选择套餐" }]
              })(
                <Select style={{ width: "100%" }}>
                  <Option value="meal_1">套餐一(8小时200公里)</Option>
                  <Option value="meal_2">套餐二(8小时400公里)</Option>
                </Select>
              )
            )}
          </FormItem>
        )}
        {isBAOCHE && (
          <FormItem {...labelLayout} label="套餐价格">
            {readonly ? (
              <span>
                {formValues.consume.taocan === "meal_1"
                  ? "套餐一(8小时200公里)"
                  : "套餐二(8小时400公里)"}
              </span>
            ) : (
              form.getFieldDecorator("show_price", {
                initialValue: formValues.consume.show_price || "",
                rules: [{ required: true, message: "套件价格" }]
              })(
                <NumberInput
                  value={formValues.consume.show_price}
                  prefix="￥"
                  suffix="/起"
                  numberType="integer"
                />
              )
            )}
          </FormItem>
        )}
        {readonly ? (
          <FormItem {...labelLayout} label="分级收费">
            <List
              bordered
              itemLayout="horizontal"
              dataSource={formValues.car_levels}
              renderItem={item => (
                <List.Item key={item.chexing.id}>
                  {" "}
                  {`${item.chexing.name}-${item.zuowei.name}- ${
                    item.price_strategy_name
                  }-[${
                    isBAOCHE
                      ? item.price + "元/天"
                      : item.price + "起" + item.plan_description || ""
                  }]`}
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

@connect(({ consume, loading, city }) => ({
  loading: loading.effects["consume/fetchConsumeList"],
  data: consume.list,
  city: city.list
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
    type: "add",
    isBAOCHE: false
  };

  componentDidMount() {
    this.props.dispatch({
      type: "car_type/fetchCarTypes"
    });
    this.props.dispatch({
      type: "sit/fetchSitList"
    });
    this.props.dispatch({
      type: "city/fetchCityList"
    });
    this.props.dispatch({
      type: "price/fetchPriceStrategyList"
    });
    this.props.dispatch({
      type: "consume/fetchConsumeList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取用车服务列表失败");
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
      item => item && item.consume.scene === fields.scene
    );
    if (result && result.length) {
      message.error("该用车类型已有用车服务");
      return;
    }
    const {
      car_levels,
      scene,
      description,
      city_id,
      taocan,
      show_price
    } = fields;
    const params = {
      car_levels,
      consume: {
        common_scene: "ORDER",
        description,
        scene,
        city_id,
        taocan: taocan || "",
        show_price: show_price || ""
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
      render: text => SCENE[text]
    },
    {
      title: "所属城市",
      dataIndex: "consume.city_id",
      key: "consume.city_id",
      render: text => {
        const { city } = this.props;
        const curCity = city.find(item => item.id === text);
        return curCity ? curCity.name : "";
      }
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
            title="确定删除该用车服务吗?"
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
    const { car_levels, taocan, show_price = 0, ...others } = info;
    const { consume } = formValues;
    dispatch({
      type: "consume/saveConsume",
      payload: {
        data: {
          car_levels,
          consume: {
            ...consume,
            scene: others.scene,
            city_id: others.city_id,
            description: others.description,
            taocan: taocan || "",
            show_price
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
      formValues: { consume: {}, car_levels: [] },
      modalVisible: false,
      type: "add"
    });
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit",
      isBAOCHE: record.consume.scene === "DAY_PRIVATE"
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

  changeState = newState => {
    this.setState({
      ...newState
    });
  };

  render() {
    const { loading, data, city } = this.props;

    const { modalVisible, type, formValues, isBAOCHE } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      city,
      changeState: this.changeState,
      isBAOCHE
    };
    return (
      <PageHeaderWrap title="用车服务配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {/* <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={this.onAdd}>
                  新增用车服务
                </Button>
              </div> */}
              <Table
                rowKey={record => record.consume.id}
                loading={loading}
                dataSource={data}
                pagination={false}
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
