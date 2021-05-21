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
  message,
  Divider,
  Tooltip
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import LocationInput from "@/components/LocationInput";
import moment from "moment";
import NumberInput from "@/components/NumberInput";
import ORDER_STATUS from "./orderStatus";
import styles from "../index.less";
import ShopInput from "../Settlement/shopInput";
import DriverInput from "../Base/DriverInput";
import OrderHistory from "@/components/OrderHistory";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const INIT_SCENE = ["JIEJI", "SONGJI", "ORDER_SCENE"].toString();

const NewOrder = Form.create()(props => {
  const {
    carTypes,
    consumeList,
    type,
    handleEdit,
    modalVisible,
    form,
    handleModalVisible,
    formValues,
    updateFormValue,
    city
  } = props;

  let origin = null;
  let destination = null;
  let zuowei_id = "";
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

  let consumeArr = [];
  if (formValues.scene && formValues.city_id) {
    const consume = consumeList.find(
      item =>
        item.consume.scene === formValues.scene &&
        item.consume.city_id === formValues.city_id
    );
    if (consume) {
      consumeArr = consume.car_levels ? consume.car_levels : [];
    }
  }

  const okHandle = () => {
    if (readonly) return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let zuowei_id = "";
      if (fieldsValue.chexing_id) {
        const selectConsume = consumeArr.find(
          item => item.chexing.id === fieldsValue.chexing_id
        );
        if (selectConsume) {
          zuowei_id = selectConsume.zuowei.id;
        }
      }
      form.resetFields();
      handleEdit({ ...fieldsValue, zuowei_id });
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
      start_place: value.address,
      time: value.time || 0,
      kilo: value.distance || 0
    });
    updateRoute(value);
  };

  const destinationChange = value => {
    updateFormValue({
      target_longitude: value.location.longitude,
      target_latitude: value.location.latitude,
      target_place: value.address,
      time: value.time || 0,
      kilo: value.distance || 0
    });
    updateRoute(value);
  };

  const changeScene = value => {
    updateFormValue({
      scene: value,
      chexing_id: undefined
    });
    form.setFieldsValue({
      chexing_id: undefined
    });
  };

  const changeCity = value => {
    updateFormValue({
      city_id: value,
      chexing_id: undefined
    });
    form.setFieldsValue({
      chexing_id: undefined
    });
  };

  const changeStartTime = value => {
    updateFormValue({
      start_time: value ? value.valueOf() : ""
    });
  };

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
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
              <span>
                {formValues.scene === "JIEJI"
                  ? "接机/站"
                  : formValues.scene === "SONGJI"
                  ? "送机/站"
                  : "单次用车"}
              </span>
            ) : (
              form.getFieldDecorator("scene", {
                rules: [{ required: true, message: "请选择订单类型" }],
                initialValue: formValues.scene || ""
              })(
                <Select style={{ width: "100%" }} onChange={changeScene}>
                  <Option value="JIEJI">接机/站</Option>
                  <Option value="SONGJI">送机/站</Option>
                </Select>
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="所属城市">
            {readonly ? (
              <span>
                {formValues.city_id
                  ? city.find(item => item.id === formValues.city_id).name
                  : ""}
              </span>
            ) : (
              form.getFieldDecorator("city_id", {
                rules: [{ required: true, message: "请选择城市" }],
                initialValue: formValues.city_id || ""
              })(
                <Select style={{ width: "100%" }} onChange={changeCity}>
                  {city.map(item => (
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
          <FormItem {...labelLayout} label="车型">
            {readonly ? (
              <span>
                {formValues.chexing_id && formValues.city_id
                  ? carTypes.find(item => item.id === formValues.chexing_id)
                      .name
                  : ""}
              </span>
            ) : (
              form.getFieldDecorator("chexing_id", {
                rules: [{ required: true, message: "请选择车型" }],
                initialValue: formValues.chexing_id || ""
              })(
                <Select style={{ width: "100%" }} onChange={changeChexing}>
                  {consumeArr.map(item => (
                    <Option key={item.chexing.id} value={item.chexing.id}>
                      {item.chexing.name}
                    </Option>
                  ))}
                </Select>
              )
            )}
          </FormItem>
        </Col>

        <Col>
          <FormItem {...labelLayout} label="上车时间">
            {readonly ? (
              <span>
                {formValues.start_time
                  ? moment(formValues.start_time).format("YYYY-MM-DD HH:mm")
                  : ""}
              </span>
            ) : (
              form.getFieldDecorator("start_time", {
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
                  onChange={changeStartTime}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: "HH:mm" }}
                  placeholder="上车时间"
                  style={{ width: "100%" }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车地点">
            {readonly ? (
              <span>{formValues.start_place}</span>
            ) : (
              form.getFieldDecorator("start_location", {
                rules: [
                  {
                    required: true,
                    message: "请选择上车地点"
                  }
                ],
                initialValue:
                  type === "edit"
                    ? {
                        address: formValues.start_place,
                        location: {
                          longitude: formValues.start_longitude,
                          latitude: formValues.start_latitude
                        }
                      }
                    : undefined
              })(
                <LocationInput
                  destination={destination}
                  onChange={originChange}
                />
              )
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="目的地">
            {readonly ? (
              <span>{formValues.target_place || ""}</span>
            ) : (
              form.getFieldDecorator("end_location", {
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
              })(<LocationInput origin={origin} onChange={destinationChange} />)
            )}
          </FormItem>
        </Col>
        {formValues.price && (
          <Col>
            <FormItem {...labelLayout} label="价格">
              <span>{formValues.price || ""}</span>
            </FormItem>
          </Col>
        )}
        <Col>
          <FormItem {...labelLayout} label="航班号">
            {readonly ? (
              <span>{formValues.air_no || ""}</span>
            ) : (
              form.getFieldDecorator("air_no", {
                initialValue: formValues.air_no || ""
              })(<Input />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="乘客姓名">
            {readonly ? (
              <span>{formValues.username || ""}</span>
            ) : (
              form.getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "请输入乘客姓名"
                  }
                ],
                initialValue: formValues.username || ""
              })(<Input />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="联系电话">
            {readonly ? (
              <span>{formValues.mobile || ""}</span>
            ) : (
              form.getFieldDecorator("mobile", {
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
              })(<NumberInput numberType="positive integer" />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人">
            {readonly ? (
              <span>{formValues.contact || ""}</span>
            ) : (
              form.getFieldDecorator("contact", {
                initialValue: formValues.contact || ""
              })(<Input />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="紧急联系人电话">
            {readonly ? (
              <span>{formValues.contact_mobile}</span>
            ) : (
              form.getFieldDecorator("contact_mobile", {
                rules: [
                  {
                    len: 11,
                    message: "请输入正确的手机号码"
                  }
                ],
                initialValue: formValues.contact_mobile || ""
              })(<NumberInput numberType="positive integer" />)
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="用户备注">
            {readonly ? (
              <span>{formValues.remark}</span>
            ) : (
              form.getFieldDecorator("remark", {
                initialValue: formValues.remark || ""
              })(<Input />)
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ consume, order, car_type, loading, city }) => ({
  loading: loading.effects["order/fetchOrderPage"],
  historyLoading: loading.effects["order/fetchOrderHistory"],
  data: order.list,
  page: order.page,
  total: order.total,
  carTypes: car_type.list,
  orderHistory: order.history,
  consumeList: consume.list,
  city: city.list
}))
@Form.create()
class Shuttle extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    historyVisible: false,
    formValues: {},
    timeType: undefined,
    type: "readonly"
  };

  columns = [
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
      title: "司机电话",
      dataIndex: "driver_mobile",
      key: "driver_mobile"
    },
    {
      title: "车牌号",
      dataIndex: "driver_car_no",
      key: "driver_car_no"
    },
    {
      title: "来源",
      dataIndex: "source",
      key: "source",
      textWrap: "word-break",
      render: (text, record) => record.shop_name || record.mobile
    },
    {
      title: "扫码商家",
      dataIndex: "source_shop_name",
      key: "source_shop_name"
    },
    {
      title: "扫码司机",
      dataIndex: "source_driver_user_name",
      key: "source_driver_user_name"
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
          : "单次用车"
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
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "航班号/班次",
      dataIndex: "air_no",
      key: "air_no"
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
              textOverflow: "ellipsis",
              textAlign: "center"
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
              textOverflow: "ellipsis",
              textAlign: "center"
            }}
          >
            {text}
          </div>
        </Tooltip>
      )
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
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "手续费",
      dataIndex: "refund_fee",
      key: "refund_fee"
    },
    {
      title: "实收金额",
      dataIndex: "final_price",
      key: "final_price",
      render: (text, record) => {
        return record.refund_fee ? record.refund_fee : record.price;
      }
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
          <a href="javascript:;" onClick={() => this.showHistory(record)}>
            历史
          </a>
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = { scene: INIT_SCENE };
    dispatch({
      type: "city/fetchCityList"
    });
    dispatch({
      type: "car_type/fetchCarTypes",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取车辆分类列表失败");
        }
      }
    });

    dispatch({
      type: "consume/fetchConsumeList",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取用车服务列表失败");
        }
      }
    });
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
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
      type: "order/cancelOrder",
      payload: {
        id: record.id,
        ...this.searchKeys,
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

  handleHistoryVisible = flag => {
    this.setState({
      historyVisible: !!flag
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = {
        ...values
      };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      if (!this.searchKeys.scene) {
        this.searchKeys.scene = INIT_SCENE;
      }
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
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = {
        ...values
      };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });

      if (!this.searchKeys.scene) {
        this.searchKeys.scene = INIT_SCENE;
      }
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
          page: 0,
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
    this.searchKeys = { scene: INIT_SCENE };
    dispatch({
      type: "order/fetchOrderPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
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
      start_time,
      chexing_id,
      start_location,
      end_location,
      route,
      ...others
    } = info;

    const params = {
      start_time: start_time.valueOf(),
      chexing_id,
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
      chexing_id !== formValues.chexing_id ||
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
    const newFormValues = {
      ...formValues,
      ...params
    };
    this.setState({
      formValues: {
        ...newFormValues,
        price: undefined
      }
    });

    const { dispatch } = this.props;
    const { scene, chexing_id, kilo, time, start_time, city_id } = newFormValues;
    if (scene && chexing_id && kilo && time && city_id) {
      dispatch({
        type: "order/getPrice",
        payload: {
          scene,
          chexing_id,
          kilo,
          time,
          start_time,
          onFailure: msg => {
            message.error(msg || "获取价格失败!");
          },
          onSuccess: price => {
            this.setState({
              formValues: {
                ...newFormValues,
                price
              }
            });
          }
        }
      });
    }
  };

  showHistory = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: "order/fetchOrderHistory",
      payload: {
        orderId: id,
        onSuccess: data => {
          if (!data || data.length <= 0) {
            message.info("暂无该订单的历史记录!");
          } else {
            this.handleHistoryVisible(true);
          }
        },
        onFailure: msg => {
          message.error(msg || "获取订单历史失败!");
        }
      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { timeType } = this.state;

    const labelLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    };

    return (
      <Form onSubmit={this.handleSearch} layout="flex">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col>
            <FormItem {...labelLayout} label="订单状态">
              {getFieldDecorator("order_status_list")(
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: "200px" }}
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
          <Col>
            <FormItem label="时间类型">
              {getFieldDecorator("type")(
                <Select
                  placeholder="请选择"
                  allowClear
                  onChange={this.onTypeChange}
                  style={{ width: "200px" }}
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
                    style={{ width: "200px" }}
                    placeholder={[
                      formatMessage({ id: "form.date.placeholder.start" }),
                      formatMessage({ id: "form.date.placeholder.end" })
                    ]}
                  />
                )}
              </FormItem>
            </Col>
          )}
          <Col>
            <FormItem label="订单类型">
              {getFieldDecorator("scene")(
                <Select placeholder="请选择订单类型" 
                style={{ width: "200px" }}>
                  <Option key="JIEJI">接机/站</Option>
                  <Option key="SONGJI">送机/站</Option>
                  {/* <Option key="ORDER_SCENE">单次用车</Option> */}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="商家来源">
              {getFieldDecorator("shop_id")(<ShopInput 
                    style={{ width: "200px" }} allowClear />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="扫码商家">
              {getFieldDecorator("source_shop_id")(<ShopInput 
                    style={{ width: "200px" }} allowClear />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="扫码司机">
              {getFieldDecorator("source_driver_user_id")(
                <DriverInput 
                style={{ width: "200px" }} allowClear />
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
      historyLoading,
      data,
      page,
      total,
      carTypes,
      orderHistory,
      consumeList,
      city
    } = this.props;
    const { modalVisible, formValues, type, historyVisible } = this.state;

    const parentMethods = {
      type,
      carTypes,
      consumeList,
      formValues,
      city,
      handleModalVisible: this.handleModalVisible,
      handleEdit: this.handleEdit,
      updateFormValue: this.updateFormValue
    };

    const historyMethod = {
      data: orderHistory,
      modalVisible: historyVisible,
      handleModalVisible: this.handleHistoryVisible
    };

    return (
      <PageHeaderWrap title="接送机/站管理">
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
                loading={loading || historyLoading}
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
                scroll={{ x: 3000 }}
              />
            </div>
          </div>
        </Card>
        <NewOrder {...parentMethods} modalVisible={modalVisible} />
        <OrderHistory {...historyMethod} />
      </PageHeaderWrap>
    );
  }
}
export default Shuttle;
