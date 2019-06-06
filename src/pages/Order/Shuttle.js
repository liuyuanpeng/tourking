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
  Popconfirm,
  message,
  Divider
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import LocationInput from "@/components/LocationInput";
import moment from "moment";
import NumberInput from "@/components/NumberInput";
import ORDER_STATUS from "./orderStatus";
import styles from "./index.less";
import queryString from "querystring";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

const NewOrder = Form.create()(props => {
  const {
    carTypes,
    type,
    handleEdit,
    modalVisible,
    form,
    handleModalVisible,
    formValues,
    updateFormValue
  } = props;

  let origin = null;
  let destination = null;
  if (formValues.start_longitude && formValues.start_latitude) {
    origin = {
      longitude: formValues.start_longitude,
      latitude: formValues.start_latitude
    };
  }
  if (formValues.target_longitude && formValues.target_latitude) {
    destination = {
      longitude: formValues.target_longitude,
      latitude: formValues.target_latitude
    };
  }
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

  form.getFieldDecorator("route", {
    initialValue: null
  });

  const updateRoute = value => {
    if (value.time && value.distance) {
      form.setFieldsValue({
        route: {
          time: value.time || 0,
          kilo: value.distance ? value.distance / 1000 : 0
        }
      });
    }
  };

  const originChange = value => {
    updateFormValue({
      start_longitude: value.location.longitude,
      start_latitude: value.location.latitude,
      start_place: value.address
    });
    updateRoute(value);
  };

  const destinationChange = value => {
    updateFormValue({
      target_longitude: value.location.longitude,
      target_latitude: value.location.latitude,
      target_place: value.address
    });
    updateRoute(value);
  };

  return (
    <Modal
      destroyOnClose
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
            {readonly ? (
              <span>{formValues.scene === "JIEJI" ? "接机" : "送机"}</span>
            ) : (
              form.getFieldDecorator("scene", {
                rules: [{ required: true, message: "请选择订单类型" }],
                initialValue: formValues.scene || ""
              })(
                <Select style={{ width: "100%" }}>
                  <Option value="JIEJI">接机</Option>
                  <Option value="SONGJI">送机</Option>
                </Select>
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="车型">
            {readonly ? (
              <span>{formValues.car_config_id || ""}</span>
            ) : (
              form.getFieldDecorator("car_config_id", {
                rules: [{ required: true, message: "请选择车型" }],
                initialValue: formValues.car_config_id || ""
              })(
                <Select style={{ width: "100%" }}>
                  {carTypes.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车时间">
            {form.getFieldDecorator("start_time", {
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
                format="YYYY-MM-DD hh:mm"
                showTime={{ format: "HH:mm" }}
                placeholder="上车时间"
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车地点">
            {form.getFieldDecorator("start_location", {
              rules: [
                {
                  required: true,
                  message: "请选择上车地点"
                }
              ],
              initialValue: readonly
                ? undefined
                : {
                    address: formValues.start_place,
                    location: {
                      longitude: formValues.start_longitude,
                      latitude: formValues.start_latitude
                    }
                  }
            })(
              <LocationInput
                destination={destination}
                onChange={originChange}
              />
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="目的地">
            {form.getFieldDecorator("end_location", {
              rules: [
                {
                  required: true,
                  message: "请选择目的地"
                }
              ],
              initialValue: readonly
                ? undefined
                : {
                    address: formValues.target_place,
                    location: {
                      longitude: formValues.target_longitude,
                      latitude: formValues.target_latitude
                    }
                  }
            })(<LocationInput origin={origin} onChange={destinationChange} />)}
          </FormItem>
        </Col>

        <Col>
          <FormItem {...labelLayout} label="航班号">
            {form.getFieldDecorator("air_no", {
              rules: [
                {
                  required: true,
                  message: "请输入航班号"
                }
              ],
              initialValue: formValues.air_no || ""
            })(<Input />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="乘客姓名">
            {form.getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: "请输入乘客姓名"
                }
              ],
              initialValue: formValues.username || ""
            })(<Input />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="联系电话">
            {form.getFieldDecorator("mobile", {
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
            })(<NumberInput numberType="positive integer" />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人">
            {form.getFieldDecorator("contact", {
              rules: [
                {
                  required: true,
                  message: "请输入紧急联系人"
                }
              ],
              initialValue: formValues.contact || ""
            })(<Input />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人电话">
            {form.getFieldDecorator("contact_mobile", {
              rules: [
                {
                  required: true,
                  message: "请输入紧急联系人电话"
                },
                {
                  len: 11,
                  message: "请输入正确的手机号码"
                }
              ],
              initialValue: formValues.contact_mobile || ""
            })(<NumberInput numberType="positive integer" />)}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="用户备注">
            {form.getFieldDecorator("remark", {
              initialValue: formValues.remark || ""
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ order, car_type, loading }) => ({
  loading: loading.effects["order/fetchOrderPage"],
  data: order.list,
  page: order.page,
  total: order.total,
  carTypes: car_type.list
}))
@Form.create()
class Shuttle extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    timeType: undefined,
    type: "readonly"
  };

  columns = [
    {
      title: "来源",
      dataIndex: "source",
      key: "source",
      textWrap: "word-break",
      render: (text, record) => {
        return record.mobile;
      }
    },
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
      title: "类型",
      dataIndex: "scene",
      key: "scene",
      render: text => (text === "JIEJI" ? "接机" : "送机")
    },
    {
      title: "乘车人姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "电话",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "紧急联系人",
      dataIndex: "contact",
      key: "contact"
    },
    {
      title: "上车时间",
      dataIndex: "start_time",
      key: "start_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD hh:mm") : "")
    },
    {
      title: "航班号/班次",
      dataIndex: "air_no",
      key: "air_no"
    },
    {
      title: "上车地点",
      dataIndex: "start_place",
      key: "start_place"
    },
    {
      title: "目的地",
      dataIndex: "target_place",
      key: "target_place"
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 200
    },
    {
      title: "下单时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD hh:mm") : "")
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
          <a href="javascript:;" onClick={() => this.onReadonly(record)}>
            查看
          </a>
          {record.order_status === "WAIT_APPROVAL_OR_PAY" && (
            <Divider type="vertical" />
          )}
          {record.order_status === "WAIT_APPROVAL_OR_PAY" && (
            <a href="javascript:;" onClick={() => this.onEdit(record)}>
              编辑
            </a>
          )}
          {record.order_status === "ACCEPTED" && <Divider type="vertical" />}
          {record.order_status === "ACCEPTED" && (
            <Popconfirm
              title="确定取消该订单吗?"
              onConfirm={() => {
                this.handleCancel(record);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">取消</a>
            </Popconfirm>
          )}
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = {};
    dispatch({
      type: "car_type/fetchCarTypes",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取车辆分类列表失败");
        }
      }
    });
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
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
      type: "shuttle/cancelOrder",
      payload: {
        data: record.id,
        params: {
          ...this.searchKeys
        },
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
    const { dispatch, page, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      if (this.searchKeys.time_range) {
        delete this.searchKeys.time_range;
        this.searchKeys = {
          ...this.searchKeys,
          start: values.time_range[0].startOf("day").valueOf(),
          end: values.time_range[1].endOf("day").valueOf()
        };
      }
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
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.searchKeys = {};
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
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

  onTypeChange = type => {
    this.setState({
      timeType: type
    });
  };

  disabledDate = current => {
    const { timeType } = this.state;
    if (timeType === "2") return false;
    return current && current > moment().endOf("day");
  };

  handleEdit = info => {
    const { dispatch, page } = this.props;
    const { formValues } = this.state;
    const {
      car_config_id,
      start_location,
      end_location,
      route,
      ...others
    } = info;

    const params = {
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
    this.setState({
      formValues: {
        ...formValues,
        ...params
      }
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
            <FormItem label="订单状态">
              {getFieldDecorator("order_status")(
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: "100%" }}
                >
                  {ORDER_STATUS.map(item => (
                    <Option key={item.name} value={item.name}>
                      {item.desc}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="时间类型">
              {getFieldDecorator("type")(
                <Select
                  placeholder="请选择"
                  allowClear
                  onChange={this.onTypeChange}
                  style={{ width: "100%" }}
                >
                  <Option value="1">下单时间</Option>
                  <Option value="2">上车时间</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {timeType && (
            <Col>
              <FormItem label="选择时间">
                {getFieldDecorator("time_range", {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: "validation.date.required" })
                    }
                  ]
                })(
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
          <Col span={8}>
            <FormItem label="订单类型">
              {getFieldDecorator("scene")(
                <Select placeholder="请选择订单类型" style={{ width: "100%" }}>
                  <Option key="JIEJI">接机</Option>
                  <Option key="SONGJI">送机</Option>
                </Select>
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
            <Button onClick={this.handleReset}>重置</Button>
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
    const { loading, data, page, total, carTypes } = this.props;
    const { modalVisible, formValues, type } = this.state;

    const parentMethods = {
      type,
      carTypes,
      formValues,
      handleModalVisible: this.handleModalVisible,
      handleEdit: this.handleEdit,
      updateFormValue: this.updateFormValue
    };

    return (
      <PageHeaderWrap title="接送机站管理">
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
                scroll={{ x: 2080 }}
              />
            </div>
          </div>
        </Card>
        <NewOrder {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
export default Shuttle;
