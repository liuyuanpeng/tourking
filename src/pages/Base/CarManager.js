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
import DriverInput from "./DriverInput";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const NewCar = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    car_types,
    drivers,
    city,
    sits
  } = props;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
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
      <FormItem {...labelLayout} label="车牌号">
        {readonly ? (
          <span>{formValues.car.car_no}</span>
        ) : (
          form.getFieldDecorator("car_no", {
            initialValue: formValues.car.car_no || "",
            rules: [{ required: true, message: "请输入车牌号" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="车辆类型">
        {readonly ? (
          <span>{formValues.chexing.name}</span>
        ) : (
          form.getFieldDecorator("chexing_id", {
            initialValue: formValues.car.chexing_id || "",
            rules: [{ required: true, message: "请选择车辆类型" }]
          })(
            <Select style={{ width: "100%" }}>
              {car_types &&
                car_types.map((item, index) => {
                  return (
                    <Option key={`${index}`} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="所属城市">
        {readonly ? (
          <span>{formValues.city.name}</span>
        ) : (
          form.getFieldDecorator("city_id", {
            initialValue:
              formValues.city && formValues.city.id ? formValues.city.id : "",
            rules: [{ required: true, message: "请选择所属城市" }]
          })(
            <Select style={{ width: "100%" }}>
              {city &&
                city.map((item, index) => {
                  return (
                    <Option key={`${index}`} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          )
        )}
      </FormItem>
      <FormItem {...labelLayout} label="座位类型">
        {readonly ? (
          <span>{formValues.zuowei.name}</span>
        ) : (
          form.getFieldDecorator("zuowei_id", {
            initialValue:
              formValues.zuowei && formValues.zuowei.id
                ? formValues.zuowei.id
                : "",
            rules: [{ required: true, message: "请选择所属城市" }]
          })(
            <Select style={{ width: "100%" }}>
              {sits &&
                sits.map((item, index) => {
                  return (
                    <Option key={`${index}`} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          )
        )}
      </FormItem>

      <FormItem {...labelLayout} label="颜色">
        {readonly ? (
          <span>{formValues.car.color}</span>
        ) : (
          form.getFieldDecorator("color", {
            initialValue: formValues.car.color || "",
            rules: [{ required: true, message: "请输入车辆颜色" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="司机">
        {readonly ? (
          <span>{formValues.driver.name}</span>
        ) : (
          form.getFieldDecorator("driver_user_id", {
            initialValue: formValues.car.driver_user_id || "",
            rules: [{ required: true, message: "请选择车辆司机" }]
          })(
            <DriverInput drivers={type === "edit" ? [formValues.user] : null} />
          )
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ car_type, city, sit, driver, car, loading }) => ({
  loading: loading.effects["car/fetchCarPage"],
  data: car.list,
  page: car.page,
  total: car.total,
  car_types: car_type.list,
  drivers: driver.list,
  city: city.list,
  sits: sit.list
}))
@Form.create()
export default class CarManager extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {
      car: {},
      driver: {},
      user: {},
      city: {},
      zuowei: {},
      chexing: {}
    },
    type: "add"
  };

  componentDidMount() {
    this.props.dispatch({
      type: "city/fetchCityList",
      payload: {
        onSuccess: city => {
          console.log(city);
          if (city && city.length) {
            this.props.dispatch({
              type: "sit/fetchSitList",
              payload: {
                onSuccess: sit => {
                  if (sit && sit.length) {
                    this.props.dispatch({
                      type: "car_type/fetchCarTypes",
                      payload: {
                        onSuccess: types => {
                          if (types && types.length) {
                            this.props.dispatch({
                              type: "car/fetchCarPage",
                              payload: {
                                page: 0,
                                size: 10,
                                onFailure: msg => {
                                  message.error(msg || "获取车辆列表失败");
                                }
                              }
                            });
                          } else {
                            message.error("请先配置车辆类型");
                          }
                        },
                        onFailure: msg => {
                          message.error(msg || "获取车型列表失败");
                        }
                      }
                    });
                  } else {
                    message.error("请先配置座位类型");
                  }
                },
                onFailure: msg => {
                  message.error(msg || "获取座位类型列表失败");
                }
              }
            });
          } else {
            message.error("请先配置城市列表");
          }
        },
        onFailure: msg => {
          message.error(msg || "获取城市列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {
        car: {},
        driver: {},
        user: {},
        city: {},
        zuowei: {},
        chexing: {}
      }
    });
  };

  handleAdd = fields => {
    const { dispatch, car_types, drivers } = this.props;
    dispatch({
      type: "car/saveCar",
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
      title: "车牌号",
      dataIndex: "car.car_no",
      key: "car.car_no"
    },
    {
      title: "司机",
      dataIndex: "user.name",
      key: "user.name"
    },
    {
      title: "所属城市",
      dataIndex: "city.name",
      key: "city.name"
    },
    {
      title: "车辆类型",
      dataIndex: "chexing.name",
      key: "chexing.name"
    },
    {
      title: "座位类型",
      dataIndex: "zuowei.name",
      key: "zuowei.name"
    },
    {
      title: "颜色",
      dataIndex: "car.color",
      key: "car.color"
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
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该车辆吗?"
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
      type: "car/saveCar",
      payload: {
        data: {
          ...formValues.car,
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
      formValues: {
        car: {},
        driver: {},
        user: {},
        city: {},
        zuowei: {},
        chexing: {}
      },
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
      type: "car/deleteCar",
      payload: {
        data: record.car.id,
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
        this.searchKey = values.car_no || "";
        dispatch({
          type: "car/fetchCarPage",
          payload: {
            page: 0,
            size: 10,
            car_no: this.searchKey || "",
            onFailure: msg => {
              message.error(msg || "获取车辆列表失败");
            }
          }
        });
      }
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={9}>
            <FormItem label="精确查找">
              {getFieldDecorator("car_no")(<Input placeholder="车牌号" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button onClick={this.handleSearch}>查询</Button>
          </Col>
        </Row>
      </Form>
    );
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "car/fetchCarPage",
      payload: {
        page,
        size,
        car_no: this.searchKey || "",
        onFailure: msg => {
          message.error(msg || "获取车辆列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, drivers, car_types, page, total, city, sits } = this.props;

    const { modalVisible, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      drivers,
      car_types,
      city,
      sits
    };
    return (
      <PageHeaderWrap title="车辆管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增车辆
                </Button>
              </div>
              <Table
                rowKey={record => record.car.id}
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
        <NewCar {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
