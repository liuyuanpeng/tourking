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
import { router } from "umi";
import CHARTERED from "./CHARTERED";
import { formatMessage } from "umi-plugin-react/locale";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

@connect(({ chartered, loading }) => ({
  loading: loading.effects["chartered/fetchCharteredPage"],
  data: chartered.list,
  page: chartered.page,
  total: chartered.total
}))
@Form.create()
export default class Charted extends PureComponent {
  static propTypes = {};
  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  componentDidMount() {
    this.searchKeys = {};
    this.props.dispatch({
      type: "chartered/fetchCharteredPage",
      payload: {
        data: {
          page: 0,
          size: 10
        },
        onFailure: msg => {
          message.error(msg || "获取包车模板失败!");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag
    });
  };

  columns = [
    {
      title: "路线id",
      dataIndex: "private_consume.id",
      key: "private_consume.id"
    },
    {
      title: "路线标题",
      dataIndex: "private_consume.name",
      key: "private_consume.name"
    },
    {
      title: "线路标签",
      dataIndex: "private_consume.tag",
      key: "private_consume.tag"
    },
    {
      title: "包车类型",
      dataIndex: "private_consume.scene",
      key: "private_consume.scene",
      render: text => (text === "DAY_PRIVATE" ? "按天包车" : "路线包车")
    },
    {
      title: "优先级",
      dataIndex: "private_consume.weight",
      key: "private_consume.weight"
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
    // dispatch({
    //   type: "car/saveCar",
    //   payload: {
    //     data: {
    //       ...formValues.car,
    //       ...info
    //     },
    //     onSuccess: () => {
    //       message.success("操作成功");
    //     },
    //     onFailure: msg => {
    //       message.error(msg || "操作失败");
    //     }
    //   }
    // });
    this.handleModalVisible();
  };



  onAdd = () => {
    this.props.dispatch({
      type: "formStepForm/resetFormData",
      payload: {
        mode: "add",
        current: "basic_info",
        step: {}
      }
    });
    router.push("stepform");
  };

  onEdit = record => {
    this.props.dispatch({
      type: "formStepForm/resetFormData",
      payload: {
        mode: "edit",
        current: "basic_info",
        step: {
          ...record.private_consume,
          roads:record.roads.concat()
        }
      }
    });
    router.push("stepform");
  };

  onReadOnly = record => {
    this.props.dispatch({
      type: "formStepForm/resetFormData",
      payload: {
        mode: "readonly",
        current: "basic_info",
        step: {
          ...record.private_consume,
          roads:record.roads.concat()
        }
      }
    });
    router.push("stepform");
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: "car/deleteCar",
    //   payload: {
    //     data: record.car.id,
    //     onSuccess: () => {
    //       message.success("删除成功");
    //     },
    //     onFailure: msg => {
    //       message.error(msg || "删除失败");
    //     }
    //   }
    // });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { scene, value, timeRange } = values;
        this.searchKeys = {};
        if (scene) {
          this.searchKeys.scene = scene;
        }
        if (value) {
          this.searchKeys.value = value;
        }
        if (timeRange && timeRange.length === 2) {
          console.log(timeRange, "timeRage");
          (this.searchKeys.start = moment(timeRange[0]).startOf("day")),
            valueOf();
          this.searchKeys.end = moment(timeRange[1].endOf("day").valueOf());
        }
        dispatch({
          type: "chartered/fetchCharteredPage",
          payload: {
            data: {
              page: 0,
              size: 10
            },
            params: { ...this.searchKeys },
            onFailure: msg => {
              message.error(msg || "搜索失败!");
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
          <Col span={8}>
            <FormItem label="包车分类">
              {getFieldDecorator("scene")(
                <Select
                  placeholder="请选择"
                  allowClear
                  style={{ width: "100%" }}
                >
                  {CHARTERED.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="创建时间">
              {getFieldDecorator("timeRange")(
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
          <Col>
            <FormItem label="输入查找">
              {getFieldDecorator("value")(<Input placeholder="输入关键字" />)}
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
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.searchKeys = {};
    dispatch({
      type: "chartered/fetchCharteredPage",
      payload: {
        data: {
          page: 0,
          size: 10
        },
        onFailure: msg => {
          message.error(msg || "获取包车模板失败!");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "chartered/fetchCharteredPage",
      payload: {
        data: {
          page,
          size
        },
        data: {
          ...this.searchKeys
        },
        onFailure: msg => {
          message.error(msg || "获取车辆列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, page, total } = this.props;

    const { modalVisible, type, formValues } = this.state;

    return (
      <PageHeaderWrap title="包车管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.onAdd()}
                >
                  新增线路
                </Button>
              </div>
              <Table
                rowKey={record => record.private_consume.id}
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
      </PageHeaderWrap>
    );
  }
}
